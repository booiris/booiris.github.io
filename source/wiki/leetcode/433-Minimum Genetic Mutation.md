---
title: 433-Minimum Genetic Mutation 
date: 2022-05-07 13:23:29 
updated: 2022-06-09 22:02:49
tags: [] 
top: false
mathjax: true
author: booiris
layout: wiki  
wiki: leetcode
order: 433
---

题意：

给出初始字符串、目标字符串和一组中间字符串，有如下规则。

1. 每次改变只能改变字符串中的一位字符。
2. 改变后的字符串必须在中间字符串中。

为初始字符串变化为目标字符串所需要的次数。

题解：

根据规则在中间字符串内建图，对于中间字符串内两个不同的字符串 a, b，如果他们相差一位字符，则连上一条双向边。最后以初始字符串作为源点和以目标字符串为汇点建图。

最后根据建好的图 bfs 一遍即可。

```cpp
#define LOCAL
#include <bits/stdc++.h>
using namespace std;
#define INF 0x3f3f3f3f
typedef long long ll;
class Solution {
  public:
    unordered_map<string, int> id;
    vector<string> mp;
    vector<int> p[15];
    bool vis[15];

    int minMutation(string start, string end, vector<string> &bank) {
        mp = bank;
        for (int i = 1; i <= bank.size(); i++) {
            id[bank[i - 1]] = i;
        }
        int n = bank.size() + 1;
        for (int i = 0; i < bank.size(); i++) {
            for (int j = 0; j < bank.size(); j++) {
                if (i == j)
                    continue;
                int flag = 0;
                for (int k = 0; k < bank[i].size(); k++) {
                    if (bank[i][k] != bank[j][k])
                        flag++;
                }
                if (flag == 1) {
                    p[id[bank[i]]].push_back(id[bank[j]]);
                    p[id[bank[j]]].push_back(id[bank[i]]);
                }
            }
            int flag = 0;
            for (int k = 0; k < bank[i].size(); k++) {
                if (start[k] != bank[i][k])
                    flag++;
            }
            if (flag == 1) {
                p[0].push_back(id[bank[i]]);
                p[id[bank[i]]].push_back(0);
            }
            flag = 0;
            for (int k = 0; k < bank[i].size(); k++) {
                if (end[k] != bank[i][k])
                    flag++;
            }
            if (flag == 0) {
                p[n].push_back(id[bank[i]]);
                p[id[bank[i]]].push_back(n);
            }
        }

        queue<pair<int, int>> q;
        q.emplace(0, -1);
        vis[0] = 1;
        while (!q.empty()) {
            auto now = q.front();
            q.pop();
            if (now.first == n) {
                return now.second;
            }
            for (int i = 0; i < p[now.first].size(); i++) {
                int nxt = p[now.first][i];
                if (vis[nxt])
                    continue;
                vis[nxt] = 1;
                q.emplace(nxt, now.second + 1);
            }
        }
        return -1;
    }
};
#ifdef LOCAL
int main() {
    ios::sync_with_stdio(false);
    cin.tie(0);
}
#endif
```
