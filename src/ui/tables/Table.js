/** @param {NS} ns */
import {
  upLeft,
  upRight,
  downLeft,
  downRight,
  verticalLeft,
  verticalRight,
  horizontalDown,
  horizontalUp,
  center,
  vertical,
  horizontal,
  leftBlock,
  rightBlock,
} from './boxDrawing.js';

export class Table {
  constructor(ns, rows, wrapText = false) {
    this.ns = ns;
    this.rows = rows;
    this.wrapText = wrapText;
    this.screenWidthPx = 1000;
    //ns.resizeTail(this.screenWidthPx, 600);
    this.textWidth = 12;
    this.screenWidth = this.screenWidthPx / this.textWidth;
  }

  // method to calculate the maximum width of each column
  getColumnWidths() {
    let tableWidth = 0;
    let columnWidths = [];
    let validColumnWidths = [];
    let rejects = [];

    //Get width of each column
    this.rows.forEach((row) => {
      row.forEach((cell, columnIndex) => {
        //this.ns.print(cell);
        const cellWidth = cell.length + 2;
        if (cellWidth > columnWidths[columnIndex] || columnWidths[columnIndex] === undefined) {
          columnWidths[columnIndex] = cellWidth;
        }
      });
    });
    // Add indices up until the first over the space limit to the table, it's just easier this way, because of the splice
    columnWidths.forEach((colWidth, i) => {
      //this.ns.print(`Column width: ${colWidth}, remaining space: ${this.screenWidth - tableWidth}.`);
      tableWidth += colWidth;
      if (tableWidth <= this.screenWidth) {
        validColumnWidths.push(columnWidths[i]);
      } else {
        rejects.push(this.rows[0][i]);
      }
    });
    // Make the table's array match what it can display.
    this.rows = this.rows.map((subArray) => subArray.slice(0, validColumnWidths.length));

    //this.ns.print(`Rejected: ${rejects}`);
    return [validColumnWidths, rejects];
    //return [columnWidths, rejects];
  }

  formatValues(columnWidths) {
    //this.ns.print(columnWidths);
    const rows = this.rows;
    const firstRow = rows[0];
    for (let i = 1; i < rows.length; i++) {
      for (let j = 0; j < rows[i].length; j++) {
        let value = rows[i][j];
        let newVal;
        if (typeof value === 'number') {
          //this.ns.print(newVal + " " + columnWidths);
          if (firstRow[j].includes('money')) {
            newVal = this.ns.nFormat(value, '$0.000a');
          } else if (
            firstRow[j].includes('Percent') ||
            firstRow[j].includes('Growth') ||
            firstRow[j].includes('Chance')
          ) {
            newVal = this.ns.nFormat(value / 100, '0.0%');
          } else {
            newVal = this.ns.nFormat(value, '0,0');
          }
          newVal = newVal.padStart(columnWidths[j]);
        } else if (typeof value === 'boolean') {
          newVal = value ? 'Yes' : 'No';
        } else {
          newVal = value;
        }
        this.rows[i][j] = newVal;
      }
    }
  }

  /*formatValue(column, value, width) {
    let out;
    if (typeof value == 'number') {
      if (column.includes('money')) {
        out = this.ns.nFormat(value, '$0.000a');
      } else if (column.includes('percent') || column.includes('growth') || column.includes('chance')) {
        out = this.ns.nFormat(value, '0.0%');
      } else {
        out = this.ns.nFormat(value, '0,0');
      }
      out = out.padStart(width - value.length);
    } else if (typeof value === 'boolean') {
      out = value ? 'Yes' : 'No';
    } else {
      return value;
    }
    return out;
  }*/

  toString() {
    const columnData = this.getColumnWidths();
    const columnWidths = columnData[0];
    const headersToRemove = columnData[1];
    this.formatValues(columnWidths);

    const separator = `${leftBlock}${columnWidths
      .map((width) => ' '.repeat(width + 2))
      .join(`${rightBlock}${leftBlock}`)}${rightBlock}`;
    const topLine = `\n${upLeft}${columnWidths
      .map((width) => horizontal.repeat(width + 2))
      .join(`${horizontalUp}`)}${upRight}`;
    const interiorLine = `${verticalLeft}${columnWidths
      .map((width) => horizontal.repeat(width + 2))
      .join(`${center}`)}${verticalRight}`;
    const bottomLine = `${downLeft}${columnWidths
      .map((width) => horizontal.repeat(width + 2))
      .join(`${horizontalDown}`)}${downRight}`;
    const header = `${leftBlock}${this.rows
      .shift()
      .map((cell, i) => cell.toString().padEnd(columnWidths[i]))
      .join(` ${rightBlock}${leftBlock}`)}${rightBlock}`;
    const rowsPerChunk = Math.floor(
      (this.screenWidth - separator.length) / (columnWidths.reduce((acc, curr) => acc + curr, 0) + 4),
    );
    let rows = [];
    for (let i = 0; i < this.rows.length; i += rowsPerChunk) {
      let chunk = this.rows.slice(i, i + rowsPerChunk);
      let rowStrings = chunk.map(
        (row) =>
          `${leftBlock}${row
            .map((cell, i) => cell.toString().padEnd(columnWidths[i]))
            .join(` ${rightBlock}${leftBlock}`)}${rightBlock}`,
      );
      rows.push(rowStrings.join(`${leftBlock}${rightBlock}${separator}${leftBlock}${rightBlock}`));
    }

    // Print headers of removed columns
    let removedHeaders = '';
    if (headersToRemove.length > 0) {
      removedHeaders = `Columns removed from table: ${headersToRemove.join(', ')}`;
    }

    return [topLine, header, interiorLine, ...rows, bottomLine, removedHeaders].join('\n');
  }
}
