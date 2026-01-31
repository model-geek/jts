# JTS の作り方

このドキュメントでは、JTS を一から作る方法を説明します。

## ロードマップ

| バージョン | 実装 | 機能 |
|-----------|------|------|
| v0.1.0 | TypeScript | 単純なキーワード置換、Bun で実行 |
| v0.2.0 | Zig | 字句解析・構文解析の導入 |
| v0.3.0 | Zig | 自然な日本語構文（語順変更）のサポート |
| v1.0.0 | Zig | 型検査、エラーメッセージ日本語化 |

## 将来の自然な日本語構文（例）

```jts
// v0.1.0: TypeScript 風（語順そのまま）
もし (x > 0) {
    表示(x)
}

// v0.3.0: 自然な日本語風（語順変更）
もし x が 0 より大きい ならば {
    x を 表示する
}

// 関数定義も自然に
「名前」を受け取り「文字列」を返す関数 挨拶する {
    「こんにちは、」と 名前 と「さん」を 繋げて 返す
}

// 配列操作
数字たち の 各要素 を 2倍 にして 新しい配列 を 作る
// → 数字たち.map(x => x * 2)
```

---

# Part 1: v0.1.0 - TypeScript 実装

まずは動くものを作ります。構文解析なしの単純な置換です。

## プロジェクト構成

```
jts/
├── src/
│   ├── cli.ts          # CLI エントリーポイント
│   ├── transformer.ts  # キーワード置換ロジック
│   └── runtime.ts      # 日本語メソッドエイリアス
├── bin/
│   └── jts             # 実行ファイル
├── package.json
├── tsconfig.json
└── README.md
```

## Step 1: プロジェクトの初期化

```bash
mkdir jts && cd jts
npm init -y
```

`package.json`:

```json
{
  "name": "@model-geek/jts",
  "version": "0.1.0",
  "description": "日本語で書ける TypeScript",
  "main": "dist/cli.js",
  "bin": {
    "jts": "./bin/jts"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "keywords": ["typescript", "japanese", "education"],
  "license": "MIT",
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true
  },
  "include": ["src/**/*"]
}
```

## Step 2: キーワード置換ロジック

`src/transformer.ts`:

```typescript
// キーワード対応表（長いものから先にマッチ）
const KEYWORDS: [RegExp, string][] = [
  [/そうでなければもし/g, 'else if'],
  [/そうでなければ/g, 'else'],
  [/の中の/g, 'of'],
  [/関数/g, 'function'],
  [/定数/g, 'const'],
  [/変数/g, 'let'],
  [/もし/g, 'if'],
  [/繰り返し/g, 'for'],
  [/各々/g, 'for'],
  [/間/g, 'while'],
  [/戻す/g, 'return'],
  [/クラス/g, 'class'],
  [/拡張/g, 'extends'],
  [/構築/g, 'constructor'],
  [/自分/g, 'this'],
  [/新規/g, 'new'],
  [/真/g, 'true'],
  [/偽/g, 'false'],
  [/無/g, 'null'],
  [/未定義/g, 'undefined'],
  [/非同期/g, 'async'],
  [/待機/g, 'await'],
  [/試行/g, 'try'],
  [/捕捉/g, 'catch'],
  [/最後に/g, 'finally'],
  [/投げる/g, 'throw'],
  [/型/g, 'type'],
  [/接点/g, 'interface'],
  [/出力/g, 'export'],
  [/入力/g, 'import'],
  [/表示/g, 'console.log'],
];

const TYPES: [RegExp, string][] = [
  [/文字列/g, 'string'],
  [/数値/g, 'number'],
  [/真偽値/g, 'boolean'],
  [/無効/g, 'void'],
  [/何でも/g, 'any'],
  [/不明/g, 'unknown'],
  [/絶対無/g, 'never'],
];

export function transform(source: string): string {
  const strings: string[] = [];

  // 文字列リテラルを退避（誤置換防止）
  let result = source.replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, (match) => {
    strings.push(match);
    return `__STRING_${strings.length - 1}__`;
  });

  // キーワード置換
  for (const [pattern, replacement] of KEYWORDS) {
    result = result.replace(pattern, replacement);
  }
  for (const [pattern, replacement] of TYPES) {
    result = result.replace(pattern, replacement);
  }

  // 文字列を復元
  result = result.replace(/__STRING_(\d+)__/g, (_, i) => strings[parseInt(i)]);

  return result;
}
```

