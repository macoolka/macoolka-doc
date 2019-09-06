---
title: parse.ts
nav_order: 5
parent: Modules
---

# Overview

---

<h2 class="text-delta">Table of contents</h2>

- [parse (function)](#parse-function)

---

# parse (function)

Parse files to Module

**Signature**

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

Added in v0.2.0
