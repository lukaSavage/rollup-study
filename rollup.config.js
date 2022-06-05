/*
 * @Descripttion: rollup的入口文件
 * @Author: lukasavage
 * @Date: 2022-06-02 21:16:51
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-06-04 10:09:28
 * @FilePath: \rollup-study\rollup.config.js
 */
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import serve from 'rollup-plugin-serve';
export default {
	input: 'src/main.ts',
	output: {
		file: 'dist/bundle.cjs.js', //输出文件的路径和名称
		format: 'iife', //五种输出格式：amd/es6/iife/umd/cjs
		name: 'bundleName', //当format为iife和umd时必须提供，将作为全局变量挂在window下
		globals: {
			lodash: '_', //告诉rollup全局变量_即是lodash
			jquery: '$', //告诉rollup全局变量$即是jquery
		},
	},
	plugins: [
		babel({
			exclude: 'node_modules/**',
		}),
		resolve(),
		commonjs(),
		typescript(),
		terser(),
		serve({
			open: true,
			port: 8080,
			contentBase: './dist',
		}),
	],
	external: ['lodash', 'jquery'],
};