## Step 3: ランタイム

`src/runtime.ts`:

```typescript
Object.defineProperty(Array.prototype, '写像', {
  value: Array.prototype.map, writable: true, configurable: true,
});
Object.defineProperty(Array.prototype, '絞込', {
  value: Array.prototype.filter, writable: true, configurable: true,
});
Object.defineProperty(Array.prototype, '畳込', {
  value: Array.prototype.reduce, writable: true, configurable: true,
});
Object.defineProperty(Array.prototype, '探索', {
  value: Array.prototype.find, writable: true, configurable: true,
});
Object.defineProperty(Array.prototype, '含む', {
  value: Array.prototype.includes, writable: true, configurable: true,
});
Object.defineProperty(Array.prototype, '結合', {
  value: Array.prototype.join, writable: true, configurable: true,
});
Object.defineProperty(String.prototype, '分割', {
  value: String.prototype.split, writable: true, configurable: true,
});
Object.defineProperty(String.prototype, '含む', {
  value: String.prototype.includes, writable: true, configurable: true,
});
export {};
```

## Step 4: CLI

`src/cli.ts`:

```typescript
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { transform } from './transformer';

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('使い方: jts <ファイル.jts>');
    process.exit(1);
  }

  const inputFile = args[0];
  if (!inputFile.endsWith('.jts')) {
    console.error('エラー: .jts ファイルを指定してください');
    process.exit(1);
  }
  if (!fs.existsSync(inputFile)) {
    console.error(`エラー: ファイルが見つかりません: ${inputFile}`);
    process.exit(1);
  }

  const source = fs.readFileSync(inputFile, 'utf-8');
  const transformed = transform(source);

  const runtimePath = path.resolve(__dirname, 'runtime.js');
  const withRuntime = `import '${runtimePath}';\n${transformed}`;

  const tempFile = inputFile.replace('.jts', '.tmp.ts');
  fs.writeFileSync(tempFile, withRuntime);

  try {
    execSync(`bun run ${tempFile}`, { stdio: 'inherit' });
  } finally {
    fs.unlinkSync(tempFile);
  }
}

main();
```

## Step 5: 実行ファイル

`bin/jts`:

```bash
#!/usr/bin/env node
require('../dist/cli.js');
```

```bash
chmod +x bin/jts
npm run build
npm link
```

---

# Part 2: v0.2.0 - Zig 実装

ここから本格的なコンパイラを Zig で作ります。

## なぜ Zig か

- **高速**: C 並みの実行速度
- **シンプル**: C++ より学びやすい
- **メモリ安全**: 明示的なメモリ管理で学習になる
- **クロスコンパイル**: 1 つのソースから全プラットフォーム対応

## コンパイラの構成要素

```
ソースコード (.jts)
    ↓
┌─────────────┐
│  字句解析器  │  ソースコード → トークン列
│   (Lexer)   │
└─────────────┘
    ↓
┌─────────────┐
│  構文解析器  │  トークン列 → AST（抽象構文木）
│  (Parser)   │
└─────────────┘
    ↓
┌─────────────┐
│  コード生成  │  AST → TypeScript/JavaScript
│  (Codegen)  │
└─────────────┘
    ↓
出力 (.ts)
```

## Zig プロジェクト構成

