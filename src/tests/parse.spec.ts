import { parse } from '../parse'
import { writeFileSync } from 'fs'
import {pipe} from 'fp-ts/lib/pipeable'
import * as E from 'fp-ts/lib/Either'
//import {formatWithType} from 'macoolka-format'
describe('typescript get tags', () => {
    it('parse default', () => {
     
        pipe(
            parse([{ container:__dirname, folders:['fixtures'],name:'Basic.ts' }]),
            E.map(a=>{
                const value=a({})
                writeFileSync(__dirname + '/Basic.json', JSON.stringify(value), 'utf-8')
                expect(value).toMatchSnapshot();
                return a
            }),
            a=>expect(E.isRight(a)).toBeTruthy()
        )
    })
    it('parse locale zh', () => {
  
        pipe(
            parse([{ container:__dirname, folders:['fixtures'],name:'Basic.ts' }]),
            E.map(a=>{
                const value=a({i18n:{locale:'zh'}})
                writeFileSync(__dirname + '/Basic.zh.json', JSON.stringify(value), 'utf-8')
                expect(value).toMatchSnapshot();
                return a
            }),
            a=>expect(E.isRight(a)).toBeTruthy()
        )
     
    })

})