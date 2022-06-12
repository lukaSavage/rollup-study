/*
 * @Descripttion: 模块文件信息的汇总，包括code、path、bundle、ast等
 * @Author: lukasavage
 * @Date: 2022-06-05 16:21:20
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-06-10 21:35:43
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
		this.imports = {}; // 存放着当前模块所有的导入
		this.exports = {}; // 存放着当前模块所有的导出
		this.analyse();
	}
	analyse() {
		this.ast.body.forEach(statement => {
			if (statement.type === 'ImportDeclaration') {
				// 如果是导入语句
				const source = statement.source.value; // ./msg  代表从哪个模块来的
				statement.specifiers.forEach(specifier => {
					const importName = specifier.imported.name; // name
					const localName = specifier.local.name; // a
					// 将上面拿到的本地名、来源、来源名统一记录到this.imports中
					this.imports[localName] = { localName, source, importName };
				});
			} else if (statement.type === 'ExportNamedDeclaration') {
				const declaration = statement.declaration;
				if (declaration.type === 'VariableDeclaration') {
					const declarations = declaration.declarations;
					this.exports[localName] = {
						localName,
						exportName: localName,
						expression: declaration,
					};
				}
			}
		});
		// 1.给import和export赋值
		analyse(this.ast, this.code, this);
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