```
jts/
├── src/
│   ├── main.zig        # エントリーポイント
│   ├── lexer.zig       # 字句解析器
│   ├── token.zig       # トークン定義
│   ├── parser.zig      # 構文解析器
│   ├── ast.zig         # AST ノード定義
│   └── codegen.zig     # コード生成
├── build.zig
└── README.md
```

## Step 1: Zig のセットアップ

```bash
# macOS
brew install zig

# または公式サイトからダウンロード
# https://ziglang.org/download/
```

バージョン確認:

```bash
zig version
# 0.13.0 以上推奨
```

## Step 2: プロジェクト初期化

```bash
mkdir jts-zig && cd jts-zig
zig init
```

`build.zig`:

```zig
const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const exe = b.addExecutable(.{
        .name = "jts",
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    b.installArtifact(exe);

    // テスト
    const unit_tests = b.addTest(.{
        .root_source_file = b.path("src/main.zig"),
        .target = target,
        .optimize = optimize,
    });

    const run_unit_tests = b.addRunArtifact(unit_tests);
    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&run_unit_tests.step);
}
```

## Step 3: トークン定義

`src/token.zig`:

```zig
const std = @import("std");

pub const TokenType = enum {
    // リテラル
    identifier,      // 変数名・関数名
    number,          // 数値
    string,          // 文字列

    // 日本語キーワード
    kw_kansu,        // 関数
    kw_teisu,        // 定数
    kw_hensu,        // 変数
    kw_moshi,        // もし
    kw_soudenakereba,// そうでなければ
    kw_kurikaeshi,   // 繰り返し
    kw_aida,         // 間
    kw_modosu,       // 戻す
    kw_class,        // クラス
    kw_jibun,        // 自分
    kw_shinki,       // 新規

    // 英語キーワード（TypeScript互換）
    kw_function,
    kw_const,
    kw_let,
    kw_if,
    kw_else,
    kw_for,
    kw_while,
    kw_return,

    // 型キーワード
    kw_mojiretsu,    // 文字列
    kw_suuchi,       // 数値
    kw_shingi,       // 真偽値

    // 記号
    lparen,          // (
    rparen,          // )
    lbrace,          // {
    rbrace,          // }
    lbracket,        // [
    rbracket,        // ]
    comma,           // ,
    colon,           // :
    semicolon,       // ;
    dot,             // .
    arrow,           // =>
    equals,          // =
    plus,            // +
    minus,           // -
    star,            // *
    slash,           // /

    // 比較演算子
    eq,              // ==
    neq,             // !=
    lt,              // <
    gt,              // >
    lte,             // <=
    gte,             // >=

    // その他
    eof,
    invalid,
};

pub const Token = struct {
    type: TokenType,
    lexeme: []const u8,  // 元のソースコード上の文字列
    line: usize,
    column: usize,
};

// 日本語キーワードのマップ
pub const japanese_keywords = std.StaticStringMap(TokenType).initComptime(.{
    .{ "関数", .kw_kansu },
    .{ "定数", .kw_teisu },
    .{ "変数", .kw_hensu },
    .{ "もし", .kw_moshi },
    .{ "そうでなければ", .kw_soudenakereba },
    .{ "繰り返し", .kw_kurikaeshi },
    .{ "間", .kw_aida },
    .{ "戻す", .kw_modosu },
    .{ "クラス", .kw_class },
    .{ "自分", .kw_jibun },
    .{ "新規", .kw_shinki },
    .{ "文字列", .kw_mojiretsu },
    .{ "数値", .kw_suuchi },
    .{ "真偽値", .kw_shingi },
    .{ "真", .kw_true },
    .{ "偽", .kw_false },
});

// 英語キーワードのマップ
pub const english_keywords = std.StaticStringMap(TokenType).initComptime(.{
    .{ "function", .kw_function },
    .{ "const", .kw_const },
    .{ "let", .kw_let },
    .{ "if", .kw_if },
    .{ "else", .kw_else },
    .{ "for", .kw_for },
    .{ "while", .kw_while },
    .{ "return", .kw_return },
});
```

