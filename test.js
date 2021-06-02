'use strict';

const xlsxExport = require('./');
const rows = 888;

async function getData(offset, limit) {
  const count = Math.min(rows - offset, limit);
  const datas = [];
  for (let i = 0; i < count; i++) {
    datas.push([ offset + i + 1, '内容1', '内容2' ]);
  }
  return datas;
}

describe('Test', async function() {
  it('One table', async function() {
    const options = {
      tableLimit: 50000,
      readLimit: 100,
      headers: [ '编号', '标题1', '标题2' ],
      splitType: 'file',
      fileName: 'sample',
    };
    await xlsxExport(getData, options);
  });
  it('Split by file', async function() {
    const options = {
      tableLimit: 400,
      count: 876,
      readLimit: 100,
      headers: [ '编号', '标题1', '标题2' ],
      splitType: 'file',
      fileName: 'sample_file',
    };
    await xlsxExport(getData, options);
  });
  it('Split by sheet', async function() {
    const options = {
      tableLimit: 500,
      readLimit: 150,
      splitType: 'sheet',
      fileName: 'sample_sheet',
    };
    await xlsxExport(getData, options);
  });
});
