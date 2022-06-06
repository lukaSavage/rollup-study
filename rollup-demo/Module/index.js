/*
 * @Descripttion: 模块文件信息的汇总，包括code、path、bundle、ast等
 * @Author: lukasavage
 * @Date: 2022-06-05 16:21:20
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-06-06 20:33:39
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