## Step 4: 字句解析器

`src/lexer.zig`:

```zig
const std = @import("std");
const Token = @import("token.zig").Token;
const TokenType = @import("token.zig").TokenType;
const japanese_keywords = @import("token.zig").japanese_keywords;
const english_keywords = @import("token.zig").english_keywords;

pub const Lexer = struct {
    source: []const u8,
    pos: usize,
    line: usize,
    column: usize,

    pub fn init(source: []const u8) Lexer {
        return .{
            .source = source,
            .pos = 0,
            .line = 1,
            .column = 1,
        };
    }

    pub fn nextToken(self: *Lexer) Token {
        self.skipWhitespace();

        if (self.isAtEnd()) {
            return self.makeToken(.eof, "");
        }

        const start = self.pos;
        const c = self.advance();

        // 記号
        switch (c) {
            '(' => return self.makeToken(.lparen, "("),
            ')' => return self.makeToken(.rparen, ")"),
            '{' => return self.makeToken(.lbrace, "{"),
            '}' => return self.makeToken(.rbrace, "}"),
            '[' => return self.makeToken(.lbracket, "["),
            ']' => return self.makeToken(.rbracket, "]"),
            ',' => return self.makeToken(.comma, ","),
            ':' => return self.makeToken(.colon, ":"),
            ';' => return self.makeToken(.semicolon, ";"),
            '.' => return self.makeToken(.dot, "."),
            '+' => return self.makeToken(.plus, "+"),
            '-' => return self.makeToken(.minus, "-"),
            '*' => return self.makeToken(.star, "*"),
            '/' => {
                // コメント処理
                if (self.peek() == '/') {
                    self.skipLineComment();
                    return self.nextToken();
                }
                return self.makeToken(.slash, "/");
            },
            '=' => {
                if (self.peek() == '=') {
                    _ = self.advance();
                    return self.makeToken(.eq, "==");
                }
                if (self.peek() == '>') {
                    _ = self.advance();
                    return self.makeToken(.arrow, "=>");
                }
                return self.makeToken(.equals, "=");
            },
            '<' => {
                if (self.peek() == '=') {
                    _ = self.advance();
                    return self.makeToken(.lte, "<=");
                }
                return self.makeToken(.lt, "<");
            },
            '>' => {
                if (self.peek() == '=') {
                    _ = self.advance();
                    return self.makeToken(.gte, ">=");
                }
                return self.makeToken(.gt, ">");
            },
            '!' => {
                if (self.peek() == '=') {
                    _ = self.advance();
                    return self.makeToken(.neq, "!=");
                }
                return self.makeToken(.invalid, "!");
            },
            '"', '\'' => return self.string(c),
            else => {},
        }

        // 数値
        if (isDigit(c)) {
            return self.number(start);
        }

        // 識別子・キーワード（日本語含む）
        if (isIdentifierStart(c) or isJapaneseChar(self.source, start)) {
            return self.identifier(start);
        }

        return self.makeToken(.invalid, self.source[start..self.pos]);
    }

    fn identifier(self: *Lexer, start: usize) Token {
        while (!self.isAtEnd()) {
            if (isIdentifierChar(self.peek()) or isJapaneseChar(self.source, self.pos)) {
                _ = self.advanceUtf8();
            } else {
                break;
            }
        }

        const lexeme = self.source[start..self.pos];

        // キーワードチェック
        if (japanese_keywords.get(lexeme)) |token_type| {
            return self.makeToken(token_type, lexeme);
        }
        if (english_keywords.get(lexeme)) |token_type| {
            return self.makeToken(token_type, lexeme);
        }

        return self.makeToken(.identifier, lexeme);
    }

    fn number(self: *Lexer, start: usize) Token {
        while (isDigit(self.peek())) {
            _ = self.advance();
        }

        // 小数点
        if (self.peek() == '.' and isDigit(self.peekNext())) {
            _ = self.advance(); // '.'
            while (isDigit(self.peek())) {
                _ = self.advance();
            }
        }

        return self.makeToken(.number, self.source[start..self.pos]);
    }

    fn string(self: *Lexer, quote: u8) Token {
        const start = self.pos - 1;
        while (!self.isAtEnd() and self.peek() != quote) {
            if (self.peek() == '\\') {
                _ = self.advance(); // エスケープ
            }
            if (self.peek() == '\n') {
                self.line += 1;
                self.column = 1;
            }
            _ = self.advance();
        }

        if (self.isAtEnd()) {
            return self.makeToken(.invalid, "unterminated string");
        }

        _ = self.advance(); // closing quote
        return self.makeToken(.string, self.source[start..self.pos]);
    }

    fn skipWhitespace(self: *Lexer) void {
        while (!self.isAtEnd()) {
            switch (self.peek()) {
                ' ', '\t', '\r' => {
                    _ = self.advance();
                },
                '\n' => {
                    self.line += 1;
                    self.column = 1;
                    _ = self.advance();
                },
                else => return,
            }
        }
    }

    fn skipLineComment(self: *Lexer) void {
        while (!self.isAtEnd() and self.peek() != '\n') {
            _ = self.advance();
        }
    }

    fn advance(self: *Lexer) u8 {
        const c = self.source[self.pos];
        self.pos += 1;
        self.column += 1;
        return c;
    }

    fn advanceUtf8(self: *Lexer) void {
        const len = std.unicode.utf8ByteSequenceLength(self.source[self.pos]) catch 1;
        self.pos += len;
        self.column += 1;
    }

    fn peek(self: *Lexer) u8 {
        if (self.isAtEnd()) return 0;
        return self.source[self.pos];
    }

    fn peekNext(self: *Lexer) u8 {
        if (self.pos + 1 >= self.source.len) return 0;
        return self.source[self.pos + 1];
    }

    fn isAtEnd(self: *Lexer) bool {
        return self.pos >= self.source.len;
    }

    fn makeToken(self: *Lexer, token_type: TokenType, lexeme: []const u8) Token {
        return .{
            .type = token_type,
            .lexeme = lexeme,
            .line = self.line,
            .column = self.column,
        };
    }
};

fn isDigit(c: u8) bool {
    return c >= '0' and c <= '9';
}

fn isIdentifierStart(c: u8) bool {
    return (c >= 'a' and c <= 'z') or (c >= 'A' and c <= 'Z') or c == '_';
}

fn isIdentifierChar(c: u8) bool {
    return isIdentifierStart(c) or isDigit(c);
}

fn isJapaneseChar(source: []const u8, pos: usize) bool {
    if (pos >= source.len) return false;
    const len = std.unicode.utf8ByteSequenceLength(source[pos]) catch return false;
    if (pos + len > source.len) return false;
    const codepoint = std.unicode.utf8Decode(source[pos..][0..len]) catch return false;
    // ひらがな、カタカナ、漢字の範囲
    return (codepoint >= 0x3040 and codepoint <= 0x309F) or  // ひらがな
           (codepoint >= 0x30A0 and codepoint <= 0x30FF) or  // カタカナ
           (codepoint >= 0x4E00 and codepoint <= 0x9FFF);    // 漢字
}

// テスト
test "lexer basic" {
    var lexer = Lexer.init("定数 x = 42");

    const t1 = lexer.nextToken();
    try std.testing.expectEqual(TokenType.kw_teisu, t1.type);

    const t2 = lexer.nextToken();
    try std.testing.expectEqual(TokenType.identifier, t2.type);
    try std.testing.expectEqualStrings("x", t2.lexeme);
}
```

