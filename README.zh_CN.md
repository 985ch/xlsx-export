# xlsx-export-9

![node version][node-image]
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![npm download][download-image]][download-url]

[node-image]: https://img.shields.io/badge/node-%3E%3D8-blue.svg
[npm-image]: https://img.shields.io/npm/v/xlsx-export-9.svg?style=flat-square
[npm-url]: https://npmjs.org/package/xlsx-export-9
[travis-image]: https://img.shields.io/travis/985ch/xlsx-export.svg?style=flat-square
[travis-url]: https://travis-ci.org/985ch/xlsx-export
[david-image]: https://img.shields.io/david/985ch/xlsx-export.svg?style=flat-square
[david-url]: https://david-dm.org/985ch/xlsx-export
[download-image]: https://img.shields.io/npm/dm/xlsx-export-9.svg?style=flat-square
[download-url]: https://npmjs.org/package/xlsx-export-9

一个Node.js库，用于导出大量数据到xlsx文件，支持分页读取数据以及多种数据拆分方式，基于[node-xlsx](https://github.com/mgcrea/node-xlsx)实现。

## 安装

```bash
$ npm i xlsx-export-9 --save
```

## 使用方法
```js
'use strict';

const xlsxExport = require('xlsx-export-9');

const raws = [{ name: '某某', sex: '男', job: '码农' }];

const options = {
  tableLimit: 10000,
  readLimit: 1000,
  headers: [ '姓名', '性别', '职业' ],
  splitType: 'file',
  fileName: 'sample',
};
xlsxExport(async (offset, limit) => {
  const datas = [];
  const min = Math.min(offset + limit, raws.length);
  for (let i = offset; i < min; i++) {
    const raw = raws[i];
    datas.push([ raw.name, raw.sex, raw.job ]);
  }
  return datas;
}, options);
```
在[test.js](./test.js)中可以看到更多用法

## xlsxExport(getData, options)
* getData是一个异步方法，接受offset和limit两个参数，返回一个二维数组
* options是一个对象，决定如何导出数据到文件
* 返回一个Promise对象

## 选项说明

| 选项 | 默认值 | 含义 |
|:----|:-----|:----|
| offset | 0 | 初始数据偏移量 |
| count | 0 | 最大读取数量，为0时表示一直读完为止 |
| tableLimit | 50000 | 单个表行数限制 |
| readLimit | 1000 | 单次获取数据条数 |
| headers | null | 表头，可以为字符串数组或null |
| splitType | 'file' | 拆分方式，'file'为按文件拆分，'sheet'为按表拆分 |
| splitName | (name, index) => name + '_' + index | 一个方法，用于计算表或文件拆分后的名字 |
| sheetName | 'Sheet' | 表名 |
| fileName | 'Export' | 文件名 |
| output | async (file, buffer) => await fs.writeFile(file + '.xlsx', buffer) | 导出函数 |
| enableEmptyFile | false | 是否允许空文件，若不允许，则数据为空时不会生成xlsx文件 |

## 测试

```sh
npm test
```

## License

[MIT](LICENSE)<br />
