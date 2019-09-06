/**
 * markdown utilities
 * @file
 */

import * as O from 'fp-ts/lib/Option';
import { Module } from 'macoolka-type-model';
import { pipe } from 'fp-ts/lib/pipeable';
import { MonadDocument, printArticle, printJekyllPage } from 'macoolka-document';
import { fold, monoidString } from 'fp-ts/lib/Monoid';
import { MonidI18N, MonidI18NParam } from 'macoolka-i18n';
import * as A from 'fp-ts/lib/Array';
import { monadFormat } from 'macoolka-prettier';
import formatI18N from './i18n';
import { notEmptyArray } from 'macoolka-predicate';
import { MonadFunction } from 'macoolka-app/lib/MonadFunction';
import { Reader } from 'fp-ts/lib/Reader';
import * as path from 'path';
export const toc = require('markdown-toc');
export type I18nDocumentApp = Reader<MonadDocument, MonidI18N>;
export type MonadDocumentFunction = MonadFunction<MonadDocument, MonidI18N>;
const foldString = fold(monoidString);
function printElement(
  element:
    Module.MDocumentable & Module.MNameable & { _kind: Module.MIdentifierKind }): I18nDocumentApp {
  return C => i18n => {
    const name = element.deprecated ? C.doc.del(element.name) : element.name;
    const type = formatI18N({ id: `macoolka.data-model.${element._kind}` } as any)(i18n);

    const desc = pipe(
      element.description.map(C.doc.br),
      fold(monoidString),
      content => O.some({
        content: content,
      })
    );
    const signature = pipe(
      element.signature,
      O.fromNullable,
      O.map(value => ({
        title: formatI18N({ id: 'macoolka.doc.signature' })(i18n),
        content: C.doc.code('ts')(value),
      })
      )
    );
    const example = pipe(
      element.examples,
      O.fromPredicate(notEmptyArray),
      O.map(as => C.doc.code('ts')(as.join('\n'))),
      O.map(value => ({
        title: formatI18N({ id: 'macoolka.doc.example' })(i18n),
        content: value,
      }))

    );
    const since = pipe(
      element.since,
      O.fromNullable,
      O.map(value => ({
        content: formatI18N({ id: 'macoolka.doc.since', value: { value } })(i18n),
      })
      )
    );
    return printArticle({
      title: `${name} (${type})`,
      section: pipe(
        [
          desc,
          signature,
          example,
          since,
        ],
        A.compact
      ),
    })(C);

  };
}

function printClass(c: Module.MClass): I18nDocumentApp {
  return C => i18n => {
    return pipe(
      [
        printElement(c)(C)(i18n),
        pipe(
          [
            c.staticMethods.map(a => printElement(a)(C)(i18n)),
            c.methods.map(a => printElement(a)(C)(i18n)),
          ],
          A.flatten,
          foldString
        ),
      ],
      foldString
    );
  };

}

export function printToc(md: string): I18nDocumentApp {
  return C => i18n =>
    pipe(
      [
        C.doc.hr(),
        C.doc.section(`<h2 class="text-delta">${
          formatI18N({ id: 'macoolka.doc.contents' })(i18n)
          }</h2>`),
        C.doc.section(toc(md).content),
        C.doc.hr(),
      ],
      foldString
    );
}
interface PrintModuleInput extends MonadDocument {
  module: Module.MModule;
  counter: number;
  i18n: MonidI18NParam;
}
/**
 * @since 0.2.0
 */
export function printModule(C: PrintModuleInput) {

  const { module, counter, i18n } = C;

  const name = (module.path).join(path.sep);
  const modules = formatI18N({ id: 'macoolka.doc.modules' })(i18n);

  const header = printJekyllPage({ name, nav: { order: counter, parent: modules } })(C);
  const title = formatI18N({ id: 'macoolka.doc.overview' })(i18n);
  const description = pipe(
    module.description.map(C.doc.br),
    foldString
  );

  const moduleContent = printArticle({
    title,
    description,
  })(C);

  const body = pipe([
    module.interfaces.map(printElement),
    module.typealiases.map(printElement),
    module.classes.map(printClass),
    module.constants.map(printElement),
    module.functions.map(printElement),
    module.exports.map(printElement),
  ],
    A.flatten,
    as => as.map(a => a(C)(i18n)).join('')

  );

  const tocContent = printToc(body)(C)(i18n);

  return pipe(
    [
      header,
      moduleContent,
      tocContent,
      body,
    ],
    foldString,
    content => monadFormat({ parser: 'markdown', content })
  );

}
