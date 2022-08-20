---
title: linux自启动服务 
date: 2022-08-20 14:29:28 
updated: 2022-08-20 14:29:28 
tags: [] 
top: false
mathjax: true
categories: [ linux ]
author: booiris
---

自启动文件放在 `/usr/lib/systemd/system`

```bash
[Unit]
Description=code-server

[Service]
Type=simple
ExecStart=/usr/bin/code-server

[Install]
WantedBy=multi-user.target
```