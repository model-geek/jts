# JTS - 日本語 TypeScript

[![npm version](https://badge.fury.io/js/%40modelgeek%2Fjts.svg)](https://www.npmjs.com/package/@model-geek/jts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

日本語で書けるプログラミング言語です。TypeScript のスーパーセットとして設計されており、日本語キーワードと英語キーワードを混在させることができます。

**教育目的のプロジェクトです。**

## コンセプト

プログラミング初学者が母国語で基本概念を学べることを目指しています。英語のキーワードに慣れたら、そのまま TypeScript に移行できます。

## 仕組み

JTS の実装は非常にシンプルです：

1. 日本語キーワードを対応する英語キーワードに置換
2. 拡張子を `.ts` に変更
3. `runtime.ts`（日本語メソッドエイリアス）を先頭で import
4. TypeScript ランナー（Bun / tsx）に渡して実行

構文解析は行わず、単純な文字列置換のみで動作します。

```
index.jts → (キーワード置換) → index.ts → (TypeScript ランナーで実行)
```

### 日本語メソッドエイリアス

`Array.prototype.map` などのよく使うメソッドは、`jts.ts` で `Object.defineProperty` を使って日本語エイリアスを定義しています。

```typescript
// jts.ts の中身（イメージ）
Object.defineProperty(Array.prototype, '写像', {
  value: Array.prototype.map,
  writable: true,
  configurable: true,
});
```

## インストール

```bash
npm install -g @model-geek/jts
```

**前提条件:** 以下のいずれかの TypeScript ランナーが必要です：

```bash
# Bun（推奨）
curl -fsSL https://bun.sh/install | bash

# または tsx
npm install -g tsx
```

### ソースからビルド

```bash
git clone https://github.com/model-geek/jts.git
cd jts
npm install
npm run build
npm link
```

## 使い方

```bash
# JTS ファイルを実行
jts index.jts
```

v0.1.0 では実行のみサポートしています。トランスパイル結果の出力機能はありません。

## コード例

```jts
// 日本語キーワードで書く
定数 メッセージ: 文字列 = "こんにちは"
表示(メッセージ)

// 英語キーワードも使える（TypeScript のスーパーセット）
const name: string = "太郎"
console.log(name)

// 混在も可能
定数 数字たち: number[] = [1, 2, 3, 4, 5]
const 二倍 = 数字たち.写像((x) => x * 2)
表示(二倍)
```

### 関数

```jts
関数 挨拶する(名前: 文字列): 文字列 {
    戻す "こんにちは、" + 名前 + "さん！"
}

定数 結果 = 挨拶する("花子")
表示(結果)
```

### 条件分岐

```jts
定数 点数 = 85

もし (点数 >= 80) {
    表示("優秀です")
} そうでなければもし (点数 >= 60) {
    表示("合格です")
} そうでなければ {
    表示("もう少し頑張りましょう")
}
```

### 繰り返し

```jts
// for ループ
繰り返し (変数 i = 0; i < 5; i++) {
    表示(i)
}

// for...of
定数 果物たち = ["りんご", "みかん", "ぶどう"]
各々 (定数 果物 の中の 果物たち) {
    表示(果物)
}

// while
変数 カウント = 0
間 (カウント < 3) {
    表示(カウント)
    カウント++
}
```

### クラス

```jts
クラス 動物 {
    名前: 文字列

    構築(名前: 文字列) {
        自分.名前 = 名前
    }

    鳴く(): 文字列 {
        戻す "..."
    }
}

クラス 犬 拡張 動物 {
    鳴く(): 文字列 {
        戻す "ワンワン"
    }
}

定数 ポチ = 新規 犬("ポチ")
表示(ポチ.名前 + "は「" + ポチ.鳴く() + "」と鳴きます")
```

## キーワード対応表

| JTS (日本語) | TypeScript |
|-------------|------------|
| `関数` | `function` |
| `定数` | `const` |
| `変数` | `let` |
| `もし` | `if` |
| `そうでなければもし` | `else if` |
| `そうでなければ` | `else` |
| `繰り返し` | `for` |
| `各々 (X の中の Y)` | `for (X of Y)` |
| `間` | `while` |
| `戻す` | `return` |
| `クラス` | `class` |
| `拡張` | `extends` |
| `構築` | `constructor` |
| `自分` | `this` |
| `新規` | `new` |
| `真` | `true` |
| `偽` | `false` |
| `無` | `null` |
| `未定義` | `undefined` |
| `非同期` | `async` |
| `待機` | `await` |
| `試行` | `try` |
| `捕捉` | `catch` |
| `最後に` | `finally` |
| `投げる` | `throw` |
| `型` | `type` |
| `接点` | `interface` |
| `出力` | `export` |
| `入力` | `import` |
| `表示` | `console.log` |

## 型対応表

| JTS (日本語) | TypeScript |
|-------------|------------|
| `文字列` | `string` |
| `数値` | `number` |
| `真偽値` | `boolean` |
| `無効` | `void` |
| `何でも` | `any` |
| `不明` | `unknown` |
| `絶対無` | `never` |

## メソッド対応表

| JTS (日本語) | JavaScript |
|-------------|------------|
| `.写像()` | `.map()` |
| `.絞込()` | `.filter()` |
| `.畳込()` | `.reduce()` |
| `.探索()` | `.find()` |
| `.含む()` | `.includes()` |
| `.結合()` | `.join()` |
| `.分割()` | `.split()` |
| `.長さ` | `.length` |

## ロードマップ

- [x] 基本的なキーワード置換
- [x] Bun / tsx による実行
- [x] 日本語メソッドエイリアス（Array, String）
- [ ] エラーメッセージの日本語化
- [ ] VS Code 拡張機能（シンタックスハイライト）
- [ ] Zig による構文解析実装

## ライセンス

MIT License

## 作者

[@model-geek](https://github.com/model-geek)

## 貢献

プルリクエストや Issue は大歓迎です。

## リンク

- [npm パッケージ](https://www.npmjs.com/package/@model-geek/jts)
- [GitHub リポジトリ](https://github.com/model-geek/jts)
