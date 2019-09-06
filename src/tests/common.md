---
title: /home/fastspeeed/macoolka/macoolka-doc/src/tests/fixtures/common.ts
nav_order: 0
parent: 模块
---

# 概述

这定义了文章的接口。

将被 html、markdown 实现

---

<h2 class="text-delta">目录</h2>

- [Document (接口)](#document-%E6%8E%A5%E5%8F%A3)
- [FormattingElement (接口)](#formattingelement-%E6%8E%A5%E5%8F%A3)
- [Header (接口)](#header-%E6%8E%A5%E5%8F%A3)
- [List (接口)](#list-%E6%8E%A5%E5%8F%A3)
- [markdown (常量)](#markdown-%E5%B8%B8%E9%87%8F)
- [toc (常量)](#toc-%E5%B8%B8%E9%87%8F)

---

# Document (接口)

定义一份文档

**签名**

```ts
interface Document extends Header, List, FormattingElement {
  /**
   *标记内容为一篇文章
   */
  article: (code: string) => string
  /**
   *标记内容为引用别人的论述
   */
  blockquote: (code: string[]) => string
  /**
   *换行
   */
  br: () => string
  /**
   *标记内容为一段程序代码
   */
  code: (language: string) => (a: string) => string
  /**
   *水平线
   */
  hr: () => string
  /**
   *标记内容为图片
   */
  img: (text: string, href: string, title?: string) => string
  /**
   *标记内容为链接,一般指向外部资源
   */
  link: (text: string, href: string, title?: string) => string
  /**
   *标记内容为一个段落
   */
  paragraph: (code: string) => string
  /**
   *标记内容为一个章节
   */
  section: (code: string) => string
  /**
   *定义一个表格
   */
  table: (as: string[][]) => string
}
```

v0.2.0 中添加

# FormattingElement (接口)

格式化一个元素，给一个元素加上特殊效果。

**签名**

```ts
interface FormattingElement {
  /**
   *定义主要的文本
   */
  bold: (code: string) => string
  /**
   *The tag defines the title of a work (e.g. a book, a song, a movie, a TV show, a painting, a sculpture, etc.).
   *定义一个事物的标题
   */
  cite: (code: string) => string
  /**
   *定义一个删除标记的文本
   */
  del: (text: string) => string
  /**
   *定义一个术语
   */
  dfn: (code: string) => string
  /**
   *定义一个强调的文本
   */
  em: (code: string) => string
  /**
   *定义一个插入的文本
   */
  ins: (code: string) => string
  /**
   *定义一个斜体文本
   */
  italic: (code: string) => string
  /**
   *定义一个高亮的文本
   */
  mark: (code: string) => string
  /**
   *给文本加引号
   */
  q: (code: string) => string
}
```

**示例**

```ts
const a = '1'
const b = '1'
const c = a === b
```

v0.2.0 中添加

# Header (接口)

定义了标题

数字为标题的级别

**签名**

```ts
interface Header {
  h1: (title: string) => string
  h2: (title: string) => string
  h3: (title: string) => string
  h4: (title: string) => string
  h5: (title: string) => string
  h6: (title: string) => string
}
```

v0.2.0 中添加

# List (接口)

列表定义

**签名**

```ts
interface List {
  /**
   *有顺序列表
   */
  ol: (as: string[]) => string
  /**
   *无顺序列表
   */
  ul: (as: string[]) => string
}
```

v0.2.0 中添加

# markdown (常量)

基于 github markdown

**签名**

```ts

export const markdown: Document = ...

```

v0.2.0 中添加

# toc (常量)

**签名**

```ts

export const toc: any = ...

```

v0.2.0 中添加
