/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2022-06-05 16:56:49
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-06-06 20:58:45
 * @FilePath: \rollup-study\rollup-demo\ast\analyse.js
 */

function analyse(ast, magicStringOfAst, module) {
	ast.body.forEach(statement => { // body下面的顶级节点
		Object.defineProperties(statement, {
			// key是_source, 值是这个语法树节点在源码中的源代码
			// start指的是此节点在源代码中的起始索引,end就是结束索引
			// magicString.snip返回的还是magicString 实例clone
			_source: {
				value: magicStringOfAst.snip(statement.start, statement.end),
			},
		});
	});
}
module.exports = analyse;
