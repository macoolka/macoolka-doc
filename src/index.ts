/**
 * @file
 */
import * as IO from 'fp-ts/lib/IO';
import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import * as core from './doc';
import { markdown } from 'macoolka-markdown';
import buildStore from 'macoolka-store-fs';
import consoleLog, { log, info } from 'macoolka-console';
const capabilities: core.Capabilities = {
  ...TE.taskEither,
  ...buildStore(process.cwd()),
  ...consoleLog,
  doc: markdown,
  srcDir: 'src',
  outDir: 'docs',

  locales: ['en', 'zh'],

};

const exit = (code: 0 | 1): IO.IO<void> => () => process.exit(code);

function onLeft(e: string): T.Task<void> {

  return T.fromIO(
    pipe(
      () => log(e),
      IO.chain(() => exit(1))
    )
  );
}

function onRight(): T.Task<void> {
  return T.fromIO(() => info('Docs generation succeeded!'));
}

/**
 * parse file in process directory and generate markdown docs
 * @desczh
 * 解析process目录src中的ts文件，产生github markdown 文件到process下docs目录
 * @since 0.2.0
 */
export const main: T.Task<void> = pipe(
  core.main(capabilities),
  TE.fold(onLeft, onRight)
);
