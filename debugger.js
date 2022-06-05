/*
 * @Descripttion: 自定义rollup执行文件
 * @Author: lukasavage
 * @Date: 2022-06-05 16:09:43
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-06-05 17:47:50
 * @FilePath: \rollup-study\debugger.js
 */
const rollup = require('./rollup-demo/rollup');

// 执行打包，并且把打包后的结果写入bundle.js中
rollup('./src/demo.js', 'bundle.js');
