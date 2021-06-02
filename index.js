'use strict';

const fs = require('fs').promises;
const _ = require('lodash');
const xlsx = require('node-xlsx');

// 默认选项
const defaultOptions = {
  offset: 0, // 读取偏移量
  count: 0, // 最大读取数量，为0时表示不限制
  tableLimit: 50000, // 单个表格行数限制
  readLimit: 1000, // 单次获取数据条数
  headers: null, // 文件头
  splitType: 'file', // 拆分方式，支持'file'和'sheet'
  splitName: (name, index) => name + '_' + index, // 表或者文件拆分后的名字
  sheetName: 'Sheet', // 表格名
  fileName: 'Export', // 文件名
  output: async (file, buffer) => await fs.writeFile(file + '.xlsx', buffer), // 导出函数
  enableEmptyFile: false, // 是否允许空文件
};

// 导出方法
async function xlsxExport(getData, options) {
  const opt = _.extend({}, defaultOptions, options);

  let offset = opt.offset || 0; // 读取偏移量
  let tableIdx = 0; // 表格索引
  let left = opt.count || -1; // 剩余数据总数，为-1表示未知
  let sheets = []; // 数据表数组

  while (left !== 0) {
    const { sheet, count } = await buildTable(getData, opt, offset, left);
    offset += count;

    // 根据拆分类型分别进行操作
    if (count > 0) {
      sheets = await updateSheets(sheets, sheet, tableIdx, opt);
      tableIdx++;
    }

    // 根据数量限制决定是否跳出
    if (left !== -1) {
      left -= count;
    } else if (count === 0) {
      left = 0;
    }
  }

  await completeExport(sheets, tableIdx, opt);
}

// 构造数据表
async function buildTable(getData, options, offset, left) {
  const { tableLimit, headers, sheetName } = options;

  let count = (left >= 0 && left < tableLimit) ? left : tableLimit; // 需要读取的数据量
  let datas = [];
  while (count > 0) {
    const limit = Math.min(count, options.readLimit);
    const data = await getData(offset, limit);

    if (data.length === 0) break; // 读不到数据之后提前返回

    count -= data.length;
    offset += data.length;
    datas = _.concat(datas, data);
  }

  // 补充表头
  if (headers) {
    datas.unshift(headers);
  }

  return {
    sheet: {
      name: sheetName,
      data: datas,
    },
    count: datas.length - (headers ? 1 : 0),
  };
}

// 输出xlsx数据
async function outputData(sheets, fileIdx, options) {
  const { splitName, fileName, output } = options;
  const buffer = xlsx.build(sheets);
  const file = fileIdx > 0 ? splitName(fileName, fileIdx) : fileName;
  await output(file, buffer);
}

// 根据获取到的数据更新表格
async function updateSheets(sheets, sheet, tableIdx, options) {
  if (sheets.length === 0) return [ sheet ];

  const { splitType, sheetName, splitName } = options;

  if (splitType === 'file') {
    await outputData(sheets, tableIdx, options);
    return [ sheet ];
  }
  sheets[sheets.length - 1].name = splitName(sheetName, tableIdx);
  sheets.push(sheet);
  return sheets;
}

// 完成对数据的导出
async function completeExport(sheets, tableIdx, options) {
  const { headers, splitType, sheetName, enableEmptyFile } = options;

  const fileIdx = (tableIdx > 1 && splitType === 'file') ? tableIdx : 0; // 当前文件编号

  if (sheets.length === 0) {
    if (!enableEmptyFile || fileIdx > 0) return;
    sheets = [{
      name: sheetName,
      data: headers ? [ headers ] : [],
    }];
  }

  if (splitType === 'sheet' && tableIdx > 1) {
    sheets[sheets.length - 1].name = options.splitName(options.sheetName, tableIdx);
  }

  await outputData(sheets, fileIdx, options);
}

module.exports = xlsxExport;