## Step 5: AST 定義

`src/ast.zig`:

```zig
const std = @import("std");

pub const Node = union(enum) {
    program: Program,
    var_decl: VarDecl,
    func_decl: FuncDecl,
    if_stmt: IfStmt,
    for_stmt: ForStmt,
    return_stmt: ReturnStmt,
    expr_stmt: ExprStmt,
    binary_expr: BinaryExpr,
    call_expr: CallExpr,
    identifier: Identifier,
    number_lit: NumberLit,
    string_lit: StringLit,
};

pub const Program = struct {
    statements: []Node,
};

pub const VarDecl = struct {
    is_const: bool,
    name: []const u8,
    type_annotation: ?[]const u8,
    initializer: ?*Node,
};

pub const FuncDecl = struct {
    name: []const u8,
    params: []Param,
    return_type: ?[]const u8,
    body: []Node,
};

pub const Param = struct {
    name: []const u8,
    type_annotation: []const u8,
};

pub const IfStmt = struct {
    condition: *Node,
    then_branch: []Node,
    else_branch: ?[]Node,
};

pub const ForStmt = struct {
    initializer: ?*Node,
    condition: ?*Node,
    increment: ?*Node,
    body: []Node,
};

pub const ReturnStmt = struct {
    value: ?*Node,
};

pub const ExprStmt = struct {
    expr: *Node,
};

pub const BinaryExpr = struct {
    left: *Node,
    operator: []const u8,
    right: *Node,
};

pub const CallExpr = struct {
    callee: *Node,
    arguments: []*Node,
};

pub const Identifier = struct {
    name: []const u8,
};

pub const NumberLit = struct {
    value: []const u8,
};

pub const StringLit = struct {
    value: []const u8,
};
```

