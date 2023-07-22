---
title: "Rust For Screeps (2): 自定义内存模型"
date: 2023-07-22 21:05:20 
updated: 2023-07-22 22:34:42
tags: [] 
top: false
mathjax: true
categories: [ screeps ]
author: booiris
---

## Screeps 内存模型

screeps 的内存模型基本如图所示。

![image.png](https://cdn.jsdelivr.net/gh/booiris-cdn/img//20230722221333.png)

其中存在两种类型的 memory，一个是 `memory object` ，另一个是 `raw memory` 。

### memory object

`memory object` 的具体介绍在 [Global Objects | Screeps Documentation](https://docs.screeps.com/global-objects.html#Memory-object)。

	Each player has access to the global object `Memory` in which he/she may store any information in the JSON format. All the changes written in it are automatically stored using `JSON.stringify` and passed from tick to tick, allowing you memorize the setting, your own decisions, and temporary data.

```javascript
Memory.someData = {...};
```

可以看出

### raw memory

## Rust 内存模型

## 自定义内存模型实现
