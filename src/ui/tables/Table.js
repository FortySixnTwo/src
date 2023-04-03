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
  constructor(ns, rows, wrapText = false) {
    this.ns = ns;
    this.wrapText = wrapText;
    this.screenWidthPx = 500;
    ns.resizeTail(this.screenWidthPx, 600);
    this.textWidth = 12; //Account for margin, padding
    this.screenWidth = this.screenWidthPx / this.textWidth;
    this.rows = this.formatValues(rows);
  }

  // method to calculate the maximum width of each column
  getColumnWidths() {
    const numColumns = this.rows[0].length;
    const columnWidths = new Array(numColumns).fill(0);
    const headersToRemove = [];

    // Calculate column widths
    this.rows.forEach((row, i) => {
      row.forEach((cell, j) => {
        const cellWidth = cell.toString().length;
        if (cellWidth > columnWidths[j]) {
          columnWidths[j] = cellWidth;
        }
        const headerWidth = this.rows[0][j].toString().length;
        if (headerWidth > columnWidths[j]) {
          columnWidths[j] = headerWidth;
        }
      });
    });

    // Remove columns that exceed the maximum allowed width
    let tableWidth = 0;
    let finalColumnWidths = [];
    while (tableWidth > ) {
      const thisColWidth = columnWidths[i] + 1 + i;
      let message = `Column: ${this.rows[0][i]}`;
      if (tableWidth + thisColWidth > this.screenWidth) {
        headersToRemove.push(this.rows[0][i]);
        this.ns.print(`${message} is over remaining chars: ${thisColWidth} > ${this.screenWidth - tableWidth}.`);
      } else {
        this.ns.print(`${message} is under remaining chars: ${thisColWidth} < ${this.screenWidth - tableWidth}.`);
        tableWidth += thisColWidth;
        this.ns.print(`Columns to display: ${finalColumnWidths}`);
        finalColumnWidths.push(columnWidths[i]);
      }
    }
    for (let i = headersToRemove.length - 1; i >= 0; i--) {
      const index = headersToRemove[i];
      const header = this.rows[0][index];
      this.rows[0].splice(index, 1);
      this.ns.print(`Deleting ${header} header`);
      this.rows.slice(1).forEach((row) => row.splice(index + 1, 1));
    }
    //this.ns.print(`Original col widths: ${columnWidths}`);
    //this.ns.print(`final col Widths: ${finalColumnWidths}`);
    //this.ns.print(`Return object: ${{ finalColumnWidths, headersToRemove }}`);
    return [finalColumnWidths, headersToRemove];
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
    const columnData = this.getColumnWidths();
    const columnWidths = columnData[0];
    const headersToRemove = columnData[1];

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

    // Print headers of removed columns
    let removedHeaders = '';
    if (headersToRemove.length > 0) {
      removedHeaders = `Columns removed from table: ${headersToRemove.join(', ')}`;
    }

    return [topLine, header, interiorLine, ...rows, bottomLine, removedHeaders].join('\n');
  }
}
