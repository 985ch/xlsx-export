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

A Node.js library for exporting large amounts of data to xlsx files, supporting page reading and different data splitting methods, based on [node-xlsx](https://github.com/mgcrea/node-xlsx).

## Install

```bash
$ npm i xlsx-export-9 --save
```

## Usage
```js
'use strict';

const xlsxExport = require('xlsx-export-9');

const raws = [{ name: 'xxx', sex: 'male', job: 'programer' }];

const options = {
  tableLimit: 10000,
  readLimit: 1000,
  headers: [ 'name', 'sex', 'job' ],
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
More usage can be found in [test.js](./test.js)

## xlsxExport(getData, options)
* /*getData*/ is an asynchronous function that accepts two parameters, offset and limit, and returns a two-dimensional array
* /*options*/ is an object that determines how to export data to a file
* Return a Promise object

## 选项说明

| 选项 | 默认值 | 含义 |
|:----|:-----|:----|
| offset | 0 | Initial offset |
| count | 0 | Maximum data acquisition amount, when it is 0, it means that the acquisition is complete |
| tableLimit | 50000 | Maximum number of rows in a single sheet |
| readLimit | 1000 | Number of data obtained at a time |
| headers | null | The header, which can be a string array or null |
| splitType | 'file' | Split mode,'file' means split by file,'sheet' means split by sheet |
| splitName | (name, index) => name + '_' + index | Function to calculate the name of a table or file after splitting |
| sheetName | 'Sheet' | Sheet name |
| fileName | 'Export' | File name |
| output | async (file, buffer) => await fs.writeFile(file + '.xlsx', buffer) | Output function |
| enableEmptyFile | false | Whether to allow empty files, if not, the xlsx file will not be generated when the data is empty |


## Unit tests

```sh
npm test
```

## License

[MIT](LICENSE)<br />
This README was translate by [google](https://translate.google.cn)
