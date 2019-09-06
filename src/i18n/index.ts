import en from './en.json';
import zh from './zh.json';
import buildApp, { MessageInfo } from 'macoolka-i18n';
import { defaultOption as typeI18NOption } from 'macoolka-type-model/lib/i18n';

export const defaultOption = {
    defaultLanguage: 'en',
    locale: 'en',
    languages: ['en', 'zh'],
    data: {
        en: {
            ...en,
            ...typeI18NOption.data.en,
        },
        zh: {
            ...zh,
            ...typeI18NOption.data.zh,
        },
    },
};
export type Message = MessageInfo<keyof typeof en | (keyof typeof typeI18NOption.data.en) , {
    value?: string,

}>;

export const buildI18N = buildApp<Message>(defaultOption);
export default buildI18N;