## Step 6: コード生成

`src/codegen.zig`:

```zig
const std = @import("std");
const ast = @import("ast.zig");
const Node = ast.Node;

pub const CodeGen = struct {
    output: std.ArrayList(u8),
    indent: usize,

    pub fn init(allocator: std.mem.Allocator) CodeGen {
        return .{
            .output = std.ArrayList(u8).init(allocator),
            .indent = 0,
        };
    }

    pub fn deinit(self: *CodeGen) void {
        self.output.deinit();
    }

    pub fn generate(self: *CodeGen, node: Node) ![]const u8 {
        try self.emitNode(node);
        return self.output.items;
    }

    fn emitNode(self: *CodeGen, node: Node) !void {
        switch (node) {
            .program => |prog| {
                for (prog.statements) |stmt| {
                    try self.emitNode(stmt);
                    try self.emit("\n");
                }
            },
            .var_decl => |decl| {
                try self.emitIndent();
                if (decl.is_const) {
                    try self.emit("const ");
                } else {
                    try self.emit("let ");
                }
                try self.emit(decl.name);
                if (decl.type_annotation) |t| {
                    try self.emit(": ");
                    try self.emitType(t);
                }
                if (decl.initializer) |init| {
                    try self.emit(" = ");
                    try self.emitNode(init.*);
                }
                try self.emit(";");
            },
            .func_decl => |func| {
                try self.emitIndent();
                try self.emit("function ");
                try self.emit(func.name);
                try self.emit("(");
                for (func.params, 0..) |param, i| {
                    if (i > 0) try self.emit(", ");
                    try self.emit(param.name);
                    try self.emit(": ");
                    try self.emitType(param.type_annotation);
                }
                try self.emit(")");
                if (func.return_type) |rt| {
                    try self.emit(": ");
                    try self.emitType(rt);
                }
                try self.emit(" {\n");
                self.indent += 1;
                for (func.body) |stmt| {
                    try self.emitNode(stmt);
                    try self.emit("\n");
                }
                self.indent -= 1;
                try self.emitIndent();
                try self.emit("}");
            },
            .return_stmt => |ret| {
                try self.emitIndent();
                try self.emit("return");
                if (ret.value) |val| {
                    try self.emit(" ");
                    try self.emitNode(val.*);
                }
                try self.emit(";");
            },
            .identifier => |id| {
                try self.emit(id.name);
            },
            .number_lit => |num| {
                try self.emit(num.value);
            },
            .string_lit => |str| {
                try self.emit(str.value);
            },
            .binary_expr => |bin| {
                try self.emitNode(bin.left.*);
                try self.emit(" ");
                try self.emit(bin.operator);
                try self.emit(" ");
                try self.emitNode(bin.right.*);
            },
            .call_expr => |call| {
                try self.emitNode(call.callee.*);
                try self.emit("(");
                for (call.arguments, 0..) |arg, i| {
                    if (i > 0) try self.emit(", ");
                    try self.emitNode(arg.*);
                }
                try self.emit(")");
            },
            else => {},
        }
    }

    // 日本語型を英語に変換
    fn emitType(self: *CodeGen, jp_type: []const u8) !void {
        const type_map = std.StaticStringMap([]const u8).initComptime(.{
            .{ "文字列", "string" },
            .{ "数値", "number" },
            .{ "真偽値", "boolean" },
            .{ "無効", "void" },
            .{ "何でも", "any" },
        });

        if (type_map.get(jp_type)) |en_type| {
            try self.emit(en_type);
        } else {
            try self.emit(jp_type);
        }
    }

    fn emitIndent(self: *CodeGen) !void {
        for (0..self.indent) |_| {
            try self.emit("  ");
        }
    }

    fn emit(self: *CodeGen, str: []const u8) !void {
        try self.output.appendSlice(str);
    }
};
```

