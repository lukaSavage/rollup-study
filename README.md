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

# rollup源码实现前置知识

## 一、前景说明

​	rollup 使用了 `acorn` 和 `magic-string` 两个库。为了更好的阅读 rollup 源码，必须对它们有所了解。

## 二、安装

```bash
cnpm install magic-string acorn --save
```

## 三、magic-string

> [magic-string](https://www.npmjs.com/package/magic-string)是一个操作字符串和生成source-map的工具。`magic-string` 是 rollup 作者写的一个关于字符串操作的库。以下是代码demo↓↓↓

```js
var MagicString = require('magic-string');
var magicString = new MagicString('export var name = "beijing"');
//类似于截取字符串
console.log(magicString.snip(0,6).toString()); // export
//从开始到结束删除字符串(索引永远是基于原始的字符串，而非改变后的)
console.log(magicString.remove(0,7).toString()); // var name = "beijing"

//很多模块，把它们打包在一个文件里，需要把很多文件的源代码合并在一起
let bundleString = new MagicString.Bundle();
bundleString.addSource({
    content:'var a = 1;',
    separator:'\n'
});
bundleString.addSource({
    content:'var b = 2;',
    separator:'\n'
});
/* let str = '';
str += 'var a = 1;\n'
str += 'var b = 2;\n'
console.log(str); */
console.log(bundleString.toString());
// var a = 1;
//var b = 2;
```

## 四、AST语法树

- 介绍

  - 抽象语法树（Abstract Syntax Tree，AST）是源代码语法结构的一种抽象表示
  - 它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构

- 用途

  - 代码语法的检查、代码风格的检查、代码的格式化、代码的高亮、代码错误提示、代码自动补全等等
  - 优化变更代码，改变代码结构使达到想要的结构

- 定义

  - 这些工具的原理都是通过`JavaScript Parser`把代码转化为一颗抽象语法树（AST），这颗树定义了代码的结构，通过操纵这颗树，我们可以精准的定位到声明语句、赋值语句、运算语句等等，实现对代码的分析、优化、变更等操作

  ![](E:\rollup-study\img\01.jpg)

- AST工作流

  - Parse(解析) 将源代码转换成抽象语法树，树上有很多的estree节点
  - Transform(转换) 对抽象语法树进行转换
  - Generate(代码生成) 将上一步经过转换过的抽象语法树生成新的代码

![](E:\rollup-study\img\02.png)



## 五、acorn

> acorn的作用比较单一，只负责把源代码变成AST语法树这一件事情。

- [astexplorer](https://astexplorer.net/)可以把代码转成语法树

- acorn 解析结果符合The Estree Spec规范

- 拓展内容

  ```js
  esprima           转AST
  estraverse        AST遍历和转换
  escodegen         代码生成
  
  @babel/parser     转AST
  @babel/traverse   AST遍历
  @babel/generator  代码生成
  ```

- acorn的使用

  这里我们以`import $ from 'jquery'`为例进行分析，代码如下

  ```js
  const acorn = require('acorn');
  const sourceCode = 'import $ from "jquery"';
  const ast = acorn.parse(sourceCode, {
  	locations: true,             // 是否显示位置
  	ranges: true,                // 是否显示范围
  	sourceType: 'module',        // 模块类型
  	ecmaVersion: 8,              // ecma版本号
  });
  console.log(ast);
  ```

  这时，我们拿到的`ast`的值为：

  ```js
  {
    type: 'Program',
    start: 0,
    end: 22,
    loc: SourceLocation {
      start: Position { line: 1, column: 0 },
      end: Position { line: 1, column: 22 }
    },
    range: [ 0, 22 ],
    body: [
      Node {
        type: 'ImportDeclaration',
        start: 0,
        end: 22,
        loc: [SourceLocation],
        range: [Array],
        specifiers: [Array],  // 导入标识符
        source: [Node]
      }
    ],
    sourceType: 'module'
  }
  ```

  可以看到这个 AST 的类型为 program，表明这是一个程序。body 则包含了这个程序下面所有语句对应的 AST 子节点。

  每个节点都有一个 type 类型，例如 Identifier，说明这个节点是一个标识符；

  如果想了解更多详情 AST 节点的信息可以看一下这篇文章[《使用 Acorn 来解析 JavaScript》](https://juejin.cn/post/6844903450287800327)。

  ![](E:\rollup-study\img\03.jpg)

## 六、rollup打包分析

	在 rollup 中，一个文件就是一个模块。每一个模块都会根据文件的代码生成一个 AST 语法抽象树，rollup 需要对每一个 AST 节点进行分析。分析 AST 节点，就是看看这个节点有没有调用函数或方法。如果有，就查看所调用的函数或方法是否在当前作用域，如果不在就往上找，直到找到模块顶级作用域为止。如果本模块都没找到，说明这个函数、方法依赖于其他模块，需要从其他模块引入。
# 简易版rollup源码实现

## 一、安装依赖

```bash
cnpm install magic-string acorn --save
```

## 二、文件目录

```
├── package.json
├── README.md
├── src
    ├── ast
    │   ├── analyse.js //分析AST节点的作用域和依赖项
    │   ├── Scope.js //有些语句会创建新的作用域实例
    │   └── walk.js //提供了递归遍历AST语法树的功能
    ├── Bundle//打包工具，在打包的时候会生成一个Bundle实例，并收集其它模块，最后把所有代码打包在一起输出
    │   └── index.js 
    ├── Module//每个文件都是一个模块
    │   └── index.js
    ├── rollup.js //打包的入口模块
    └── utils
        ├── map-helpers.js
        ├── object.js
        └── promise.js
```

## 三、rollup流程以及各个文件分析

### 3.1 debugger.js文件

​	此文件使我们在运行自定义rollup的执行文件，它做的事情很简单，就是调用一个rollup方法，进行文件打包

```js
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
```

### 3.1.1 demo.js

​	此文件是用户写的js文件，也是我们需要打包的文件

```js
console.log('hello');
console.log('rollup');
```

### 3.1.2 rollup.js

​	此文件使我们自己实现rollup的入口文件

```js
/*
 * @Descripttion: 自定义rollup的入口文件
 * @Author: lukasavage
 * @Date: 2022-06-06 09:24:45
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-06-06 09:30:59
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
```

### 3.1.3 bundle.js

​	此文件是实现rollup的核心包，包括读写操作文件、生成字符串包等功能

```js
/*
 * @Descripttion: rollup的打包暴露出的方法
 * @Author: lukasavage
 * @Date: 2022-06-05 16:03:53
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-06-06 09:36:26
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
		// 2.将代码展开(展开的意思是：将import、require('xxx')获取到的变量放入到当前文件中，并同时删除import、require)
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
				code,
				path: route,
				bundle: this,
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
```

### 3.1.4 module.js

​	模块文件信息的汇总，包括code、path、bundle、ast等

```js
/*
 * @Descripttion: 模块文件信息的汇总，包括code、path、bundle、ast等
 * @Author: lukasavage
 * @Date: 2022-06-05 16:21:20
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-06-06 20:33:39
 * @FilePath: \rollup-study\rollup-demo\Module\index.js
 */
const { default: MagicString } = require('magic-string');
const { parse } = require('acorn');

const analyse = require('../ast/analyse');

class Module {
	constructor({ code, path, bundle }) {
		this.code = new MagicString(code, { filename: path });
		this.path = path;
		this.bundle = bundle;
		this.ast = parse(code, {
			ecmaVersion: 8,
			sourceType: 'module',
		});
		analyse(this.ast, this.code, this );
	}
	// 展开代码的方法
	expandAllStatement() {
		const allStatements = [];
		this.ast.body.forEach(statement => {
			// todo: 我们可能要把statement进行拓展，有可能一行变成多行var name = '张三'; console.log('name');
			allStatements.push(statement);
		});
		return allStatements;
	}
}
module.exports = Module;

```

### 3.1.5 ast/analysis.js

​	通过`acorn`编译语法树，再给语法树的*statement*添加_source属性返回

```js
/*
 * @Descripttion:
 * @Author: lukasavage
 * @Date: 2022-06-05 16:56:49
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-06-05 17:03:05
 * @FilePath: \rollup-study\rollup-demo\ast\analyse.js
 */

function analyse(ast, magicStringOfAst, module) {
	ast.body.forEach(statement => {
		Object.defineProperties(statement, {
			// key是_source, 值是这个语法树节点在源码中的源代码
             //start指的是此节点在源代码中的起始索引,end就是结束索引
      		//magicString.snip返回的还是magicString 实例clone
			_source: {
				value: magicStringOfAst.snip(statement.start, statement.end),
			},
		});
	});
}
module.exports = analyse;
```

### 3.1.6 总结

Bundle的实例在build的时候，会从入口出发，每一个文件会生成一个module实例，包含模块的源代码，模块的路径，模块的抽象语法树ast，然后将语法树语句进行展开，返回所有的语句组成的数组，最后调用generate生成最终的代码。

### 3.1.7 原理图总结

![](E:\vite-demo\img\12.png)

# tree-shaking的实现原理

​	我们知道，在rollup通过build方法打包的时候，实际上会调用Bundle实例上的build方法，在build方法里面会去分析语法树，tree shaking的原理正是分析了语法树里面的导入、导出变量才实现的。

## 一、ast导入和导出的解析

### 1.1 导入与导出的实现

#### 1.1.1 导入语句

首先我们打开`https://astexplorer.net/`网址来分析下的ast树长什么样

```js
import { name as a } from './msg'
```

对应的ast如下↓

![](E:\vite-demo\img\13.png)

#### 1.1.2 导出语句

```js
export const name = '张三'
```

对应的ast如下↓

![](E:\vite-demo\img\14.png)

#### 1.1.3完整代码如下

> 以下代码的主要作用：收集imports、exports

```js
/*
 * @Descripttion: 模块文件信息的汇总，包括code、path、bundle、ast等
 * @Author: lukasavage
 * @Date: 2022-06-05 16:21:20
 * @LastEditors: lukasavage
 * @LastEditTime: 2022-06-10 21:35:43
 * @FilePath: \rollup-study\rollup-demo\Module\index.js
 */
const { default: MagicString } = require('magic-string');
const { parse } = require('acorn');

const analyse = require('../ast/analyse');

class Module {
	constructor({ code, path, bundle }) {
		this.code = new MagicString(code, { filename: path });
		this.path = path;
		this.bundle = bundle;
		this.ast = parse(code, {
			ecmaVersion: 8,
			sourceType: 'module',
		});
		this.imports = {}; // 存放着当前模块所有的导入
		this.exports = {}; // 存放着当前模块所有的导出
		this.analyse();
	}
	analyse() {
		this.ast.body.forEach(statement => {
			if (statement.type === 'ImportDeclaration') {
				// 如果是导入语句
				const source = statement.source.value; // ./msg  代表从哪个模块来的
				statement.specifiers.forEach(specifier => {
					const importName = specifier.imported.name; // name
					const localName = specifier.local.name; // a
					// 将上面拿到的本地名、来源、来源名统一记录到this.imports中
					this.imports[localName] = { localName, source, importName };
				});
			} else if (statement.type === 'ExportNamedDeclaration') {
				const declaration = statement.declaration;
				if (declaration.type === 'VariableDeclaration') {
					const declarations = declaration.declarations;
					this.exports[localName] = {
						localName,
						exportName: localName,
						expression: declaration,
					};
				}
			}
		});
		// 1.给import和export赋值
		analyse(this.ast, this.code, this);
	}
	// 展开代码的方法
	expandAllStatement() {
		const allStatements = [];
		this.ast.body.forEach(statement => {
			// todo: 我们可能要把statement进行拓展，有可能一行变成多行var name = '张三'; console.log('name');
			allStatements.push(statement);
		});
		return allStatements;
	}
}
module.exports = Module;
```

#### 1.1.4 挂载imports、exports

​	当我们收集到imports、exports之后，我们需要把它们挂载上去了
