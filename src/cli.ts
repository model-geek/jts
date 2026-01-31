import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { execSync, spawnSync } from 'child_process';
import { transform } from './transformer';

const VERSION = '0.1.0';

function showHelp(): void {
  console.log(`
JTS - 日本語 TypeScript v${VERSION}

使い方:
  jts <ファイル.jts>    JTS ファイルを実行
  jts --help, -h        このヘルプを表示
  jts --version, -v     バージョンを表示

例:
  jts index.jts
  jts examples/hello.jts
`);
}

function commandExists(cmd: string): boolean {
  try {
    const result = spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd], {
      stdio: 'pipe',
    });
    return result.status === 0;
  } catch {
    return false;
  }
}

function getRunner(): { cmd: string; args: string[] } {
  if (commandExists('bun')) {
    return { cmd: 'bun', args: ['run'] };
  }
  if (commandExists('tsx')) {
    return { cmd: 'tsx', args: [] };
  }
  if (commandExists('npx')) {
    return { cmd: 'npx', args: ['tsx'] };
  }
  throw new Error(
    'TypeScript ランナーが見つかりません。\n' +
    'bun, tsx のいずれかをインストールしてください。\n\n' +
    '  npm install -g tsx\n' +
    '  または\n' +
    '  curl -fsSL https://bun.sh/install | bash'
  );
}

function showVersion(): void {
  console.log(`jts v${VERSION}`);
}

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    showHelp();
    process.exit(0);
  }

  const arg = args[0];

  if (arg === '--help' || arg === '-h') {
    showHelp();
    process.exit(0);
  }

  if (arg === '--version' || arg === '-v') {
    showVersion();
    process.exit(0);
  }

  const inputFile = arg;

  if (!inputFile.endsWith('.jts')) {
    console.error('エラー: .jts ファイルを指定してください');
    process.exit(1);
  }

  if (!fs.existsSync(inputFile)) {
    console.error(`エラー: ファイルが見つかりません: ${inputFile}`);
    process.exit(1);
  }

  // ソースコードを読み込む
  const source = fs.readFileSync(inputFile, 'utf-8');

  // キーワードを置換
  const transformed = transform(source);

  // ランタイムの import を先頭に追加
  const runtimePath = path.resolve(__dirname, 'runtime.js');
  const withRuntime = `import '${runtimePath}';\n${transformed}`;

  // 一時ファイルに書き出す
  const tempDir = os.tmpdir();
  const baseName = path.basename(inputFile, '.jts');
  const tempFile = path.join(tempDir, `jts_${baseName}_${Date.now()}.ts`);

  fs.writeFileSync(tempFile, withRuntime);

  try {
    // TypeScript ランナーで実行
    const runner = getRunner();
    const command = [runner.cmd, ...runner.args, tempFile].join(' ');
    execSync(command, {
      stdio: 'inherit',
      cwd: path.dirname(path.resolve(inputFile)),
    });
  } catch (error) {
    // ランナーがエラーを出力済みなので、ここでは何もしない
    process.exit(1);
  } finally {
    // 一時ファイルを削除
    try {
      fs.unlinkSync(tempFile);
    } catch {
      // 削除に失敗しても無視
    }
  }
}

main();
