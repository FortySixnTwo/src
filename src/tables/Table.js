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
} from './boxDrawing.js';

export class Table {
  constructor(ns, rows) {
    this.ns = ns;
    this.rows = this.formatValues(rows);
  }

  // method to calculate the maximum width of each column
  getColumnWidths() {
    const numColumns = this.rows[0].length;
    const columnWidths = new Array(numColumns).fill(0);
    this.rows.forEach((row) => {
      row.forEach((cell, i) => {
        const cellWidth = cell.toString().length;
        if (cellWidth > columnWidths[i]) {
          columnWidths[i] = cellWidth;
        }
      });
    });
    return columnWidths;
  }

  formatValues(rows) {
    const firstRow = rows[0];
    const formattedColumns = [];
    for (let i = 0; i < firstRow.length; i++) {
      if (typeof rows[1][i] === 'number' || typeof rows[1][i] === 'boolean') {
        formattedColumns.push(i);
      }
    }

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      for (let j = 0; j < row.length; j++) {
        const column = formattedColumns[j];
        const value = row[column];

        //this.ns.print(value);
        if (typeof value === 'number') {
          if (firstRow[column].includes('money')) {
            row[column] = this.ns.nFormat(value, '$0.000a').padStart(12);
          } else if (
            firstRow[column].includes('Percent') ||
            firstRow[column].includes('Growth') ||
            firstRow[column].includes('Chance')
          ) {
            row[column] = this.ns.nFormat(value / 100, '0.0%').padStart(8);
          } else {
            row[column] = this.ns.nFormat(value, '0,0').padStart();
          }
        } else if (typeof value === 'boolean') {
          row[column] = value ? 'Yes' : 'No';
        } else {
          row[column] = value;
        }
      }
    }
    return rows;
  }

  formatValue(column, value) {
    if (typeof value == 'number') {
      if (column.includes('money')) {
        return this.ns.nFormat(value, '$0.000a');
      } else if (column.includes('percent') || column.includes('growth') || column.includes('chance')) {
        return this.ns.nFormat(value, '0.0%');
      } else {
        return this.ns.nFormat(value, '0,0');
      }
    } else if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    } else {
      return value;
    }
  }

  toString() {
    const columnWidths = this.getColumnWidths();
    const topLine = `\n${upLeft}${columnWidths
      .map((width) => horizontal.repeat(width + 2))
      .join(`${horizontalUp}`)}${upRight}`;
    const interiorLine = `${verticalLeft}${columnWidths
      .map((width) => horizontal.repeat(width + 2))
      .join(`${center}`)}${verticalRight}`;
    const bottomLine = `${downLeft}${columnWidths
      .map((width) => horizontal.repeat(width + 2))
      .join(`${horizontalDown}`)}${downRight}`;
    const header = `${vertical} ${this.rows
      .shift()
      .map((cell, i) => cell.toString().padEnd(columnWidths[i]))
      .join(` ${vertical} `)} ${vertical}`;
    const rows = this.rows.map((row) => {
      const cells = row.map((cell, i) => cell.toString().padEnd(columnWidths[i]));
      return `${vertical} ${cells.join(` ${vertical} `)} ${vertical}`;
    });
    return [topLine, header, interiorLine, ...rows, bottomLine].join('\n');
  }
}
