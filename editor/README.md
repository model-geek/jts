# JTS エディタサポート

JTS のシンタックスハイライト設定です。

## VS Code

### 方法 1: 手動設定

1. `~/.vscode/extensions/jts-language/` ディレクトリを作成
2. 以下のファイルを配置：

**package.json:**
```json
{
  "name": "jts-language",
  "displayName": "JTS - 日本語 TypeScript",
  "version": "0.1.0",
  "engines": { "vscode": "^1.60.0" },
  "categories": ["Programming Languages"],
  "contributes": {
    "languages": [{
      "id": "jts",
      "aliases": ["JTS", "日本語 TypeScript"],
      "extensions": [".jts"],
      "configuration": "./language-configuration.json"
    }],
    "grammars": [{
      "language": "jts",
      "scopeName": "source.jts",
      "path": "./jts.tmLanguage.json"
    }]
  }
}
```

**language-configuration.json:**
```json
{
  "comments": {
    "lineComment": "//",
    "blockComment": ["/*", "*/"]
  },
  "brackets": [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  "autoClosingPairs": [
    { "open": "{", "close": "}" },
    { "open": "[", "close": "]" },
    { "open": "(", "close": ")" },
    { "open": "\"", "close": "\"" },
    { "open": "'", "close": "'" },
    { "open": "`", "close": "`" }
  ],
  "surroundingPairs": [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
    ["\"", "\""],
    ["'", "'"],
    ["`", "`"]
  ]
}
```

3. `jts.tmLanguage.json` をコピー
4. VS Code を再起動

### 方法 2: TypeScript として認識（簡易）

settings.json に追加：
```json
{
  "files.associations": {
    "*.jts": "typescript"
  }
}
```

## IntelliJ IDEA / WebStorm

### 方法 1: TextMate バンドル

1. `Preferences` → `Editor` → `TextMate Bundles`
2. `+` をクリック
3. `editor/jts.tmbundle` ディレクトリを選択

### 方法 2: TypeScript として認識（簡易）

1. `Preferences` → `Editor` → `File Types`
2. `TypeScript` を選択
3. `Registered Patterns` の `+` をクリック
4. `*.jts` を追加

## 対応しているハイライト

| カテゴリ | 日本語 | 英語 |
|---------|--------|------|
| 制御構文 | もし、そうでなければ、繰り返し、間、戻す | if, else, for, while, return |
| 宣言 | 定数、変数、関数、クラス | const, let, function, class |
| 型 | 文字列、数値、真偽値 | string, number, boolean |
| 定数 | 真、偽、無、未定義 | true, false, null, undefined |
| メソッド | 写像、絞込、畳込、探索 | map, filter, reduce, find |
| 修飾子 | 非同期、待機、静的、公開、非公開 | async, await, static, public, private |
