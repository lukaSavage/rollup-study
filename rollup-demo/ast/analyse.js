/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2022-06-05 16:56:49
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-06-05 17:03:05
 * @FilePath: \rollup-study\rollup-demo\ast\analyse.js
 */

function analyse(ast, magicStringOfAst, module) {
	ast.body.forEach(statement => {
		Object.defineProperties(statement, {
			// key是_source, 值是这个语法树节点在源码中的源代码
			_source: {
				value: magicStringOfAst.snip(statement.start, statement.end),
			},
		});
	});
}
module.exports = analyse;
