---
title: "Rust For Screeps (3): 系统监控"
date: 2023-07-22 23:35:45
updated: 2023-11-02 12:59:16
tags: 
top: false
mathjax: true
categories:
  - screeps
author: booiris
---

> 参考 [Screeps 制作统计图表 - 简书](https://www.jianshu.com/p/de74baf6fb48)

首先说明本

[GitHub - booiris/rust-learning at screep\_log](https://github.com/booiris/rust-learning/tree/screep_log)




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
      - DOCKER_INFLUXDB_INIT_ORG=${}
      - DOCKER_INFLUXDB_INIT_BUCKET=${}

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