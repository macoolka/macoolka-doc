/**
 * @file
 */
import * as TE from 'fp-ts/lib/TaskEither';
import { parse } from './parse';
import { Module } from 'macoolka-type-model';
import * as path from 'path';
import { printModule } from './markdown';
import * as E from 'fp-ts/lib/Either';
import * as R from 'fp-ts/lib/Reader';
import * as A from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/pipeable';
import { MonadFileStore, FileWhereUniqueInput, showFile, TextFile } from 'macoolka-store-core';
import { MonadLog } from 'macoolka-log-core';
import { MonidI18N } from 'macoolka-i18n';
// import { sequenceParallel } from 'macoolka-fp/lib/TaskEither'
import { MonadDocument, printJekyllPage } from 'macoolka-document';
import { MonadFunction } from 'macoolka-app/lib/MonadFunction';
import * as MN from 'macoolka-app/lib/MonadNode';
import formatI18N from './i18n';
/**
 * @since 0.2.0
 */
export interface Capabilities extends MonadFileStore, MonadLog, MonadDocument {
    srcDir: string;
    outDir: string;
    locales: string[];
}

/**
 * App effect
 *
 * @since 0.2.0
 */
export interface MonadDoc<A> extends MonadFunction<Capabilities, A> { }

interface PackageJSON {
    readonly name: string;
    readonly homepage?: string;
}

const getPackageJSON: MonadDoc<PackageJSON> = C =>
    pipe(
        C.readTextFile({ container: '', folders: [], name: 'package.json' }),
        TE.chain(s => {
            const json = JSON.parse(s.data);
            const name = json.name;
            return pipe(
                C.debug(`Project name detected: ${name}`),
                TE.map(() => ({
                    name,
                    homepage: json.homepage,
                }))
            );
        })
    );

function parseModules(files: Array<FileWhereUniqueInput>): MonadDoc<MonidI18N<Array<Module.MModule>>> {
    return C =>
        pipe(
            C.log('Parsing modules...'),
            TE.chain(() =>
                TE.fromEither(parse(files))
            )
        );
}

const getConfigYML = (outDir: string, projectName: string, homepage: string): TextFile => {
    return {
        container: outDir,
        folders: [],
        name: '_config.yml',

        data: `remote_theme: pmarsceill/just-the-docs

# Enable or disable the site search
search_enabled: true

# Aux links for the upper right navigation
aux_links:
  '${projectName} on GitHub':
    - '${homepage}'
`,

    };
};

function writeMarkdownFiles(files: Array<TextFile>): MonadDoc<void> {
    return C => {
        const outPattern = path.join(C.outDir, '**/*.ts.md');
        const mdPattern = path.join('**', '*.ts.md');
        return pipe(
            C.log(`Writing markdown...`),
            TE.chain(() => C.debug(`Clean up docs folder: deleting ${outPattern}...`)),
            TE.chain(() => C.glob({ container: C.outDir, folders: [], pattern: mdPattern })),
            TE.chain(as => pipe(
                as.map(C.deleteFile),
                MN.parallel
                // sequenceParallel,
            )),
            TE.chain(() =>
                pipe(
                    files.map(a =>
                        pipe(
                            C.upsertFile({ create: a, update: a, where: a }),
                            TE.chain(() => {
                                return C.debug(`Writing file ${showFile.show(a)}`);
                            })

                        )),
                        MN.parallel
                   // sequenceParallel,
                )
            ),
            TE.map(_ => void 0)
        );

    };
}

function checkHomepage(pkg: PackageJSON): E.Either<MonidI18N, string> {
    return pkg.homepage === undefined ? E.left(() => 'Missing homepage in package.json') : E.right(pkg.homepage);
}

/**
 * parse file in given directory and generate markdown docs
 * @desczh
 * 解析给定目录中的ts文件，产生github markdown 文件
 * @since 0.2.0
 */
export const main = (C: Capabilities) => {
    const srcpath = C.srcDir;
    const outpath = C.outDir;
    const readSources: MonadDoc<Array<FileWhereUniqueInput>> =
        C => {
            const srcPattern = path.join('**', '*.ts');
            const ignorePattern = path.join('!**', 'tests', '**', '*');

            return pipe(
                C.glob({ container: srcpath, folders: [], pattern: [srcPattern, ignorePattern] }),
                TE.chainFirst(paths => C.info(`${paths.length} modules found`))

                //  TE.chain(C.readTextFiles)
            );
        };
    const getMarkdownOutpuPath = (folders: string[]) => (module: Module.MModule): FileWhereUniqueInput => {

        return {
            container: outpath,
            folders,
            name: module.path.join(path.sep) + '.md',
        };
    };

    return pipe(
        C,
        getPackageJSON,
        TE.chain(pkg =>
            pipe(
                TE.fromEither(checkHomepage(pkg)),
                TE.chain(homepage =>
                    pipe(
                        readSources(C),
                        TE.chain(a => parseModules(a)(C)),
                        TE.map(a => pipe(
                            a,
                            R.map(modules => modules.map(module => {
                                const modulepath = module.path.join(path.sep);
                                const name = path.relative(srcpath, modulepath).split(path.sep);
                                return {
                                    ...module,
                                    path: name,
                                };
                            }))
                        )),
                        // TE.chainFirst(a => typecheckExamples(pkg.name)(a)(C)),
                        TE.chain(module => {
                            const configFile = getConfigYML(C.outDir, pkg.name, homepage);

                            const home: TextFile = ({
                                container: C.outDir,
                                folders: [],
                                name: 'index.md',
                                data: printJekyllPage({ name: 'Home', nav: { order: 1 } })(C),
                            });
                            const allfiles = [configFile, home];
                            let orderOne = 2;
                            return pipe(
                                C.locales,
                                A.map(locale => {
                                    let counter = 1;
                                    const getHeadMarkdownFiles = (modules: string) => {

                                        const modulesIndex: TextFile = ({
                                            container: C.outDir,
                                            folders: [modules],
                                            name: 'index.md',
                                            data: printJekyllPage({ name: modules, nav: { order: orderOne++, hasChildren: true, permaLink: `/docs/${modules}` } })(C),

                                        });

                                        return modulesIndex;
                                    };
                                    const modulesName = formatI18N({ id: 'macoolka.doc.modules' })({ i18n: { locale } });
                                    const files = getHeadMarkdownFiles(modulesName);
                                    return pipe(
                                        module({ i18n: { locale } }),
                                        A.map(m => pipe(
                                            printModule({module: m, counter: counter++, ...C, i18n: { i18n: {locale }}}),
                                            MN.map(data => ({
                                                ...getMarkdownOutpuPath([modulesName])(m),
                                                data,
                                            }))

                                        )),
                                        MN.parallel,

                                        MN.map((modules) => {
                                            allfiles.push(...modules);
                                            allfiles.push(files);
                                        })
                                    );
                                 }),
                                 MN.parallel,
                                 MN.chain(_ => writeMarkdownFiles(allfiles)(C))
                                // as=>

                            );

                           // return writeMarkdownFiles(allfiles)(C)
                        })

                    )
                )
            )

        ),
        TE.mapLeft(as => as({}))
    );
};
