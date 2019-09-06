/**
 * @file
 * module desc
 * @desczh
 * 模块描述
 */



/**
 * interface desc
 * @since 0.2.0
 * @ignore
 * @desczh
 * 接口描述
 */
export interface Interface {
  /**
   * interface field desc 
   * @desczh
   * 接口字段描述
   */
  string: string
  /**
   * interface method var desc
   * @desczh
   * 接口方法变量描述
   */
  add: () => void
  /**
   * interface method desc
   * @desczh
   * 接口方法描述
   */
  a():void
}

export class Class {
  /**
   * class static method desc
   * @desczh
   * 类静态方法描述
   */
  static classStaticMethod(){
      void 0
  } 
  /**
   * class method desc
   * @desczh
   * 类方法描述
   */
  classMethod(){
      void 0
  }
  /**
   * class field desc
   * @desczh
   * 类字段描述
   * 
   */
  classfield: string = ''


}

/**
* constant desc
* @desczh
* 变量描述
*/
export const constanta = 1
/**
* function desc
* @desczh
* 函数描述
*/
export function functiona(){
  void 0
} 

/**
* typeAlias desc
* @desczh
* 类型描述
*/
export type Type = {


}
/**
* inner constant descb
* @desczh
* 变量描述 b
*/
const exportvarb = ''
/**
* inner constant desc
* @desczh
* 变量描述
*/
const exportvara = ''
/**
* export inner function desc
* @desczh
* 函数描述
*/
const exportmethod = () => void 0
export {
  /**
   * export constant desc
   * @desczh
   * 导出变量描述
   */
  exportvara,
  /**
   * export function desc
   * @desczh
   * 导出函数描述
   */
  exportmethod,

}

