/**
 * @file
 */
import { parse as _parse } from 'macoolka-type-ast';
import { Module } from 'macoolka-type-model';
import * as array from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/pipeable';
import * as E from 'fp-ts/lib/Either';
import * as R from 'fp-ts/lib/Reader';
import { FileWhereUniqueInput } from 'macoolka-store-core';
const filterModule = (a: Module.MModule) => {

    const result: Module.MModule = {
        ...a,
        constants: pipe(
            a.constants,
            array.filter(a => a.isExported && a.ignore !== true)
        ),
        functions: pipe(
            a.functions,
            array.filter(a => a.isExported && a.ignore !== true)
        ),
        classes: pipe(
            a.classes,
            array.filter(a => a.isExported && a.ignore !== true)
        ),
        interfaces: pipe(
            a.interfaces,
            array.filter(a => a.isExported && a.ignore !== true)
        ),
        typealiases: pipe(
            a.typealiases,
            array.filter(a => a.isExported && a.ignore !== true)
        ),
        exports: pipe(
            a.exports,
            array.filter(a => a.ignore !== true)
        ),
    };
    return result;
};
/**
 * Parse files to Module
 * @desczh
 * 解析文件到Module
 * @since 0.2.0
 */
export const parse = (files: FileWhereUniqueInput[]) =>
    pipe(
        _parse(files),
        E.map(as =>
            pipe(
                as,
                R.map(a =>
                    pipe(
                        a,
                        array.filter(a => a.file === true),
                        array.map(filterModule)
                    ))
            ))
    );
