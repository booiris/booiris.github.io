---
title: "Rust For Screeps (1): 初始环境搭建"
date: 2023-07-22 19:29:29 
updated: 2023-07-22 21:21:57
tags: [] 
top: false
mathjax: true
categories: [ screeps ]
author: booiris
---

> 参考 [GitHub - rustyscreeps/screeps-starter-rust: Starter Rust AI for Screeps, the JavaScript-based MMO game](https://github.com/rustyscreeps/screeps-starter-rust/)

### 安装相关cli

```bash
cargo install cargo-screeps
```

命令包含了构建代码、上传代码等操作。

### 下载模板文件

```bash
git clone https://github.com/rustyscreeps/screeps-starter-rust.git
cd screeps-starter-rust
```

模板 (版本:[d91b60f9a13eb0bd763b094acb6a1d749bb1b12f](https://github.com/rustyscreeps/cargo-screeps/tree/d91b60f9a13eb0bd763b094acb6a1d749bb1b12f)) 中包含的文件:

```bash
./
├── Cargo.toml
├── example-screeps.toml
├── javascript
│   └── main.js
├── LICENSE
├── README.md
└── src
    ├── lib.rs
    └── logging.rs
```

### 模板文件说明

`example-screeps.toml` 用于 `cargo-screeps` 的配置。

`javascript/main.js` 为游戏主入口，其中内容如下。

```javascript
"use strict";
let wasm_module;

// replace this with the name of your module
const MODULE_NAME = "screeps-starter-rust";

function console_error(...args) {
    console.log(...args);
    Game.notify(args.join(' '));
}

module.exports.loop = function () {
    try {
        if (wasm_module) {
            wasm_module.loop();
        } else {
            // attempt to load the wasm only if there's enough bucket to do a bunch of work this tick
            if (Game.cpu.bucket < 500) {
                console.log("we are running out of time, pausing compile!" + JSON.stringify(Game.cpu));
                return;
            }

            // delect the module from the cache, so we can reload it
            if (MODULE_NAME in require.cache) {
                delete require.cache[MODULE_NAME];
            }
            // load the wasm module
            wasm_module = require(MODULE_NAME);
            // load the wasm instance!
            wasm_module.initialize_instance();
            // run the setup function, which configures logging
            wasm_module.setup();
            // go ahead and run the loop for its first tick
            wasm_module.loop();
        }
    } catch (error) {
        console_error("caught exception:", error);
        if (error.stack) {
            console_error("stack trace:", error.stack);
        }
        console_error("resetting VM next tick.");
        wasm_module = null;
    }
}
```

文件中 `wasm_module` 保存了 wasm 的实例。如果 wasm 的实例存在，就调用 loop 函数运行游戏逻辑。如果 wasm 的实例不存在 (由于更新代码或 screeps 进行了内存回收等原因导致实列被销毁)，**重新载入 wasm 并且调用 setup 函数进行初始化，然后再运行游戏逻辑**。

`src/logging.rs` 为辅助文件，用于日志的实现。基本上就是进行 log 格式的创建，不做过多说明。在 setup 阶段调用一下 `setup_logging` 函数就行。

`src/lib.rs` 为 rust 的实现逻辑入口。

```rust
use std::cell::RefCell;
use std::collections::{hash_map::Entry, HashMap};

use log::*;
use screeps::{
    constants::{ErrorCode, Part, ResourceType},
    enums::StructureObject,
    find, game,
    local::ObjectId,
    objects::{Creep, Source, StructureController},
    prelude::*,
};
use wasm_bindgen::prelude::*;

mod logging;

// add wasm_bindgen to any function you would like to expose for call from js
#[wasm_bindgen]
pub fn setup() {
    logging::setup_logging(logging::Info);
}

// this is one way to persist data between ticks within Rust's memory, as opposed to
// keeping state in memory on game objects - but will be lost on global resets!
thread_local! {
    static CREEP_TARGETS: RefCell<HashMap<String, CreepTarget>> = RefCell::new(HashMap::new());
}

// this enum will represent a creep's lock on a specific target object, storing a js reference
// to the object id so that we can grab a fresh reference to the object each successive tick,
// since screeps game objects become 'stale' and shouldn't be used beyond the tick they were fetched
#[derive(Clone)]
enum CreepTarget {
    Upgrade(ObjectId<StructureController>),
    Harvest(ObjectId<Source>),
}

// to use a reserved name as a function name, use `js_name`:
#[wasm_bindgen(js_name = loop)]
pub fn game_loop() {
    debug!("loop starting! CPU: {}", game::cpu::get_used());
    // mutably borrow the creep_targets refcell, which is holding our creep target locks
    // in the wasm heap
    CREEP_TARGETS.with(|creep_targets_refcell| {
        let mut creep_targets = creep_targets_refcell.borrow_mut();
        debug!("running creeps");
        for creep in game::creeps().values() {
            run_creep(&creep, &mut creep_targets);
        }
    });

    debug!("running spawns");
    let mut additional = 0;
    for spawn in game::spawns().values() {
        debug!("running spawn {}", String::from(spawn.name()));

        let body = [Part::Move, Part::Move, Part::Carry, Part::Work];
        if spawn.room().unwrap().energy_available() >= body.iter().map(|p| p.cost()).sum() {
            // create a unique name, spawn.
            let name_base = game::time();
            let name = format!("{}-{}", name_base, additional);
            // note that this bot has a fatal flaw; spawning a creep
            // creates Memory.creeps[creep_name] which will build up forever;
            // these memory entries should be prevented (todo doc link on how) or cleaned up
            match spawn.spawn_creep(&body, &name) {
                Ok(()) => additional += 1,
                Err(e) => warn!("couldn't spawn: {:?}", e),
            }
        }
    }

    info!("done! cpu: {}", game::cpu::get_used())
}

fn run_creep(creep: &Creep, creep_targets: &mut HashMap<String, CreepTarget>) {
    if creep.spawning() {
        return;
    }
    let name = creep.name();
    debug!("running creep {}", name);

    let target = creep_targets.entry(name);
    match target {
        Entry::Occupied(entry) => {
            let creep_target = entry.get();
            match creep_target {
                CreepTarget::Upgrade(controller_id)
                    if creep.store().get_used_capacity(Some(ResourceType::Energy)) > 0 =>
                {
                    if let Some(controller) = controller_id.resolve() {
                        creep
                            .upgrade_controller(&controller)
                            .unwrap_or_else(|e| match e {
                                ErrorCode::NotInRange => {
                                    let _ = creep.move_to(&controller);
                                }
                                _ => {
                                    warn!("couldn't upgrade: {:?}", e);
                                    entry.remove();
                                }
                            });
                    } else {
                        entry.remove();
                    }
                }
                CreepTarget::Harvest(source_id)
                    if creep.store().get_free_capacity(Some(ResourceType::Energy)) > 0 =>
                {
                    if let Some(source) = source_id.resolve() {
                        if creep.pos().is_near_to(source.pos()) {
                            creep.harvest(&source).unwrap_or_else(|e| {
                                warn!("couldn't harvest: {:?}", e);
                                entry.remove();
                            });
                        } else {
                            let _ = creep.move_to(&source);
                        }
                    } else {
                        entry.remove();
                    }
                }
                _ => {
                    entry.remove();
                }
            };
        }
        Entry::Vacant(entry) => {
            // no target, let's find one depending on if we have energy
            let room = creep.room().expect("couldn't resolve creep room");
            if creep.store().get_used_capacity(Some(ResourceType::Energy)) > 0 {
                for structure in room.find(find::STRUCTURES, None).iter() {
                    if let StructureObject::StructureController(controller) = structure {
                        entry.insert(CreepTarget::Upgrade(controller.id()));
                        break;
                    }
                }
            } else if let Some(source) = room.find(find::SOURCES_ACTIVE, None).get(0) {
                entry.insert(CreepTarget::Harvest(source.id()));
            }
        }
    }
}

```

其中需要关注两个函数 `setup` 和 `game_loop` 。

`setup` 为 wasm 实例创建的时候调用的函数，在其中可以实现日志初始化、数据初始化的逻辑。

`game_loop` 通过 `#[wasm_bindgen(js_name = loop)]` 的标注 (rust 中成为过程宏) 将其改名为wasm 里运行的 loop 函数，这也是游戏中每 tick 运行的主逻辑。
