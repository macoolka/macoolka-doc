---
title: doc.ts
nav_order: 2
parent: Modules
---

# Overview

---

<h2 class="text-delta">Table of contents</h2>

- [Capabilities (interface)](#capabilities-interface)
- [MonadDoc (interface)](#monaddoc-interface)
- [main (function)](#main-function)

---

# Capabilities (interface)

**Signature**

```ts
interface Capabilities extends MonadFileStore, MonadLog, MonadDocument {
  locales: string[]
  outDir: string
  srcDir: string
}
```

Added in v0.2.0

# MonadDoc (interface)

App effect

**Signature**

```ts
interface MonadDoc extends MonadFunction {}
```

Added in v0.2.0

# main (function)

parse file in given directory and generate markdown docs

**Signature**

```ts

export const main = (C: Capabilities) => ...

```

Added in v0.2.0
