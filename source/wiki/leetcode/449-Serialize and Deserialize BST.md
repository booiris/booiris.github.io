---
title: 449-Serialize and Deserialize BST 
date: 2022-05-11 17:54:53 
updated: 2022-06-09 22:03:40
tags: [树] 
top: false
mathjax: true
author: booiris
layout: wiki  
wiki: leetcode
order: 449
---

## 题意

将一个搜索树序列化为字符串，然后将字符串反序列化为一棵树。

序列化： 按照自己的规则将一组数据结构用字符串表示。

## 题解

没看到是搜索树，直接用层序遍历序列化，记录每一层的节点数据，空节点用特殊字符表示即可。

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
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */
class Codec {
  public:
    // Encodes a tree to a single string.
    string serialize(TreeNode *root) {
        if (root == nullptr)
            return "";
        string res = "";
        queue<pair<TreeNode *, char>> q;
        q.emplace(root, 'N');
        while (!q.empty()) {
            int len = q.size();
            while (len--) {
                auto qf = q.front();
                q.pop();
                auto now = qf.first;
                if (now == nullptr) {
                    res += qf.second;
                    continue;
                }

                stringstream ss;
                ss << now->val;
                string temp;
                ss >> temp;
                res += temp + qf.second;
                if (now->left != nullptr)
                    q.emplace(now->left, 'L');
                else
                    q.emplace(nullptr, '#');
                if (now->right != nullptr)
                    q.emplace(now->right, 'R');
                else
                    q.emplace(nullptr, '%');
            }
            res += '$';
        }
        return res;
    }

    // Decodes your encoded data to tree.
    TreeNode *deserialize(string data) {
        // cout<<data<<"\n";
        if (data == "")
            return nullptr;
        int index = 0;
        string temp = "";
        while (data[index] >= '0' && data[index] <= '9') {
            temp += data[index];
            index++;
        }
        index++;
        stringstream tt;
        tt << temp;
        int root_v;
        tt >> root_v;
        TreeNode *root = new TreeNode(root_v);
        queue<TreeNode *> q;
        q.emplace(nullptr);
        q.emplace(root);
        TreeNode *now = root;
        while (index < data.size()) {
            if (data[index] == '$') {
                while (!q.empty() && q.front() != nullptr) {
                    q.pop();
                }
                q.pop();
                q.emplace(nullptr);
                index++;
                continue;
            } else if (data[index] == '#') {
                index++;
                continue;
            } else if (data[index] == '%') {
                index++;
                q.pop();
                continue;
            }
            string temp = "";
            while (data[index] >= '0' && data[index] <= '9') {
                temp += data[index];
                index++;
            }
            int now_val;
            stringstream ss;
            ss << temp;
            ss >> now_val;

            if (data[index] == 'L') {
                q.front()->left = new TreeNode(now_val);
                q.emplace(q.front()->left);
            } else {
                q.front()->right = new TreeNode(now_val);
                q.emplace(q.front()->right);
                q.pop();
            }
            index++;
        }
        return root;
    }
};

// Your Codec object will be instantiated and called as such:
// Codec* ser = new Codec();
// Codec* deser = new Codec();
// string tree = ser->serialize(root);
// TreeNode* ans = deser->deserialize(tree);
// return ans;
#ifdef LOCAL
int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
}
#endif
```
