---
title: 513-Find Bottom Left Tree Value 
date: 2022-06-23 00:10:14 
updated: 2022-06-23 00:12:23
tags: [] 
top: false
mathjax: true
categories: []
author: booiris
layout: wiki 
wiki: leetcode 
order:   513   # add order, base on problem number.
---

## 题意

找到树中最左下的节点。

## 题解

层序遍历树，每次取每一层最左边的节点，最后的值即为最左下的节点。

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
class Solution {
  public:
    int findBottomLeftValue(TreeNode *root) {
        int res;
        queue<TreeNode *> q;
        q.push(root);
        while (!q.empty()) {
            int len = q.size();
            res = q.front()->val;
            while (len--) {
                auto now = q.front();
                q.pop();
                if (now->left != nullptr)
                    q.push(now->left);
                if (now->right != nullptr)
                    q.push(now->right);
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
