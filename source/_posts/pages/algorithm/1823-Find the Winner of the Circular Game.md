---
title: 1823-Find the Winner of the Circular Game 
date: 2022-05-04 12:19:42 
updated: 2022-05-04 13:00:18
tags: [] 
top: false
mathjax: true
categories: [ algorithm ]
author: booiris
---

# Find the Winner of the Circular Game

题意：约瑟夫环问题，从 1 开始，数 k 个数，最后一个人出去，再接着数，直到剩下最后一个人，求最后一个人对应的位置。

下面是 5 个人，每次数 2 个的情况。

<a href="https://sm.ms/image/mLVdz7vXEb2irPs" target="_blank"><img src="https://s2.loli.net/2022/05/04/mLVdz7vXEb2irPs.png" ></a>

题解：

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

        return (pre + k - 1) % n + 1;

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
