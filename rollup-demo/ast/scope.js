/*
 * @Descripttion: 
 * @Author: lukasavage
 * @Date: 2022-06-10 21:56:18
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-06-10 21:58:07
 * @FilePath: \rollup-study\rollup-demo\ast\scope.js
 */
class Scope {
	constructor(options = {}) {
		//作用域的名称
		this.name = options.name;
		//父作用域
		this.parent = options.parent;
		//此作用域内定义的变量
		this.names = options.names || [];
	}
	add(name) {
		this.names.push(name);
	}
    // 给定一个变量，查一下在哪个作用域中定义的这个变量
	findDefiningScope(name) {
		if (this.names.includes(name)) { // 如果自己有，就返回自己这个作用域
			return this;
		} else if (this.parent) { // 如果自己没有这个变量，但是有爹，看看爹有没有
			return this.parent.findDefiningScope(name);
		} else {
			return null;
		}
	}
}
module.exports = Scope;
