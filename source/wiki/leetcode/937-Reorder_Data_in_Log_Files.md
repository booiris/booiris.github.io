---
title: 937-Reorder_Data_in_Log_Files 
date: 2022-05-03 12:11:57 
updated: 2022-06-09 21:48:14
tags: [模拟] 
top: false 
mathjax: true 
author: booiris
---

# Reorder Data in Log Files

题意：给定字符串数组，按规则对数组进行排序，规则如下：

1. 每个字符串第一个单词为键，后面的为数据，存在两种数据，一种只包含小写字母，一种只包含数字。
2. 所有小写字母数据在数字数据前面。
3. 对于小写字母数据，按照字典序进行排序，如果数据相同，按照键的字典序排序。
4. 对于数字数据，保持顺序和原数组相对顺序相同即可。

题解： 按照规则模拟即可

```cpp
#define LOCAL
#include <bits/stdc++.h>
using namespace std;
#define INF 0x3f3f3f3f
typedef long long ll;
class Solution {
  public:
    vector<string> reorderLogFiles(vector<string> &logs) {
        vector<int> dig;
        vector<pair<string, string>> word;
        for (int i = 0; i < logs.size(); i++) {
            int now = 0;
            string key = "";
            while (logs[i][now] != ' ')
                key += logs[i][now], now++;
            if (logs[i][now + 1] >= '0' && logs[i][now + 1] <= '9') {
                dig.push_back(i);
            } else {
                word.emplace_back(key, logs[i].substr(now));
            }
        }
        sort(word.begin(), word.end(), [](const auto &x, const auto &y) {
            if (x.second == y.second)
                return x.first < y.first;
            return x.second < y.second;
        });
        vector<string> res;
        for (auto &x : word) {
            res.emplace_back(x.first + x.second);
        }
        for (auto &x : dig)
            res.push_back((logs[x]));
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
