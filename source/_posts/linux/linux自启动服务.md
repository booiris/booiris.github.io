---
title: linux自启动服务 
date: 2022-08-20 14:29:28 
updated: 2022-08-20 14:47:15
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
User=your user name

[Install]
WantedBy=multi-user.target
```

```
sudo systemctl daemon-reload  #刷新
sudo systemctl start code-server
sudo systemctl enable code-server
```
