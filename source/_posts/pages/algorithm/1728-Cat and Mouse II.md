---
title: 1728-Cat and Mouse II 
date: 2022-05-10 20:54:08 
updated: 2022-05-10 20:59:45
tags: [] 
top: false
mathjax: true
categories: [ algorithm ]
author: booiris
---

# Cat and Mouse II

## 题意

A game is played by a cat and a mouse named Cat and Mouse.

The environment is represented by a grid of size rows x cols, where each element is a wall, floor, player (Cat, Mouse), or food.

* Players are represented by the characters 'C'(Cat),'M'(Mouse).
* Floors are represented by the character '.' and can be walked on.
* Walls are represented by the character '#' and cannot be walked on.
* Food is represented by the character 'F' and can be walked on.
* There is only one of each character 'C', 'M', and 'F' in grid.

Mouse and Cat play according to the following rules:

* Mouse **moves first**, then they take turns to move.
* During each turn, Cat and Mouse can jump in one of the four directions (left, right, up, down). They cannot jump over the wall nor outside of the grid.
* *catJump*, *mouseJump* are the maximum lengths Cat and Mouse can jump at a time, respectively. Cat and Mouse can jump less than the maximum length.
* Staying in the same position is allowed.
* Mouse can jump over Cat.

The game can end in 4 ways:

* If Cat occupies the same position as Mouse, Cat wins.
* If Cat reaches the food first, Cat wins.
* If Mouse reaches the food first, Mouse wins.
* If Mouse cannot get to the food within 1000 turns, Cat wins.

Given a rows x cols matrix grid and two integers catJump and mouseJump, return true if Mouse can win the game if both Cat and Mouse play optimally, otherwise return false.

## 题解1（伪）



```cpp
#define LOCAL
#include <bits/stdc++.h>
using namespace std;
#define INF 0x3f3f3f3f
typedef long long ll;

class Solution {
  public:
    int cj, mj;
    vector<string> grid;
    int n, m;

    int vis[260][64][64];

    int dir[4][2] = {1, 0, -1, 0, 0, 1, 0, -1};

    int dfs(int x1, int y1, int x2, int y2, int depth, int player) {
        if (x1 == x2 && y1 == y2)
            return 2;
        if (depth >= 256)
            return 2;
        if (grid[x1][y1] == 'F')
            return 1;
        if (grid[x2][y2] == 'F')
            return 2;
        int pos1 = x1 * m + y1;
        int pos2 = x2 * m + y2;
        if (vis[depth][pos1][pos2] != 0) {
            return vis[depth][pos1][pos2];
        }
        // cout << player << " " << x1 << " " << y1 << " " << x2 << " " << y2 << "\n";
        int res = 0;
        if (player == 1) {
            for (int j = 0; j < 4; j++) {
                for (int i = 1; i <= mj; i++) {
                    int nx = x1 + dir[j][0] * i, ny = y1 + dir[j][1] * i;
                    if (nx < 0 || nx >= n || ny < 0 || ny >= m)
                        break;
                    if (grid[nx][ny] == '#')
                        break;
                    int flag = dfs(nx, ny, x2, y2, depth + 1, 2);
                    if (flag == 1)
                        res = 1;
                }
            }

            int flag = dfs(x1, y1, x2, y2, depth + 1, 2);
            if (flag == 1)
                res = 1;
            if (res == 0)
                res = 2;

        } else {
            for (int j = 0; j < 4; j++) {
                for (int i = 1; i <= cj; i++) {
                    int nx = x2 + dir[j][0] * i, ny = y2 + dir[j][1] * i;
                    if (nx < 0 || nx >= n || ny < 0 || ny >= m)
                        break;
                    if (grid[nx][ny] == '#')
                        break;
                    int flag = dfs(x1, y1, nx, ny, depth + 1, 1);
                    if (flag == 2)
                        res = 2;
                }
            }
            int flag = dfs(x1, y1, x2, y2, depth + 1, 1);
            if (flag == 2)
                res = 2;
            if (res == 0)
                res = 1;
        }
        vis[depth][pos1][pos2] = res;
        return res;
    }

    bool canMouseWin(vector<string> _grid, int _catJump, int _mouseJump) {
        cj = _catJump;
        mj = _mouseJump;
        grid = _grid;
        n = grid.size();
        m = grid[0].size();
        int mx, my, cx, cy;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (grid[i][j] == 'C')
                    cx = i, cy = j;
                if (grid[i][j] == 'M')
                    mx = i, my = j;
            }
        }
        return dfs(mx, my, cx, cy, 0, 1) == 1 ? true : false;
    }
};
#ifdef LOCAL
int main() {
    // ios::sync_with_stdio(false);
    // cin.tie(0);
    Solution s;
    // .M...
    // ..#..
    // #..#.
    // C#.#.
    // ...#F
    vector<string> a = {".M...", "..#..", "#..#.", "C#.#.", "...#F"};
    cout << s.canMouseWin(a, 3, 1) << "\n";
}
#endif

```

## 题解2

#TODO
拓扑排序
