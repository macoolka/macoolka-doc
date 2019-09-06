import { parse } from '../parse'
import { writeFileSync } from 'fs'
import { printModule } from '../markdown'
import { markdown } from 'macoolka-markdown'
import { pipe } from 'fp-ts/lib/pipeable'
import { array as A } from 'macoolka-collection'
import * as E from 'fp-ts/lib/Either'
import * as MN from 'macoolka-app/lib/MonadNode'
//import {formatWithType} from 'macoolka-format'
describe('markdowns', () => {
    it('print default', () => {

       const value= pipe(
            parse([{ container: __dirname, folders: ['fixtures'], name: 'common.ts' }]),
            E.map(as =>
                pipe(
                    as({}),
                    A.map(a =>
                        pipe(
                            printModule({ module: a, counter: 0, doc: markdown, i18n: {} }),
                            MN.map(result => {
                                writeFileSync(__dirname + '/common.md', result, 'utf-8')
                                expect(result).toMatchSnapshot();
                            })
                        )),
                    MN.sequence,
                    as=>as()
                ),
            ),
           
        )
        expect(E.isRight(value)).toBeTruthy()

    })
     it('print locale zh', () => {
        const value= pipe(
            parse([{ container: __dirname, folders: ['fixtures'], name: 'common.ts' }]),
            E.map(as =>
                pipe(
                    as({ i18n: { locale: 'zh' } }),
                    A.map(a =>
                        pipe(
                            printModule({ module: a, counter: 0, doc: markdown, i18n: { i18n: { locale: 'zh' } } }),
                            MN.map(result => {
                                writeFileSync(__dirname + '/common.md', result, 'utf-8')
                                expect(result).toMatchSnapshot();
                            })
                        )),
                    MN.sequence,
                    as=>as()
                ),
            ),
           
        )
        expect(E.isRight(value)).toBeTruthy()
     }) 

})