// キーワード対応表（長いものから先にマッチさせる）
const KEYWORDS: [RegExp, string][] = [
  // 複合キーワード（先に処理）
  [/そうでなければもし/g, 'else if'],
  [/そうでなければ/g, 'else'],
  [/の中の/g, 'of'],

  // 基本キーワード
  [/関数/g, 'function'],
  [/定数/g, 'const'],
  [/変数/g, 'let'],
  [/もし/g, 'if'],
  [/繰り返し/g, 'for'],
  [/各々/g, 'for'],
  [/間/g, 'while'],
  [/戻す/g, 'return'],
  [/抜ける/g, 'break'],
  [/続ける/g, 'continue'],

  // クラス関連
  [/クラス/g, 'class'],
  [/拡張/g, 'extends'],
  [/実装/g, 'implements'],
  [/構築/g, 'constructor'],
  [/自分/g, 'this'],
  [/新規/g, 'new'],
  [/静的/g, 'static'],
  [/公開/g, 'public'],
  [/非公開/g, 'private'],
  [/保護/g, 'protected'],

  // 真偽値・null
  [/真/g, 'true'],
  [/偽/g, 'false'],
  [/無/g, 'null'],
  [/未定義/g, 'undefined'],

  // 非同期
  [/非同期/g, 'async'],
  [/待機/g, 'await'],

  // 例外処理
  [/試行/g, 'try'],
  [/捕捉/g, 'catch'],
  [/最後に/g, 'finally'],
  [/投げる/g, 'throw'],

  // 型・モジュール
  [/型/g, 'type'],
  [/接点/g, 'interface'],
  [/出力/g, 'export'],
  [/入力/g, 'import'],
  [/から/g, 'from'],
  [/として/g, 'as'],
  [/既定/g, 'default'],

  // 演算子
  [/かつ/g, '&&'],
  [/または/g, '||'],
  [/ではない/g, '!'],
  [/である/g, '==='],
  [/でない/g, '!=='],

  // 組み込み関数
  [/表示/g, 'console.log'],
];

// 型の対応表
const TYPES: [RegExp, string][] = [
  [/文字列/g, 'string'],
  [/数値/g, 'number'],
  [/真偽値/g, 'boolean'],
  [/無効/g, 'void'],
  [/何でも/g, 'any'],
  [/不明/g, 'unknown'],
  [/絶対無/g, 'never'],
  [/物体/g, 'object'],
];

export function transform(source: string): string {
  const strings: string[] = [];
  const comments: string[] = [];

  let result = source;

  // 複数行コメントを退避
  result = result.replace(/\/\*[\s\S]*?\*\//g, (match) => {
    comments.push(match);
    return `__COMMENT_${comments.length - 1}__`;
  });

  // 単一行コメントを退避
  result = result.replace(/\/\/.*$/gm, (match) => {
    comments.push(match);
    return `__COMMENT_${comments.length - 1}__`;
  });

  // テンプレートリテラルを退避
  result = result.replace(/`(?:[^`\\]|\\.)*`/g, (match) => {
    strings.push(match);
    return `__STRING_${strings.length - 1}__`;
  });

  // 文字列リテラルを退避（誤置換防止）
  result = result.replace(/(["'])(?:(?!\1)[^\\]|\\.)*\1/g, (match) => {
    strings.push(match);
    return `__STRING_${strings.length - 1}__`;
  });

  // キーワード置換
  for (const [pattern, replacement] of KEYWORDS) {
    result = result.replace(pattern, replacement);
  }

  // 型置換
  for (const [pattern, replacement] of TYPES) {
    result = result.replace(pattern, replacement);
  }

  // 文字列を復元
  result = result.replace(/__STRING_(\d+)__/g, (_, i) => strings[parseInt(i)]);

  // コメントを復元
  result = result.replace(/__COMMENT_(\d+)__/g, (_, i) => comments[parseInt(i)]);

  return result;
}
