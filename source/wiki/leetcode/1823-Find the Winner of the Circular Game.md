---
title: 1823-Find the Winner of the Circular Game 
date: 2022-05-04 12:19:42 
updated: 2022-06-09 22:04:49
tags: [模拟] 
top: false
mathjax: true
author: booiris
layout: wiki  
wiki: leetcode
order: 1823
---

题意：约瑟夫环问题，从 1 开始，数 k 个数，最后一个人出去，再接着数，直到剩下最后一个人，求最后一个人对应的位置。

下面是 5 个人，每次数 2 个的情况。

<img src="https://s2.loli.net/2022/05/04/mLVdz7vXEb2irPs.png" >

题解：对于最后一个人，每次操作与下一次操作差 k， 递归解决即可，注意下标从 1 开始，注意一下边界条件。

```cpp
#define LOCAL
#include <bits/stdc++.h>
using namespace std;
#define INF 0x3f3f3f3f
typedef long long ll;
class Solution {
  public:
    int findTheWinner(int n, int k) {
        if (n == 1)
            return 1;
        int pre = findTheWinner(n - 1, k);
        int res = (pre + k) % n;
        return res == 0 ? n : res;
    }
};
#ifdef LOCAL
int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
    Solution s;
    cout << s.findTheWinner(5, 2) << "\n";
}
#endif
```
