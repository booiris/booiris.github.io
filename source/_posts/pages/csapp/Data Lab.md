---
title: Data Lab 
date: 2022-05-03 23:24:12 
updated: 2022-06-07 22:01:51
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

### q2

#### Description

tmin - return minimum two's complement integer.

Legal ops: ! ~ & ^ | + << >>.

#### Answer

For data of type int, the minimum value is $-2^{31}$ which is expressed in binary as 1|0x31.

#### Code

```c
int tmin(void) {
    return 1 << 31;
}
```

### q3

#### Description

IsTmax - returns 1 if x is the maximum, two's complement number, and 0 otherwise.

Legal ops: ! ~ & ^ | +.

#### Answer

Notice that only when x = -1 or x = INT_MAX, x^(x+1) = 0xffffffff.

Therefore, we can use a = ~(x ^ (x+1)) to find INT_MAX and -1. when a = 0, x = INT_MAX or -1.

Next step we need to distinguish INT_MAX and -1. Notice that -1 + 1 = 0. So we can use b = !(x+1) to find -1. when b = 0, x = INT_MAX; b = 1, x = -1.

At Last, we can use res = !(a | b) to check whether x is INT_MAX.

#### Code

```c
int isTmax(int x) {
    int temp = x + 1;
    int a = ~(x ^ temp);
    return !((!temp) | a);
}
```

### q4

#### Description

allOddBits - return 1 if all odd-numbered bits in word set to 1 where bits are numbered from 0 (least significant) to 31 (most significant).

#### Example

Examples allOddBits(0xFFFFFFFD) = 0, allOddBits(0xAAAAAAAA) = 1.

#### Answer

We can use (x & 0xAAAAAAAA) ^ 0xAAAAAAAA to check if all odd-numbered bits in word set to 1.

Therefore it's important to get a constant 0xAAAAAAAA.

Since we can only use 0 ~ 0xff, we can simply repeate flowing code four times to get 0xAAAAAAAA.

```c
key |= 0xaa;
key <<= 8;
```

However, it will cost 2 * 4 = 8 operations. We can use a better way to get constant.

1. get a = 0xAA.
2. get b = 0xAAAA.
3. get c = 0xAAAAAAAA.

It's a bit like binary serach. Every time we can construct double length number. Therefore to build a 32 bits number, we just use $log(\frac{32}{4}) = 3$ operations to get the number.

#### Code

```c
int allOddBits(int x) {
    int a = 0xaa;
    int b = a | a << 8;
    int c = b | b << 16;

    return !((x & c) ^ c);
}
```

### q5

#### Description

negate - return -x

#### Example

Example: negate(1) = -1.

#### Answer

Since x + ~x = -1, we can change it to -x = ~x + 1.

#### Code

```c
int negate(int x)
{
    return ~x + 1;
}
```
