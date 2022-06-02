/*
 * @Descripttion: rollup的入口文件
 * @Author: lukasavage
 * @Date: 2022-06-02 21:16:51
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-06-02 21:18:03
 * @FilePath: \rollup-study\rollup.config.js
 */
export default {
	input: 'src/main.js',
	output: {
		file: 'dist/bundle.cjs.js', // 输出的文件路径和文件名
		format: 'cjs',
	},
};
