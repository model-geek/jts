// JTS ランタイム - 日本語メソッドエイリアス
// このファイルは JTS コード実行時に自動的に import されます

declare global {
  interface Array<T> {
    写像<U>(callbackfn: (value: T, index: number, array: T[]) => U): U[];
    絞込(predicate: (value: T, index: number, array: T[]) => boolean): T[];
    畳込<U>(callbackfn: (accumulator: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
    探索(predicate: (value: T, index: number, array: T[]) => boolean): T | undefined;
    全て(predicate: (value: T, index: number, array: T[]) => boolean): boolean;
    いずれか(predicate: (value: T, index: number, array: T[]) => boolean): boolean;
    含む(searchElement: T): boolean;
    結合(separator?: string): string;
    逆順(): T[];
    整列(compareFn?: (a: T, b: T) => number): T[];
    先頭(): T | undefined;
    末尾(): T | undefined;
  }

  interface String {
    分割(separator: string | RegExp, limit?: number): string[];
    含む(searchString: string): boolean;
    始まる(searchString: string): boolean;
    終わる(searchString: string): boolean;
    置換(searchValue: string | RegExp, replaceValue: string): string;
    全置換(searchValue: string | RegExp, replaceValue: string): string;
    除去(): string;
    大文字(): string;
    小文字(): string;
  }
}

// Array メソッド
Object.defineProperty(Array.prototype, '写像', {
  value: Array.prototype.map,
  writable: true,
  configurable: true,
});

Object.defineProperty(Array.prototype, '絞込', {
  value: Array.prototype.filter,
  writable: true,
  configurable: true,
});

Object.defineProperty(Array.prototype, '畳込', {
  value: Array.prototype.reduce,
  writable: true,
  configurable: true,
});

Object.defineProperty(Array.prototype, '探索', {
  value: Array.prototype.find,
  writable: true,
  configurable: true,
});

Object.defineProperty(Array.prototype, '全て', {
  value: Array.prototype.every,
  writable: true,
  configurable: true,
});

Object.defineProperty(Array.prototype, 'いずれか', {
  value: Array.prototype.some,
  writable: true,
  configurable: true,
});

Object.defineProperty(Array.prototype, '含む', {
  value: Array.prototype.includes,
  writable: true,
  configurable: true,
});

Object.defineProperty(Array.prototype, '結合', {
  value: Array.prototype.join,
  writable: true,
  configurable: true,
});

Object.defineProperty(Array.prototype, '逆順', {
  value: Array.prototype.reverse,
  writable: true,
  configurable: true,
});

Object.defineProperty(Array.prototype, '整列', {
  value: Array.prototype.sort,
  writable: true,
  configurable: true,
});

Object.defineProperty(Array.prototype, '先頭', {
  value: function <T>(this: T[]): T | undefined {
    return this[0];
  },
  writable: true,
  configurable: true,
});

Object.defineProperty(Array.prototype, '末尾', {
  value: function <T>(this: T[]): T | undefined {
    return this[this.length - 1];
  },
  writable: true,
  configurable: true,
});

// String メソッド
Object.defineProperty(String.prototype, '分割', {
  value: String.prototype.split,
  writable: true,
  configurable: true,
});

Object.defineProperty(String.prototype, '含む', {
  value: String.prototype.includes,
  writable: true,
  configurable: true,
});

Object.defineProperty(String.prototype, '始まる', {
  value: String.prototype.startsWith,
  writable: true,
  configurable: true,
});

Object.defineProperty(String.prototype, '終わる', {
  value: String.prototype.endsWith,
  writable: true,
  configurable: true,
});

Object.defineProperty(String.prototype, '置換', {
  value: String.prototype.replace,
  writable: true,
  configurable: true,
});

Object.defineProperty(String.prototype, '全置換', {
  value: String.prototype.replaceAll,
  writable: true,
  configurable: true,
});

Object.defineProperty(String.prototype, '除去', {
  value: String.prototype.trim,
  writable: true,
  configurable: true,
});

Object.defineProperty(String.prototype, '大文字', {
  value: String.prototype.toUpperCase,
  writable: true,
  configurable: true,
});

Object.defineProperty(String.prototype, '小文字', {
  value: String.prototype.toLowerCase,
  writable: true,
  configurable: true,
});

export {};
