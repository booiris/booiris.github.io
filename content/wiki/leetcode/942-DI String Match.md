---
title: 942-DI String Match
date: 2022-05-09 13:28:12
updated: 2022-06-10 00:42:02
tags:
  - 贪心
top: false
mathjax: true
author: booiris
layout: wiki
topic: leetcode
order: 942
---

## 题意

给出一组字符串，由 'D' 和 'I' 组成。这个字符串对应着一个由元素范围为 [0,n] 无重数组的关系：

1. 当 s[i] == 'I', a[i] < a[i+1]。
2. 当 s[i] == 'D', a[i] > a[i+1]。

举例：

[3, 2, 0 ,1] 对应的字符串为 'DDI'。

给出关系，要求还原任意符合要求的数组。

## 题解

贪心地构造数组，设置当前最大值和当前最小值，当前字符为 'I' 时，插入当前最小值，最小值加1，字符为 'D' 时类似。 上面过程保证了构造的数组元素关系符合给出的字符串。

```cpp
#define LOCAL
#include <bits/stdc++.h>
using namespace std;
#define INF 0x3f3f3f3f
typedef long long ll;
class Solution {
  public:
    vector<int> diStringMatch(string s) {
        int low = 0, high = s.size();
        vector<int> res;
        for (auto &x : s) {
            if (x == 'I')
                res.emplace_back(low++);
            else
                res.emplace_back(high--);
        }
        res.emplace_back(low);
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
