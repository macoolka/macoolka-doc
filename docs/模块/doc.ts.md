---
title: doc.ts
nav_order: 2
parent: 模块
---

# 概述

---

<h2 class="text-delta">目录</h2>

- [Capabilities (接口)](#capabilities-%E6%8E%A5%E5%8F%A3)
- [MonadDoc (接口)](#monaddoc-%E6%8E%A5%E5%8F%A3)
- [main (函数)](#main-%E5%87%BD%E6%95%B0)

---

# Capabilities (接口)

**签名**

```ts
interface Capabilities extends MonadFileStore, MonadLog, MonadDocument {
  locales: string[]
  outDir: string
  srcDir: string
}
```

v0.2.0 中添加

# MonadDoc (接口)

App effect

**签名**

```ts
interface MonadDoc extends MonadFunction {}
```

v0.2.0 中添加

# main (函数)

解析给定目录中的 ts 文件，产生 github markdown 文件

**签名**

```ts

export const main = (C: Capabilities) => ...

```

v0.2.0 中添加
