---
title: arch虚拟机安装 
date: 2022-08-04 00:02:01 
updated: 2022-08-04 00:09:44
tags: [] 
top: false
mathjax: true
categories: [ linux ]
author: booiris
---

### 查看ip地址

```bash
ip addr
```

### 时间同步

```bash
timedatectl set-ntp true
```

## 准备磁盘分区

### 显示所有分区

```bash
fdisk -l
```

### 开始分区

```bash
fdisk /dev/sda
```

分区过程参考![网址](https://ericclose.github.io/Installing-Arch-as-a-guest-with-UEFI-and-GPT.html#arch-chroot)

### 确认是否生效

```bash
 fdisk -l /dev/sda
```

### 格式化分区和设置swap分区

```bash
mkfs.fat -F32 /dev/sda1
mkswap /dev/sda2
mkfs.ext4 /dev/sda3 
```

### 启用交换分区

```bash
swapon /dev/sda2
```

### 挂载根目录

```bash
mount /dev/sda3 /mnt
```

### 挂载boot目录

```bash

```