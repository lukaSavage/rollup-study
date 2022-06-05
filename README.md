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

##  四、支持babel

- 为了使用新的语法，可以使用babel来进行编译输出

### 4.1 安装依赖

- @babel/core是babel的核心包
- @babel/preset-env是预设
- @rollup/plugin-babel是babel插件

```bash
cnpm install @rollup/plugin-babel @babel/core @babel/preset-env --save-dev
```

###  4.2 配置rollup.config.js

```js
import babel from 'rollup-plugin-babel'

export default {
	input: 'src/main.js',
	output: {
		file: 'dist/bundle.cjs.js', // 输出的文件路径和文件名
		format: 'cjs',
	},
    plugins: [
        babel({
            exclude: "node_modules/**"
        })
    ]
};

```

### 4.3 新建`.babelrc`文件

```json
{
    "presets": [
       [
        "@babel/env",
        {
            "modules":false  // 不要帮忙转换es module写法
        }
       ]
    ]
}
```

## 五、tree-shaking

> rollup默认支持tree-shaking,会把无用的代码给删除掉

- Tree-shaking的本质是消除无用的js代码
- rollup只处理函数和顶层的import/export变量

## 六、使用第三方模块

> rollup.js编译源码中的模块引用默认只支持 ES6+的模块方式`import/export`

### 6.1 安装依赖

```bash
cnpm install @rollup/plugin-node-resolve @rollup/plugin-commonjs lodash  --save-dev
```

#### 6.1.1 在main.js中编写如下代码

```js
import _ from 'lodash';
console.log(_);
```

#### 6.1.2 rollup.config.js

```js
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
export default {
    input:'src/main.js',
    output:{
        file:'dist/bundle.cjs.js',//输出文件的路径和名称
        format:'cjs',//五种输出格式：amd/es6/iife/umd/cjs
        name:'bundleName'//当format为iife和umd时必须提供，将作为全局变量挂在window下
    },
    plugins:[
        babel({
            exclude:"node_modules/**"
        }),
        resolve(),
        commonjs()
    ]
}
```

## 七、rollup中使用CDN

### 7.1.1 dist/index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>rollup</title>
</head>
<body>
    <script src="https://cdn.jsdelivr.net/npm/lodash/lodash.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jquery/jquery.min.js"></script>
    <script src="bundle.cjs.js"></script>
</body>
</html>
```

### 7.1.2 rollup.config.js

```js
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
export default {
    input:'src/main.js',
    output:{
        file:'dist/bundle.cjs.js',//输出文件的路径和名称
+       format:'iife',//五种输出格式：amd/es6/iife/umd/cjs
+       name:'bundleName',//当format为iife和umd时必须提供，将作为全局变量挂在window下
+       globals:{
+           lodash:'_', //告诉rollup全局变量_即是lodash
+           jquery:'$' //告诉rollup全局变量$即是jquery
+       }
    },
    plugins:[
        babel({
            exclude:"node_modules/**"
        }),
        resolve(),
        commonjs()
    ],
+   external:['lodash','jquery']
}
```

## 八、rollup支持typescript

### 8.1 安装依赖包

```bash
cnpm install tslib typescript @rollup/plugin-typescript --save-dev
```

### 8.2 将`main.js`改名为`main.ts`

```tsx
let myName:string = 'zhufeng';
let age:number=12;
console.log(myName,age);
```

### 8.3 配置rollup.config.js

```js
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
export default {
    input:'src/main.ts',
    output:{
        file:'dist/bundle.cjs.js',//输出文件的路径和名称
        format:'iife',//五种输出格式：amd/es6/iife/umd/cjs
        name:'bundleName',//当format为iife和umd时必须提供，将作为全局变量挂在window下
        globals:{
            lodash:'_', //告诉rollup全局变量_即是lodash
            jquery:'$' //告诉rollup全局变量$即是jquery
        }
    },
    plugins:[
        babel({
            exclude:"node_modules/**"
        }),
        resolve(),
        commonjs(),
        typescript()
    ],
    external:['lodash','jquery']
}
```

### 8.4 新建ts.config.json文件

```json
{
  "compilerOptions": {  
    "target": "es5",                          
    "module": "ESNext",                     
    "strict": true,                         
    "skipLibCheck": true,                    
    "forceConsistentCasingInFileNames": true 
  }
}
```

## 九、压缩JS

> 通常我们压缩js使用的是terser，terser是支持ES6 +的JavaScript压缩器工具包

### 9.1 安装

```bash
cnpm install rollup-plugin-terser --save-dev
```

### 9.2 配置rollup.config.js

```js
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import {terser} from 'rollup-plugin-terser';
export default {
    input:'src/main.ts',
    output:{
        file:'dist/bundle.cjs.js',//输出文件的路径和名称
        format:'iife',//五种输出格式：amd/es6/iife/umd/cjs
        name:'bundleName',//当format为iife和umd时必须提供，将作为全局变量挂在window下
        globals:{
            lodash:'_', //告诉rollup全局变量_即是lodash
            jquery:'$' //告诉rollup全局变量$即是jquery
        }
    },
    plugins:[
        babel({
            exclude:"node_modules/**"
        }),
        resolve(),
        commonjs(),
        typescript(),
        terser()
    ],
    external:['lodash','jquery']
}
```

## 十、编译CSS

### 10.1 安装

```bash
cnpm install  postcss rollup-plugin-postcss --save-dev
```

### 10.2 rollup.config.js

```js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import {terser} from 'rollup-plugin-terser';
+import postcss from 'rollup-plugin-postcss';
export default {
    input:'src/main.js',
    output:{
        file:'dist/bundle.cjs.js',//输出文件的路径和名称
        format:'iife',//五种输出格式：amd/es6/iife/umd/cjs
        name:'bundleName',//当format为iife和umd时必须提供，将作为全局变量挂在window下
        globals:{
            lodash:'_', //告诉rollup全局变量_即是lodash
            jquery:'$' //告诉rollup全局变量$即是jquery
        }
    },
    plugins:[
        babel({
            exclude:"node_modules/**"
        }),
        resolve(),
        commonjs(),
        typescript(),
        //terser(),
+       postcss()
    ],
    external:['lodash','jquery']
}
```

## 十一、开启本地服务器

### 11.1 安装

```bash
cnpm install rollup-plugin-serve --save-dev
```

### 11.2 配置rollup.config.js

```js
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
+import serve from 'rollup-plugin-serve';
export default {
    input:'src/main.js',
    output:{
        file:'dist/bundle.cjs.js',//输出文件的路径和名称
        format:'iife',//五种输出格式：amd/es6/iife/umd/cjs
        name:'bundleName',//当format为iife和umd时必须提供，将作为全局变量挂在window下
        sourcemap:true,
        globals:{
            lodash:'_', //告诉rollup全局变量_即是lodash
            jquery:'$' //告诉rollup全局变量$即是jquery
        }
    },
    plugins:[
        babel({
            exclude:"node_modules/**"
        }),
        resolve(),
        commonjs(),
        typescript(),
        postcss(),
+       serve({
+           open:true,
+           port:8080,
+           contentBase:'./dist'
+       })
    ],
    external:['lodash','jquery']
}
```

### 11.3 配置package.json文件

```json
{
  "scripts": {
    "build": "rollup --config rollup.config.build.js",
    "dev": "rollup --config rollup.config.dev.js -w"
  },
}
```

