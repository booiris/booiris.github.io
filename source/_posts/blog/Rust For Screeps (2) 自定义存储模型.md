---
title: "Rust For Screeps (2): 自定义存储模型"
date: 2023-07-22 21:05:20 
updated: 2023-07-22 22:57:19
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

	Each player has access to the global object `Memory` in which he/she may store any information 
	in the JSON format. 

```javascript
Memory.someData = {...};
```

可以看出 screeps 本身内置了一个 `Memory` 的对象实例。可以往其中添加各种属性来达到存储信息的目的。

### raw memory

`raw memory` 在这里被提到 [Global Objects | Screeps Documentation](https://docs.screeps.com/global-objects.html#Serialization)

	The Memory object is stored in the stringified form and is parsed each time upon the first in the 
	tick access from your script with the help of the `JSON.parse` method.

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

## 自定义内存存储实现