## Step 7: メインエントリーポイント

`src/main.zig`:

```zig
const std = @import("std");
const Lexer = @import("lexer.zig").Lexer;

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    const args = try std.process.argsAlloc(allocator);
    defer std.process.argsFree(allocator, args);

    if (args.len < 2) {
        std.debug.print("使い方: jts <ファイル.jts>\n", .{});
        return;
    }

    const filename = args[1];
    const source = try std.fs.cwd().readFileAlloc(allocator, filename, 1024 * 1024);
    defer allocator.free(source);

    // 字句解析テスト
    var lexer = Lexer.init(source);
    while (true) {
        const token = lexer.nextToken();
        std.debug.print("{s}: {s}\n", .{ @tagName(token.type), token.lexeme });
        if (token.type == .eof) break;
    }
}

test {
    _ = @import("lexer.zig");
}
```

## ビルドと実行

```bash
# ビルド
zig build

# 実行
./zig-out/bin/jts test.jts

# テスト
zig build test
```

---

# Part 3: v0.3.0 - 自然な日本語構文

語順を変える構文のサポートには、より高度な構文解析が必要です。

## 自然な日本語構文の例

```jts
// 「〜を〜する」形式
x を 表示する
// → console.log(x)

// 「〜が〜なら」形式
もし x が 0 より大きい ならば {
    ...
}
// → if (x > 0) { ... }

// 「〜を〜にして〜を作る」形式
数字たち の 各要素 を 2倍 にした 配列
// → 数字たち.map(x => x * 2)
```

## 実装のポイント

1. **後置記法のサポート**: 日本語は動詞が最後に来る
2. **助詞の解析**: 「を」「が」「の」「に」などを構文要素として認識
3. **文末表現**: 「する」「ならば」「作る」などで文の種類を判定

これは構文解析器を大幅に拡張する必要があり、v0.3.0 以降の課題です。

---

## まとめ

| バージョン | 作業量 | 難易度 |
|-----------|--------|--------|
| v0.1.0 (TypeScript) | 約180行 | 初心者OK |
| v0.2.0 (Zig 字句解析) | 約500行 | Zig 入門に最適 |
| v0.3.0 (自然な日本語) | 約1500行+ | 中級者向け |

まずは v0.1.0 を TypeScript で完成させ、動作確認してから Zig に移行するのがおすすめです。
