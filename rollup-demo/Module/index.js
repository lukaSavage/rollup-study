/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2022-06-05 16:21:20
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-06-05 17:16:16
 * @FilePath: \rollup-study\rollup-demo\Module\index.js
 */
const { default: MagicString } = require('magic-string');
const { parse } = require('acorn');

const analyse = require('../ast/analyse');

class Module {
	constructor({ code, path, bundle }) {
		this.code = new MagicString(code, { filename: path });
		this.path = path;
		this.bundle = bundle;
		this.ast = parse(code, {
			ecmaVersion: 8,
			sourceType: 'module',
		});
		analyse(this.ast, this.code, this );
	}
	// 展开代码的方法
	expandAllStatement() {
		const allStatements = [];
		this.ast.body.forEach(statement => {
			// todo: 我们可能要把statement进行拓展，有可能一行变成多行var name = '张三'; console.log('name');
			allStatements.push(statement);
		});
		return allStatements;
	}
}
module.exports = Module;
