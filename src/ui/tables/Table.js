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
    this.rows = rows;
    this.wrapText = wrapText;
    this.screenWidthPx = 1500;
    ns.resizeTail(this.screenWidthPx, 600);
    this.textWidth = 12; //Account for margin, padding
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
        this.ns.print(cell);
        const cellWidth = cell.length;
        if (cellWidth > columnWidths[columnIndex] || columnWidths[columnIndex] === undefined) {
          columnWidths[columnIndex] = cellWidth;
        }
      });
    });
    // While there's space left on the display add columns to the validColumnWidths
    columnWidths.forEach((colWidth, i) => {
      this.ns.print(`Column width: ${colWidth}, remaining space: ${this.screenWidth - tableWidth}.`);
      if (tableWidth + colWidth <= this.screenWidth) {
        tableWidth += colWidth;
        validColumnWidths.push(columnWidths[colWidth]);
      } else {
        rejects.push(this.rows[0][i]);
      }
    });
    // Make the table's array match what it can display.
    this.rows = this.rows.map((subArray) => subArray.slice(0, validColumnWidths.length - 1));

    this.ns.print(`Rejected: ${rejects}`);
    return [validColumnWidths, rejects];
  }

  formatValues(rows, columnWidths) {
    const firstRow = rows[0];
    const formattedColumns = [];
    for (let i = 0; i < firstRow.length; i++) {
      if (typeof rows[1][i] === 'number' || typeof rows[1][i] === ) {
        formattedColumns.push(i);
      }
    }

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      for (let j = 0; j < row.length; j++) {
        const column = formattedColumns[j];
        const value = row[column];
        const columnWidth = columnWidths[j];
        let newVal;

        //this.ns.print(value);
        if (typeof value === 'number') {
          if (firstRow[column].includes('money')) {
            newVal = this.ns.nFormat(value, '$0.000a');
          } else if (
            firstRow[column].includes('Percent') ||
            firstRow[column].includes('Growth') ||
            firstRow[column].includes('Chance')
          ) {
            newVal = this.ns.nFormat(value / 100, '0.0%');
          } else {
            newVal = this.ns.nFormat(value, '0,0');
          }
          newVal.padStart(columnWidth - newVal.length);
        } else if (typeof value === 'boolean') {
          newVal = value ? 'Yes' : 'No';
        } else {
          newVal = value;
        }
        row[j] = newVal;
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
    this.formatValues(this.rows, columnWidths);

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
      //const cells = row.map((cell, i) => cell.toString().padEnd(columnWidths[i]));
      const cells = row.map((cell, i) => this.ns.print(cell));
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
