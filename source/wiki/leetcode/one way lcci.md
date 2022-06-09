---
title: one way lcci 
date: 2022-05-13 11:05:41 
updated: 2022-06-09 21:48:30
tags: [] 
top: false
mathjax: true
author: booiris
---

# one way lcci

## 题意

给出原字符串和目标字符串，有三种操作：

1. 原字符串改变一个字符。
2. 原字符串删除一个字符。
3. 原字符串添加一个字符。

最多可以做一次操作，问能否将原字符串变为目标字符串。

## 题解

首先原字符串添加一个字符串相当于目标字符串删除一个字符，所以当原字符串的长度小于目标字符串时交换一下原字符串和目标字符串即可，所以只剩下两种操作需要讨论。

1. 原字符串改变一个字符：

	首先原字符串和目标字符串长度必须相等，然后遍历一下，如果不同的字符超过一个说明不能改变。

1. 原字符串删除一个字符：

	遍历字符串，如果不相等就跳过，需要删除这个字符，如果出现两次不同的情况，说明不能改变。

```cpp
#define LOCAL
#include <bits/stdc++.h>
using namespace std;
#define INF 0x3f3f3f3f
typedef long long ll;
class Solution {
  public:
    bool oneEditAway(string first, string second) {
        if (first == second)
            return true;
        if (abs((int)first.size() - (int)second.size()) > 1)
            return false;
        if (first.size() == second.size()) {
            int cnt = 0;
            for (int i = 0; i < first.size(); i++) {
                if (first[i] != second[i]) {
                    cnt++;
                    if (cnt > 1)
                        return false;
                }
            }
        } else {
            if (first.size() < second.size())
                swap(first, second);
            bool flag = 0;
            int now = second.size() - 1;
            for (int i = first.size() - 1; i >= 0; i--) {
                if (now == -1 && i == 0)
                    return true;
                if (first[i] != second[now]) {
                    if (flag)
                        return false;
                    flag = 1;
                } else
                    now--;
            }
        }
        return true;
    }
};

```
