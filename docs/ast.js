/*
 * @Descripttion: acorn演示
 * @Author: lukasavage
 * @Date: 2022-06-05 14:41:05
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-06-05 15:10:21
 * @FilePath: \rollup-study\docs\ast.js
 */
const acorn = require('acorn');
const sourceCode = 'import $ from "jquery"';
const ast = acorn.parse(sourceCode, {
	locations: true,             // 是否显示位置
	ranges: true,                // 是否显示范围
	sourceType: 'module',        // 模块类型
	ecmaVersion: 8,              // ecma版本号
});
console.log(ast);
let indent = 0;
const padding = () => ' '.repeat(indent);
console.log(padding());
// ast.body.forEach(statement => {
// 	walk(statement, {
// 		enter(node) {
// 			if (node.type) {
// 				console.log(padding() + node.type + '进入');
// 				indent += 2;
// 			}
// 		},
// 		leave(node) {
// 			if (node.type) {
// 				indent -= 2;
// 				console.log(padding() + node.type + '离开');
// 			}
// 		},
// 	});
// });
