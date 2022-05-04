---
title: Data Lab 
date: 2022-05-03 23:24:12 
updated: 2022-05-04 18:29:25
tags: [] 
top: false
mathjax: true
categories: [ csapp ]
author: booiris
---

# CS:APP Data Lab

## restriction

  1. Integer constants 0 through 255 (0xFF), inclusive. You are
      not allowed to use big constants such as 0xffffffff.
  2. Function arguments and local variables (no global variables).
  3. Unary integer operations ! ~
  4. Binary integer operations & ^ | + << >>
  5. NOT ALLOW
	1. Use any control constructs such as if, do, while, for, switch, etc.
	2. Define or use any macros.
	3. Define any additional functions in this file.
	4. Call any functions.
	5. Use any other operations, such as &&, ||, -, or ?:
	6. Use any form of casting.
	7. Use any data type other than int.  This implies that you
		 cannot use arrays, structs, or unions.
	

## Question

### q1

#### Description

bitXor - x^y using only ~ and &.

#### Example

bitXor(4, 5) = 1

#### Answer

$$
\begin{align}
	x \oplus y &= (\sim x \wedge y) \vee (x \wedge \sim y) = \sim(\sim(\sim x \wedge y) \wedge \sim(x \wedge \sim y)) \tag{1} \\
	x \oplus y &= (x \vee y) \wedge (\sim x \vee \sim y) = \sim(\sim x \wedge \sim y) \wedge \sim (x \wedge y) \tag{2}
\end{align}
$$

Compare eq1 and eq2, eq1 uses five NOT operations and three AND operations, eq2 uses four NOT operations and three AND operations. Therefore eq2 is better.

#### Code

```c
int bitXor(int x, int y) {
    return ~(x & y) & ~(~x & ~y);
    // return ~(~(x & ~y) & ~(~x & y));
}
```
