/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2022-06-10 21:50:50
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-06-10 21:52:32
 * @FilePath: \rollup-study\rollup-demo\ast\walk.js
 */
function walk(astNode, { enter, leave }) {
	visit(astNode, null, enter, leave);
}
function visit(node, parent, enter, leave) {
	if (enter) {
		enter.call(null, node, parent);
	}
	let keys = Object.keys(node).filter(key => typeof node[key] === 'object');
	keys.forEach(key => {
		let value = node[key];
		if (Array.isArray(value)) {
			value.forEach(val => visit(val, node, enter, leave));
		} else if (value && value.type) {
			visit(value, node, enter, leave);
		}
	});
	if (leave) {
		leave.call(null, node, parent);
	}
}
module.exports = walk;
