---
title: parse.ts
nav_order: 5
parent: 模块
---

# 概述

---

<h2 class="text-delta">目录</h2>

- [parse (函数)](#parse-%E5%87%BD%E6%95%B0)

---

# parse (函数)

解析文件到 Module

**签名**

```ts

export const parse = (files: FileWhereUniqueInput[]) =>
    pipe(
        _parse(files),
        E.map(as =>
            pipe(
                as,
                R.map(a =>
                    pipe(
                        a,
                        array.filter(a => ...

```

v0.2.0 中添加
