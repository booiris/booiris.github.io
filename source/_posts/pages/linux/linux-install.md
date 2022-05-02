---
title: linux-install 
date: 2022-05-01 23:30:29 
updated: 2022-05-02 23:35:50
tags: [] 
top: false 
mathjax: true 
categories: linux 
author: booiris
---

# WSL

```
	wsl --list
```

* 卸载对应的系统

```
	wsl --unregister Ubuntu
```

* 设置默认系统

```
wslconfig /setdefault Name
```

## Ubuntu

### 换源

1. 备份`sources.list`文件

```
sudo cp /etc/apt/sources.list /etc/apt/sources.list.bak
```

2. 编辑`/etc/apt/sources.list`文件

```
sudo vim /etc/apt/sources.list
```

3. 在文件前面添加下面的条目(阿里源)

```
deb http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
```

4. 更新

```
sudo apt update
```

### oh-my-bash 美化

1. 安装

```
bash -c "$(curl -fsSL https://raw.githubusercontent.com/ohmybash/oh-my-bash/master/tools/install.sh)"
```

### 安装软件

#### 安装i3wm

1. 安装

```
sudo apt install i3
```

2. 同步最新仓库

```
sudo apt install ca-certificates
/usr/lib/apt/apt-helper download-file https://debian.sur5r.net/i3/pool/main/s/sur5r-keyring/sur5r-keyring_2021.02.02_all.deb keyring.deb SHA256:cccfb1dd7d6b1b6a137bb96ea5b5eef18a0a4a6df1d6c0c37832025d2edaa710
sudo dpkg -i ./keyring.deb
sudo sh -c "echo "deb http://debian.sur5r.net/i3/ $(grep '^DISTRIB_CODENAME=' /etc/lsb-release | cut -f2 -d=) universe" > /etc/apt/sources.list.d/sur5r-i3.list"
sudo apt update
```

#### 安装tigervnc

1. 安装

```
sudo apt install tigervnc-standalone-server
```

2. 启动

```
vncserver -SecurityTypes=None -localhost=no --I-KNOW-THIS-IS-INSECURE :1 -dpi 150 -geometry=1920x1080
```

3. 显示当前ip

```
ip addr | grep eth0
```

#### 安装feh、xfce4-terminal、rofi、polybar

```
sudo apt install feh xfce4-terminal rofi polybar
```

#### 安装picom

```
sudo apt install libxext-dev libxcb1-dev libxcb-damage0-dev libxcb-xfixes0-dev libxcb-shape0-dev libxcb-render-util0-dev libxcb-render0-dev libxcb-randr0-dev libxcb-composite0-dev libxcb-image0-dev libxcb-present-dev libxcb-xinerama0-dev libxcb-glx0-dev libpixman-1-dev libdbus-1-dev libconfig-dev libgl1-mesa-dev libpcre2-dev libpcre3-dev libevdev-dev uthash-dev libev-dev libx11-xcb-dev meson gcc
cd
git clone https://github.com/yshui/picom.git --depth=1
cd picom
git submodule update --init --recursive
meson --buildtype=release . build
ninja -C build
sudo ninja -C build install
```

#### 安装google

1. 下载安装包

```
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
```

2. 安装

```
sudo apt install ./google-chrome-stable_current_amd64.deb
```

#### 加载字体

```
sudo mkfontscale
sudo fc-cache -fv
```

## ARCH

### 创建用户

```
useradd -m -G wheel username
# 请自行替换 username 为你的用户名

passwd username
# 请自行替换 username 为你的用户名

vim /etc/sudoers
# 去掉# %wheel ALL=(ALL)ALL
```

### 设置默认用户

```
./Arch.exe config --default-user booiris
```

### 换源

```
sudo pacman-key --init
sudo pacman-key --populate archlinux

cp /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.backup
sudo vim /etc/pacman.d/mirrorlist

# 清华大学
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
## 163
Server = http://mirrors.163.com/archlinux/$repo/os/$arch
## aliyun
Server = http://mirrors.aliyun.com/archlinux/$repo/os/$arch

cp /etc/pacman.conf /etc/pacman.conf.backup

sudo vim /etc/pacman.conf

[archlinuxcn]
# The Chinese Arch Linux communities packages.
# SigLevel = Optional TrustedOnly
SigLevel = Optional TrustAll
# 清华大学
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch

sudo pacman -Syyu
```

### YAY

1. 安装

```
sudo pacman -S yay
```

2. 换源

```
yay --aururl "https://aur.tuna.tsinghua.edu.cn" --save
```

### 安装软件

```
yay -S base-devel

yay -S i3 tigervnc sublime-text-4 google-chrome xfce4-terminal
```

### tighervnc 配置

1. 用 `vncpasswd` 创建密码，它会将哈希处理之后的密码存储在 `~/.vnc/passwd`。
2. 编辑 `/etc/tigervnc/vncserver.users` 来定义用户映射
3. 创建 `~/.vnc/config`，其中至少要有一行定义会话的类型，比如 `session=foo` （将foo替换为你想要运行的桌面环境）。你可以通过查看 `/usr/share/xsessions/` 里的 `.desktop` 文件来知道有哪些桌面环境在当前系统上可以使用。

```
session=i3
geometry=1920x1080
dpi=150
alwaysshared
```

### 语言

```
sudo vim /etc/locale.gen
sudo locale-gen
```

### 字体

```
yay -S noto-fonts-emoji adobe-source-han-serif-cn-fonts adobe-source-han-serif-tw-fonts adobe-source-han-sans-cn-fonts  adobe-source-han-sans-tw-fonts nerd-fonts-jetbrains-mono ttf-iosevka-nerd ttf-material-icons-git papirus-icon-theme
```

### 桌面

```
yay -S polybar rofi feh picom xss-lock dbus-x11 google-chrome
yay -S fcitx5-im fcitx5-chinese-addons 
```

创建`.Xresources`

```
Xft.dpi: 120
Xft.autohint: 0
Xft.lcdfilter:  lcddefault
Xft.hintstyle:  hintfull
Xft.hinting: 1
Xft.antialias: 1
Xft.rgba: rgb
```

### rofi

```
mkdir ~/.local/share/rofi
git clone https://github.com/Murzchnvok/rofi-collection.git --depth=1
cp -r nord $HOME/.local/share/rofi/themes/

```

创建`config.rasi`

```
//@theme "/home/booiris/.local/share/rofi/themes/nord.rasi"
@theme "/home/booiris/.local/share/rofi/themes/nord.rasi"
```

### sublime

1. 激活码

```
—– BEGIN LICENSE —–

Mifeng User

Single User License

EA7E-1184812

C0DAA9CD 6BE825B5 FF935692 1750523A

EDF59D3F A3BD6C96 F8D33866 3F1CCCEA

1C25BE4D 25B1C4CC 5110C20E 5246CC42

D232C83B C99CCC42 0E32890C B6CBF018

B1D4C178 2F9DDB16 ABAA74E5 95304BEF

9D0CCFA9 8AF8F8E2 1E0A955E 4771A576

50737C65 325B6C32 817DCB83 A7394DFA

27B7E747 736A1198 B3865734 0B434AA5

—— END LICENSE ——
```

2. 修改设置

```
{
	"access_token": "",
	"auto_upgrade": true,
	"gist_id": "",
}
```
