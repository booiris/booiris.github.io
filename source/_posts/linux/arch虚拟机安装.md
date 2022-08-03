---
title: arch虚拟机安装 
date: 2022-08-04 00:02:01 
updated: 2022-08-04 00:12:11
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
mkdir /mnt/boot
mount /dev/sda1 /mnt/boot
```

## 安装系统

### 修改镜像源

```bash
vim /etc/pacman.d/mirrorlist
```

添加 `Server = http://mirrors.aliyun.com/archlinux/$repo/os/$arch` 镜像

如果安装时报错 `ERROR: 5984EA8F3C could not be locally signed` 解决办法：

```bash
rm -fr /etc/pacman.d/gnupg
umount /etc/pacman.d/gnupg
rm -fr /etc/pacman.d/gnupg
pacman-key --init
pacman-key --populate archlinux
pacman -Sy archlinux-keyring
```

### 安装系统和网络插件

```bash
pacstrap /mnt base linux networkmanager
```

## 配置系统

### 生成fstab文件

```bash
genfstab -U /mnt >> /mnt/etc/fstab
```

### 进入chroot
```bash
arch-chroot /mnt
```

### 设置时区

```bash
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

### 设置硬件时间同步

```bash
hwclock --systohc
```

### 安装vim

```bash
pacman -S vim
```

### 语言设置

```bash
 vim /etc/locale.gen
 en_US
 zh_CN
```

### 生成语言

```bash
locale-gen
```

### 设置默认语言

```bash
echo LANG=en_US.UTF-8 > /etc/locale.conf
```

### 创建host文件

```bash
echo YourNewHostname > /etc/hostname
```

### 添加host
```
vim /etc/hosts
# Static table lookup for hostnames.  
# See hosts(5) for details.  
127.0.0.1   localhost  
::1         localhost  
127.0.1.1   YourNewHostname.localdomain    YourNewHostname
```

### 开启网络服务

```bash
systemctl enable NetworkManager
```

### 设置 root 用户密码
```bash
passwd
```

## 安装引导程序

UEFI 系统：
```bash
pacman -S grub efibootmgr
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id="Arch Linux" --recheck
grub-mkconfig -o /boot/grub/grub.cfg 
```

## 完成安装

```bash
exit
umount -R /mnt
reboot
```