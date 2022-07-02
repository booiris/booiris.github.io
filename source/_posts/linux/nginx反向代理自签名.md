---
title: nginx反向代理自签名 
date: 2022-07-02 16:49:11 
updated: 2022-07-02 19:31:19
tags: [] 
top: false
mathjax: true
categories: [ linux ]
author: booiris
---

## 自签名ca证书

首先创建cert文件夹保存证书。

```bash
mkdir cert
```

然后创建配置文件cert.cnf，注意如果时ip自签名就在your_IP填写自己的ip，如果是自签名域名就是在your_domain写自己的域名。

[dn]下CN字段是ca根服务器地址，alt_names下是ca验证的ip和域名地址，一般情况下这两个是一样的。

```
[req] 
prompt = no 
default_bits = 4096
default_md = sha256
distinguished_name = dn 
x509_extensions = v3_req

[dn] 
C=CN
ST=Shanghai
L=Shanghai
O=TEST
OU=Testing Domain
CN=$your_IP or $your_domain
emailAddress=admin@localhost

[v3_req]
basicConstraints=CA:TRUE
keyUsage=digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
extendedKeyUsage=serverAuth
subjectAltName=@alt_names

[alt_names]
IP.1=$your_IP
DNS.1=$your_domain
```

根据配置文件生成证书。

```bash
openssl req -new -newkey rsa:2048 -days 365 -nodes -x509 -keyout cert.key -out cert.crt  -config cert.cnf
```

当前目录下生成两个文件cert.crt和cert.key，至此自签名步骤完成。

## nginx反向代理

docker拉取nginx镜像。

```bash
docker pull nginx
```

新建一个容器获取config文件。

```bash
docker run -d  --name nginx nginx
docker cp nginx:/etc/nginx/nginx.conf ./nginx.conf
docker stop nginx
docker rm nginx
```

在config文件的http内加入如下内容。

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

使用nginx反向代理。

```bash
docker run -d --restart=always -p $your_port:443 --name nginx -v "$PWD"/nginx.conf:/etc/nginx/nginx.conf -v "$PWD"/cert:/cert nginx
```

更新nginx

```bash
#测试配置文件
docker exec nginx nginx -t 
#更新nginx配置
docker exec nginx nginx -s reload
```
