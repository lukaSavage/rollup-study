/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2022-06-05 16:56:49
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-06-10 22:19:16
 * @FilePath: \rollup-study\rollup-demo\ast\analyse.js
 */
const Scope = require('./scope');
const walk = require('./walk');
function analyse(ast, magicStringOfAst, module) {
	// 在遍历之前创建作用域对象
	const scope = new Scope();
	function addToScope(name) {
		const name = variableDeclarator.id.name; // type
		scope.add(name);
		//如果说当前的作用域没有父亲 了，说明它是顶级作用域，说明name是顶级作用域中定义的变量 类似模块内的全局变量
		if (!scope.parent || scope.isBlockScope) {
			//此语句上定义了哪些变量
			statement._defines[name] = true;
		}
	}

	ast.body.forEach(statement => {
		// body下面的顶级节点
		Object.defineProperties(statement, {
			// key是_source, 值是这个语法树节点在源码中的源代码
			// start指的是此节点在源代码中的起始索引,end就是结束索引
			// magicString.snip返回的还是magicString 实例clone
			_source: {
				value: magicStringOfAst.snip(statement.start, statement.end),
			},
			_defines: { value: {} }, // 当前statement语法树节点声明了哪些变量
			_dependsOn: { value: {} }, // 当前statement语句外部依赖的变量
			_included: { value: false, writable: true }, // 当前的语句是否放置在结果中，是否会出现在打包结果中
		});
	});
	/**
	 * 如何知道某个变量有没有在当期那模块内定义的呢？
	 * 原理：扫描真个模块，找到所有的定义的变量
	 */
	walk(statement, ast.body, {
		enter(node) {
			let newScope;
			switch (node.type) {
				case 'FunctionDeclaration': // 如果节点的类型是一个函数声明的话
					// 函数的参数将会成为此函数子作用域内的局部变量
					const names = node.params.map(i => i.name);
					// 函数本身也是一个变量
					addToScope(node);
					// 如果遇到函数声明，就会产生一个新作用域
					newScope = new Scope({
						parent: scope,
						params: names,
					});
					break;
				case 'VariableDeclaration': // 如果节点的类型是一个函数声明的话
					node.declaration.forEach(addToScope);
					break;

				default:
					break;
			}
			if (newScope) {
				// 如果创建一个新的作用域，那么这个作用域将会成为新的当前作用域
				Object.defineProperty(node, '_scope', { value: newScope });
				scope = newScope; // say这个函数域
			}
		},
		leave(node) {
            // 当离开节点的时候，如果发现这个节点创建新的作用域，就回退到使用域
            if(Object.hasOwnProperty(node, '_scope')) {
                scope = scope.parent;
            }
        },
	});
}
module.exports = analyse;
