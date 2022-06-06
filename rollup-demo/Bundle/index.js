/*
 * @Descripttion: rollup的打包暴露出的方法
 * @Author: lukasavage
 * @Date: 2022-06-05 16:03:53
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-06-06 20:45:38
 * @FilePath: \rollup-study\rollup-demo\Bundle\index.js
 */

const { default: MagicString } = require('magic-string');
const path = require('path');
const fs = require('fs');

const Module = require('../Module');

class Bundle {
	constructor({ entry }) {
		// 可能传过来的是相对路径，统一转成绝对路径
		this.entryPath = path.resolve(entry);
		// 存放着本次打包的所有模块
		this.modules = {};
	}

	// 负责编译入口文件，然后把结果写入outputFile
	build(outputFile) {
		// 1.先获取模块
		const entryModule = (this.entryModule = this.fetchModule(
			this.entryPath
		));
		// 2.把这个入口模块所有的语句进行展开，返回所有的语句组成的数组(展开的意思是：将import、require('xxx')获取到的变量放入到当前文件中，并同时删除import、require)
		this.statements = entryModule.expandAllStatement();
		const code = this.generate();
		fs.writeFileSync(outputFile, code);
	}

	/**
	 * 根据模块的绝对路径返回模块的实例
	 * @param {string} entryPath 模块的绝对路径
	 */
	fetchModule(entryPath) {
		const route = entryPath;
		if (route) {
			const code = fs.readFileSync(route, 'utf8');
			const module = new Module({
				code,         // 要打包的源文件代码
				path: route,  // 文件路径
				bundle: this, // 属于哪一个Bundle
			});
			return module;
		}
	}

	generate() {
		// 生成字符串包
		const bundleString = new MagicString.Bundle();
		// this.statements只有入口模块里所有的顶层节点
		this.statements.forEach(statement => {
			const content = statement._source.clone();
			bundleString.addSource({
				content,
				separator: '\n',
			});
		});
		return bundleString.toString();
	}
}
module.exports = Bundle;

// 该模块有点类似于webpack中的Compile
