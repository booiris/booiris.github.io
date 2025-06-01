---
title: "Rust For Screeps (3): 系统监控"
date: 2023-07-22 23:35:45
updated: 2023-11-02 13:32:15
tags: 
top: false
mathjax: true
categories:
  - screeps
author: booiris
---

> 参考 [Screeps 制作统计图表 - 简书](https://www.jianshu.com/p/de74baf6fb48)

首先说明: 本文使用 docker 将监控系统部署在自有服务器上，所以先决条件是一台能公网访问的服务器(

## 整体流程

![image.png](https://cdn.jsdelivr.net/gh/booiris-cdn/img@main/20231102131635.png)

## 具体实现

### 记录当前状态存入内存

在 [Screeps 制作统计图表 - 简书](https://www.jianshu.com/p/de74baf6fb48) 中使用的是 [memory object](Rust%20For%20Screeps%20(2)%20自定义存储模型.md#memory%20object) 存储系统信息。遗憾的是在 rust 中无法使用 `memory` 对象，但是 screeps 还有另一个存储信息的地方，那就是 [raw memory](Rust%20For%20Screeps%20(2)%20自定义存储模型.md#raw%20memory) 。

`raw memory` 可以存储 10 MB 的序列化后的内容，它由一个个 `segment` 组成，每个`segment` 最多存储 100 KB 内容。所以可以指定一段 `segment` 用于存储当前系统的状态。

```rust
fn log(&self) {
	let status_segement = raw_memory::segments();
	let status = Status::get_status();
	status_segement.set(STATUS_INDEX, status.into());
}
```

### 访问内存并解析内存内容

[GitHub - booiris/rust-learning at screep\_log](https://github.com/booiris/rust-learning/tree/screep_log)

### 将信息存储到时序数据库中

### 使用 Grafana 制作图表

```bash
version: '2'
services:
  sync:
    restart: unless-stopped
    build:
      context: ./sync
      dockerfile: Dockerfile
    image: sync:1
    volumes:
      - ./sync/log:/log
    depends_on:
      - influxdb

# https://hub.docker.com/_/influxdb 查看参数含义
  influxdb:
    image: influxdb:latest
    restart: unless-stopped
    volumes:
      - ./influxdb-data:/var/lib/influxdb2
      - ./influxdb-config:/etc/influxdb2
    environment:
      - DOCKER_INFLUXDB_INIT_MODE=setup
      - DOCKER_INFLUXDB_INIT_USERNAME=${username}
      - DOCKER_INFLUXDB_INIT_PASSWORD=${pwd}
      - DOCKER_INFLUXDB_INIT_ORG=${org}
      - DOCKER_INFLUXDB_INIT_BUCKET=${bucket}

# https://grafana.com/docs/grafana/latest/setup-grafana/installation/docker/ 查看参数含义
  grafana:
    image: grafana/grafana:latest
    restart: unless-stopped
    ports:
      - '12002:3000'
    volumes:
      - ./grafana-data:/var/lib/grafana
      - ./grafana-provisioning/:/etc/grafana/provisioning
    depends_on:
      - influxdb
    user: "$UID:$GID"
    environment:
      - GF_SECURITY_ADMIN_USER=${GRAFANA_USERNAME}
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
```
