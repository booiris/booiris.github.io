---
title: "Rust For Screeps (2): 自定义存储模型"
date: 2023-07-22 21:05:20 
updated: 2023-07-22 23:34:26
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

### 实现
