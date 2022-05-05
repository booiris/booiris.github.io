---
title: 713-Subarray Product Less Than K 
date: 2022-05-05 10:28:41 
updated: 2022-05-05 10:41:12
tags: [滑动窗口] 
top: false
mathjax: true
categories: [ algorithm ]
author: booiris
---

# Subarray Product Less Than K

题意：求数列字串积小于 k 的字串个数。

题解：

枚举左节点，对于每一个左节点 i，找到满足字串积小于 k 的最长字串的右节点 high，那么每一个左节点有效的字串个数为 high - i +1。

对于两个左节点 $i , j$。 如果 $i<j$，那么它们的最长右节点一定有  $high_i <= high_j$ 。枚举左节点时 high 是单调递增的，所以时间复杂度为 $O(n)$。

```cpp
#define LOCAL
#include <bits/stdc++.h>
using namespace std;
#define INF 0x3f3f3f3f
typedef long long ll;
class Solution {
  public:
    int numSubarrayProductLessThanK(vector<int> &nums, int k) {
        int high = 0;
        int now = 1;
        int n = nums.size();
        int res = 0;
        for (int i = 0; i < n; i++) {
            while (high < n && now * nums[high] < k) {
                now *= nums[high++];
            }
            if (high > i) {
                res += high - i;
                now /= nums[i];
            } else {
                now = 1;
                high = i + 1;
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
