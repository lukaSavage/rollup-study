# rollup-study

## 一、背景介绍

- webpack打包非常繁琐，打包体积比较大
- rollup主要是用来打包JS库的
- vue/react/angular都在用rollup作为打包工具

## 二、安装插件

```bash
cnpm i @babel/core @babel/preset-env  @rollup/plugin-commonjs @rollup/plugin-node-resolve @rollup/plugin-typescript lodash rollup rollup-plugin-babel postcss rollup-plugin-postcss rollup-plugin-terser tslib typescript rollup-plugin-serve rollup-plugin-livereload -D
```

## 三、rollup初体验

### 3.1 创建rollup.config.js文件

> 配置文件是一个ES6模块，它对外暴露一个对象，这个对象包含了一些Rollup需要的一些选项。通常，我们把这个配置文件叫做`rollup.config.js`，它通常位于项目的根目录,下面是一些配置选项

#### 3.1.1 基本配置

1. 首先，我们在根目录下创建`rollup.config.js`文件，配置如下

   ```js
   export default {
       input: 'src/main.js',
       output: {
           file: 'dist/bundle.cjs.js', // 输出的文件路径和文件名
           format: 'cjs', // 输出的格式， amd es iife umd cjs system
       }
   }
   ```

2. 接着我们在根目录下创建一个src文件夹，里面放置main.js文件，如下↓↓↓

   ```js
   console.log('aaa')
   ```

   

3. 更改package.json文件脚本

   ```json
   {
       "script"： {
       "build": "rollup --config"
   }
   ```

#### 3.1.2 rollup的基本配置选项（了解）

```js
// rollup.config.js
export default {
  	// 核心选项
  	input,     // 必须
  	external,
  	plugins,

  	// 额外选项
  	onwarn,

  	// danger zone
  	acorn,
  	context,
  	moduleContext,
  	legacy

  	output: {  // 必须 (如果要输出多个，可以是一个数组)
    	// 核心选项
    	file,    // 必须
    	format,  // 必须
    	name, // 当format是‘iife’的时候，name值必须提供
    	globals,

    	// 额外选项
    	paths,
    	banner,
    	footer,
    	intro,
    	outro,
    	sourcemap,
    	sourcemapFile,
    	interop,

    	// 高危选项
    	exports,
    	amd,
    	indent
    	strict
  	},
};

```

