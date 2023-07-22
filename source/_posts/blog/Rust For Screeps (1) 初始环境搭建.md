---
title: "Rust For Screeps (1): 初始环境搭建"
date: 2023-07-22 19:29:29 
updated: 2023-07-22 20:42:17
tags: [] 
top: false
mathjax: true
categories: [ blog,screeps ]
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

文件中wasm_module

`src/lib.rs` 为 rust 的实现入口。

```rust
use js_sys::JsString;
use screeps::game;
use web_sys::console;

pub use log::LevelFilter::*;

struct JsLog;
struct JsNotify;

impl log::Log for JsLog {
    fn enabled(&self, _: &log::Metadata<'_>) -> bool {
        true
    }
    fn log(&self, record: &log::Record<'_>) {
        console::log_1(&JsString::from(format!("{}", record.args())));
    }
    fn flush(&self) {}
}
impl log::Log for JsNotify {
    fn enabled(&self, _: &log::Metadata<'_>) -> bool {
        true
    }
    fn log(&self, record: &log::Record<'_>) {
        game::notify(&format!("{}", record.args()), None);
    }
    fn flush(&self) {}
}

pub fn setup_logging(verbosity: log::LevelFilter) {
    fern::Dispatch::new()
        .level(verbosity)
        .format(|out, message, record| {
            out.finish(format_args!(
                "({}) {}: {}",
                record.level(),
                record.target(),
                message
            ))
        })
        .chain(Box::new(JsLog) as Box<dyn log::Log>)
        .chain(
            fern::Dispatch::new()
                .level(log::LevelFilter::Warn)
                .format(|out, message, _record| {
                    let time = game::time();
                    out.finish(format_args!("[{}] {}", time, message))
                })
                .chain(Box::new(JsNotify) as Box<dyn log::Log>),
        )
        .apply()
        .expect("expected setup_logging to only ever be called once per instance");
}
```

`src/logging.rs` 为辅助文件，用于日志的实现。

```rust
use js_sys::JsString;
use screeps::game;
use web_sys::console;

pub use log::LevelFilter::*;

struct JsLog;
struct JsNotify;

impl log::Log for JsLog {
    fn enabled(&self, _: &log::Metadata<'_>) -> bool {
        true
    }
    fn log(&self, record: &log::Record<'_>) {
        console::log_1(&JsString::from(format!("{}", record.args())));
    }
    fn flush(&self) {}
}
impl log::Log for JsNotify {
    fn enabled(&self, _: &log::Metadata<'_>) -> bool {
        true
    }
    fn log(&self, record: &log::Record<'_>) {
        game::notify(&format!("{}", record.args()), None);
    }
    fn flush(&self) {}
}

pub fn setup_logging(verbosity: log::LevelFilter) {
    fern::Dispatch::new()
        .level(verbosity)
        .format(|out, message, record| {
            out.finish(format_args!(
                "({}) {}: {}",
                record.level(),
                record.target(),
                message
            ))
        })
        .chain(Box::new(JsLog) as Box<dyn log::Log>)
        .chain(
            fern::Dispatch::new()
                .level(log::LevelFilter::Warn)
                .format(|out, message, _record| {
                    let time = game::time();
                    out.finish(format_args!("[{}] {}", time, message))
                })
                .chain(Box::new(JsNotify) as Box<dyn log::Log>),
        )
        .apply()
        .expect("expected setup_logging to only ever be called once per instance");
}
```
