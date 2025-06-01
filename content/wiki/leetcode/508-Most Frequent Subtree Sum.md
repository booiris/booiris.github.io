---
title: 508-Most Frequent Subtree Sum
date: 2022-06-19 14:18:39
updated: 2022-06-19 14:27:49
tags: 
top: false
mathjax: true
categories: 
author: booiris
layout: wiki
topic: leetcode
order: 508
---

## 题意

求树中频率最高的子树和的数字。

## 题解

深度优先搜索树，返回当前子树和，然后更新子树和的频率，如果当前子树和大于最大频率，则更新答案。

```cpp
#define LOCAL
#include <bits/stdc++.h>
using namespace std;
#define INF 0x3f3f3f3f
typedef long long ll;
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution {
  public:
    vector<int> res;
    int maxcnt = 0;
    unordered_map<int, int> mp;

    int dfs(TreeNode *now) {
        if (now == nullptr)
            return 0;
        int l, r;
        l = dfs(now->left);
        r = dfs(now->right);
        int sum = now->val + l + r;
        mp[sum]++;
        if (mp[sum] > maxcnt) {
            maxcnt = mp[sum];
            res.clear();
        }
        if (mp[sum] == maxcnt) {
            res.push_back(sum);
        }
        return sum;
    }

    vector<int> findFrequentTreeSum(TreeNode *root) {
        dfs(root);
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
