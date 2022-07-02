---
title: nginx反向代理自签名 
date: 2022-07-02 16:49:11 
updated: 2022-07-02 17:40:48
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

使用nginx反向代理

```bash
docker run -d --restart=always -p $your_port:443 --name nginx -v "$PWD"/nginx.conf:/etc/nginx/nginx.conf -v "$PWD"/cert:/cert nginx
```

```json
server{
	listen  443 ssl;
	server_name $your_ip or website;

	ssl_certificate      /cert/server.crt;
	ssl_certificate_key  /cert/server.key;

	ssl_session_cache    shared:SSL:1m;
	ssl_session_timeout  5m;
	ssl_ciphers          ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;    #加密算法
	ssl_protocols TLSv1 TLSv1.1 TLSv1.2;    #安全链接可选的加密协议
	ssl_prefer_server_ciphers on;   #使用服务器端的首选算法

	location / {
		proxy_pass $your_proxy_ip:$your_proxy_port;
	}
}
```

openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 -keyout cert.key -out cert.crt  -config cert.cnf
