/**
 * The define a document interface
 * 
 * It will be instanced by markdown or html
 * 
 * @desczh
 * 这定义了文章的接口。
 * 
 * 将被html、markdown实现 
 * 
 * @file 0.2.0
 */
import { head, tail } from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
export const toc = require('markdown-toc')

/**
 * create a heading
 * The number of number signs you use should correspond to the heading level
 * 
 * @desczh
 * 定义了标题
 * 
 * 数字为标题的级别
 * @since 0.2.0
 */
export interface Header {
    h1: (title: string) => string
    h2: (title: string) => string
    h3: (title: string) => string
    h4: (title: string) => string
    h5: (title: string) => string
    h6: (title: string) => string
}
/**
 * Format a Element
 * You can add emphasis by making text bold or italic
 * @desczh
 * 
 * 格式化一个元素，给一个元素加上特殊效果。
 * @example
 * const a='1'
 * const b='1'
 * const c=a===b
 * 
 * @since 0.2.0
 */
export interface FormattingElement {
    /**
     * Defines important text
     * @desczh
     * 定义主要的文本
     */
    bold: (code: string) => string
    /**
     * Defines italicize text.
     * @desczh
     * 定义一个斜体文本
     */
    italic: (code: string) => string
    /**
     * Defines text that has been deleted from a document
     * @desczh
     * 定义一个删除标记的文本
     */
    del: (text: string) => string

    /**
     * Defines emphasized text 
     * @desczh
     * 定义一个强调的文本
     */
    em: (code: string) => string
    /**
     * Defines marked text.
     * Use the tag if you want to highlight parts of your text.
     * @desczh
     * 定义一个高亮的文本
     */
    mark: (code: string) => string

    /**
     * The tag defines a text that has been inserted into a document.
     * @desczh
     * 定义一个插入的文本
     */
    ins: (code: string) => string

    /**
     * a definition term
     * @desczh
     * 定义一个术语
     */
    dfn: (code: string) => string
    /**
     * The tag defines the title of a work (e.g. a book, a song, a movie, a TV show, a painting, a sculpture, etc.).
     * 定义一个事物的标题
     */
    cite: (code: string) => string

    /**
     * The tag defines a short quotation.
     * @desczh
     * 给文本加引号
     */
    q: (code: string) => string

}
/**
 * The define a List
 * @desczh
 * 列表定义
 */
export interface List {
    /**
     * Defines an ordered list
     * @desczh
     * 有顺序列表
     */
    ol: (as: string[]) => string
    /**
     * Defines an unordered list
     * @desczh
     * 无顺序列表
     */
    ul: (as: string[]) => string
}
/**
 * The define a Document 
 * @desczh
 * 定义一份文档
 */
export interface Document extends Header, List, FormattingElement {
    /**
     * Defines an article
     * @desczh
     * 标记内容为一篇文章
     */
    article: (code: string) => string
    /**
     * To create paragraphs, use a blank line to separate one or more lines of text
     * @desczh
     * 标记内容为一个段落
     */
    paragraph: (code: string) => string
    /**
     * To create a line break (<br>).
     * @desczh
     * 换行
     */
    br: () => string
    /**
     * Defines a section that is quoted from another source
     * @desczh
     * 标记内容为引用别人的论述
     */
    blockquote: (code: string[]) => string

    /**
     * To create a horizontal rule, 
     * @desczh
     * 水平线
     */
    hr: () => string
    /**
     * To create a link, Defines the relationship between a document and an external resource 
     * @desczh
     * 标记内容为链接,一般指向外部资源
     */
    link: (text: string, href: string, title?: string) => string

    /**
     * Defines an image
     * @desczh
     * 标记内容为图片
     */

    img: (text: string, href: string, title?: string) => string

    /**
     * Defines a piece of computer code
     * @desczh
     * 标记内容为一段程序代码
     */
    code: (language: string) => (a: string) => string
    /**
     * Defines a table
     * @desczh
     * 定义一个表格
     */
    table: (as: string[][]) => string

    /**
     * Defines a section in a document
     * @desczh
     * 标记内容为一个章节
     */
    section: (code: string) => string
}
const CRLF = '\n';

const replaceKeys = (a: string) => a.replace(/\|/gi, `\\|`)
const table = (as: string[][]) => {
    const header = pipe(
        head(as),
        O.map(a =>
            CRLF + `| ${a.map(replaceKeys).map(v => ` ${v.trim()} `).join('|')} |` + CRLF +
            `| ${a.map(() => ' --- ').join('|')} |` + CRLF),
        O.getOrElse(() => '')
    );
    const body = pipe(
        tail(as),
        O.map(
            row => row.map(a =>
                `| ${a.map(replaceKeys).map(v => ` ${v.trim()} `).join(`|`)} |`).join(CRLF)),
        O.getOrElse(() => '')
    );
    return header + body + CRLF;
}
/**
 * markdown instance on github
 * @desczh
 * 基于github markdown
 */
export const markdown: Document = {
    h1: title => `# ${title}`,
    h2: title => `## ${title}`,
    h3: title => `### ${title}`,
    h4: title => `#### ${title}`,
    h5: title => `##### ${title}`,
    h6: title => `###### ${title}`,
    bold: text => '**' + text + '**',
    italic: text => `*${text}*`,
    del: text => '~~' + text + '~~',
    q: text => `'${text}'`,
    cite: text => '**' + text + '**',
    dfn: text => '**' + text + '**',
    ins: text => '**' + text + '**',
    mark: text => '**' + text + '**',
    em: text => '**' + text + '**',
    ol: as => as.map(a => `1. ${a}`).join(CRLF),
    ul: as => as.map(a => `- ${a}`).join(CRLF),
    article: text => text + CRLF + CRLF,
    paragraph: text => text + CRLF + CRLF,
    br: () => CRLF,
    link: (text, href) => `[${text}](${href})`,
    img: (text, href) => `![${text}](${href})`,
    code: language => a => `\`\`\`${language}${CRLF}${a}${CRLF}\`\`\``,
    hr: () => '***',
    table,
    section: text => text + CRLF + CRLF,
    blockquote: as => as.map(a => `> ${a}`).join(CRLF),

}

