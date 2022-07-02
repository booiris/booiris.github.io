---
title: nginx反向代理自签名 
date: 2022-07-02 16:49:11 
updated: 2022-07-02 16:55:39
tags: [] 
top: false
mathjax: true
categories: [ linux ]
author: booiris
---

docker拉取nginx镜像

```bash
docker pull nginx
```

新建一个容器获取config文件

```bash
docker run -d  --name nginx nginx
docker cp nginx:/etc/nginx/nginx.conf ./nginx.conf
docker stop nginx
docker rm nginx
```

shi

```bash
docker run -d --restart=always -p 22223:443 --name nginx -v "$PWD"/nginx.conf:/etc/nginx/nginx.conf -v "$PWD"/cert:/cert nginx
```
