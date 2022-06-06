/*
 * @Descripttion: 自定义rollup的入口文件
 * @Author: lukasavage
 * @Date: 2022-06-06 09:24:45
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-06-06 20:44:47
 * @FilePath: \rollup-study\rollup-demo\rollup.js
 */
const Bundle = require('./Bundle');

/**
 * rollup打包方法，核心原理是：先通过acorn编译拿到ast语法树，通过fs.writeFileSync方法写出文件
 * @param {string} entry 打包路径
 * @param {string} outputFile 要打包后的文件名
 */
function rollup(entry, outputFile) {
    // 打包文件的实例bundle,包含打包文件的所有信息
	const bundle = new Bundle({ entry });
	bundle.build(outputFile);
}

module.exports = rollup;
