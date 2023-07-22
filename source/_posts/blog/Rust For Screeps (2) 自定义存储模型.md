---
title: "Rust For Screeps (2): 自定义存储模型"
date: 2023-07-22 21:05:20 
updated: 2023-07-22 23:53:12
tags: [] 
top: false
mathjax: true
categories: [ screeps ]
author: booiris
---

## Screeps 存储模型

screeps 的存储模型基本如图所示。

![image.png](https://cdn.jsdelivr.net/gh/booiris-cdn/img//20230722224904.png)

其中存在两种类型的 memory，一个是 `memory object` ，另一个是 `raw memory` 。

### memory object

`memory object` 的具体介绍在 [Global Objects | Screeps Documentation](https://docs.screeps.com/global-objects.html#Memory-object)。

	Each player has access to the global object `Memory` in which he/she may store any 
	information in the JSON format. 

```javascript
Memory.someData = {...};
```

可以看出 screeps 本身内置了一个 `Memory` 的对象实例。可以往其中添加各种属性来达到存储信息的目的。

### raw memory

`raw memory` 在这里被提到 [Global Objects | Screeps Documentation](https://docs.screeps.com/global-objects.html#Serialization)

	The Memory object is stored in the stringified form and is parsed each time upon the first 
	in the tick access from your script with the help of the `JSON.parse` method.

可以看出 `Memory` 的对象实例最终会被序列化为字符串存储到 `raw memory` 中，在游戏的每个 tick 进行传递。

### 存储传递过程

在游戏的进行每个 tick ，screeps 系统会反序列化 `raw memory` 到 `Memory Object` (代码见 [game.js](https://github.com/screeps/engine/blob/c6c4fc9e656f160e0e0174b0dd9a817d2dd18976/src/game/game.js#L470)、[game.js](https://github.com/screeps/engine/blob/c6c4fc9e656f160e0e0174b0dd9a817d2dd18976/src/game/game.js#L478C13-L478C76))

```javascript
_.extend(runCodeCache[userId].globals, {
	RawMemory: runCodeCache[userId].memory,
	console: runCodeCache[userId].fakeConsole
});
```

```javascript
Object.defineProperty(runCodeCache[userId].globals, 'Memory', {
	configurable: true,
	enumerable: true,
	get() {

		try {
			runCodeCache[userId].memory._parsed = JSON.parse(runCodeCache[userId].memory.get() || "{}");
			runCodeCache[userId].memory._parsed.__proto__ = null;
		}
		catch (e) {
			runCodeCache[userId].memory._parsed = null;
		}

		Object.defineProperty(runCodeCache[userId].globals, 'Memory', {
			configurable: true,
			enumerable: true,
			value: runCodeCache[userId].memory._parsed
		});

		return runCodeCache[userId].memory._parsed;
	}
});
```

在每个 tick 最后，再将 `Memory` 序列化到 `raw memory` 里。所以，**在每个 tick 间，真正传递的是 `raw memory`**。

## Rust 存储模型

从上面可以知道，Screeps 有一个 JavaScript 对象 `Memory` 保存需要的信息。但是要从 rust 中访问 JavaScript 里的对象十分麻烦。同时 [screeps-game-api](https://github.com/rustyscreeps/screeps-game-api/) 里似乎只有 `raw memory` 的获取方法，而没有 `memory` 对象的获取方法。

所以显然易见，我们的存储信息需要放到 rust 里。在上一章的示例代码中，有这样一个变量:

```rust
// this is one way to persist data between ticks within Rust's memory, as opposed to
// keeping state in memory on game objects - but will be lost on global resets!
thread_local! {
    static CREEP_TARGETS: RefCell<HashMap<String, CreepTarget>> = RefCell::new(HashMap::new());
}
```

我们可以使用 `RefCell` 创建一个全局变量 (类似 javaScript 里的 `Memory` 对象) 存储到 wasm 的线性内存里。只要 wasm 的实例没有被销毁，那么这个全局变量就可以随着 wasm 实例在每个 tick 传递。

## 自定义存储实现

通过 rust 的全局变量我们实现了信息跨 tick 存储，但注意到注释中存在着一句话。

	keeping state in memory on game objects - but will be lost on global resets!

Screeps 系统存在着一个机制，就是 `global reset` ，会定时销毁 javaScript 里的对象并且重建，这就导致了这会销毁 wasm 的实例，进而导致存储的信息丢失。

### raw memory 使用

从第一部分可以知道 `raw memory` 可以认为是 Screeps 中的持久性存储。所以如果可以在每个 tick 最后把 rust 里的全局变量序列化到 `raw memory` 里，然后在 wasm 实例初始化时再从 `raw memory` 里反序列化回 rust 的全局变量，这就实现了信息的跨 tick 保存而又不会受到 `global reset` 的影响。

### rust 部分实现

Screeps 的 api 存在对 `raw memory` 的操作方法 [Screeps Documentation](https://docs.screeps.com/api/#RawMemory)。

<img src="https://cdn.jsdelivr.net/gh/booiris-cdn/img//20230722234254.png" width=65% >

储存全局变量参考代码:

```rust
thread_local! {
    pub static GLOBAL_LONG_MEMORY: RefCell<GlobalMemory> = RefCell::new(GlobalMemory::new());
}

GLOBAL_LONG_MEMORY.with(|mem| {
	let mem = &*mem.borrow();
	let mem: String = mem.into();
	raw_memory::set(&JsString::from_str(&mem).expect("can conver global mem to string"))
});
```

其中 `GlobalMemory` 是一个结构体，并且实现了 `into String` 的方法，所以可以使用 `mem.into()` 转换为 `String` 类型，最后通过 api 的 `raw_memory::set` 方法将全局变量保存到 `raw memory` 中。

初始化全局变量参考代码:

```rust
GLOBAL_LONG_MEMORY.with(|mem| {
	let raw_memory: String = raw_memory::get()
		.try_into()
		.expect("can not get raw memory");
	if let Ok(raw_mem) = GlobalMemory::try_from(raw_memory) {
		*mem.borrow_mut() = raw_mem;
	} else {
		log::error!("old mem can not match new struct!");
		*mem.borrow_mut() = GlobalMemory::new();
	}
});
```

可以看出，**存在无法从 `raw memory` 还原回全局变量的情况** ( `GlobalMemory` 的结构出现了破坏性的更改导致无法从之前的结构反序列化回去)。这时候需要考虑构建一个在空的全局变量下还能继续运行并且还原的系统。

### javaScript 部分实现

本来存储 `raw memory` 的过程在 rust 中实现即可。但是存在一个问题，

实现代码如下:

```javaScript
"use strict";
let wasm_module;

const MODULE_NAME = "rust-screep-world";

function console_error(...args) {
    console.log(...args);
    Game.notify(args.join(' '));
}

let mem_proxy = { creeps: {} }

module.exports.loop = function () {
    delete global.Memory;
    global.Memory = mem_proxy
    try {
        if (wasm_module) {
            wasm_module.loop();
        } else {
            // attempt to load the wasm only if there's enough bucket to do a bunch of work this tick
            if (Game.cpu.bucket < 500) {
                console.log("we are running out of time, pausing compile!!!" + JSON.stringify(Game.cpu));
                return;
            }

            // delect the module from the cache, so we can reload it
            if (MODULE_NAME in require.cache) {
                delete require.cache[MODULE_NAME];
            }
            // replace this initialize function on the module
            wasm_module = require(MODULE_NAME);
            // load the wasm instance!
            wasm_module.initialize_instance();
            // run the setup function, which configures logging
            wasm_module.setup();
            // go ahead and run the loop for its first tick
            wasm_module.loop();
        }
    } catch (error) {
        console_error("caught exception err:", error);
        if (error.stack) {
            console_error("stack trace:", error.stack);
        }
        console_error("resetting VM next tick.");
        wasm_module = null;
    }
    mem_proxy = global.Memory
}
```
