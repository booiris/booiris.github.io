---
title: 890-Find and Replace Pattern 
date: 2022-06-12 15:32:39 
updated: 2022-06-12 15:55:03
tags: [] 
top: false
mathjax: true
categories: []
author: booiris
layout: wiki 
wiki: leetcode 
order:  890    # add order, base on problem number.
---

## 题意

给定一组目标字符串和原字符串，规定一种变换，原字符串中所有相同的字母可以变换为另一种字母。限制为每种字母只能变换一种字母，不同的字母不能变换成相同的字母。如"abb"可以变换为"cdd"，不能变换成"cde"或"ccc"。

## 题解

遍历目标字符串中的所有字符，如果长度和原字符串不相等直接跳过，然后遍历原字符串，如果当前字符不存在映射，就对应到目标字符串对应位置的字符，如果存在映射但与当前对应位置字符不相等直接跳过，如果有多个字符对应同一个字符，跳过当前的目标字符串，将所有符合条件的目标字符串放入答案中。

```cpp
#define LOCAL
#include <bits/stdc++.h>
using namespace std;
#define INF 0x3f3f3f3f
typedef long long ll;

class Solution {
  public:
    vector<string> findAndReplacePattern(vector<string> &words, string pattern) {
        int key[30];
        bool vis[30];
        vector<string> res;
        for (auto &x : words) {
            if (x.size() != pattern.size())
                continue;
            memset(key, 0, sizeof key);
            memset(vis, 0, sizeof vis);
            bool flag = 1;
            for (int i = 0; i < pattern.size(); i++) {
                if (key[pattern[i] - 'a'] == 0) {
                    if (vis[x[i] - 'a']) {
                        flag = 0;
                        break;
                    }
                    vis[x[i] - 'a'] = 1;
                    key[pattern[i] - 'a'] = x[i];
                }
                if (key[pattern[i] - 'a'] != x[i]) {
                    flag = 0;
                    break;
                }
            }
            if (flag) {
                res.push_back(x);
            }
        }
        return res;
    }
};

#ifdef LOCAL
int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
}
#endif
```
