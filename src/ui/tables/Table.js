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
  constructor(ns, rows, wrapColumns = false, wrapRows = true) {
    this.ns = ns;
    this.rows = rows;
    this.wrapColumns = wrapColumns;
    this.wrapRows = wrapRows;
    this.screenWidthPx = 1000;
    this.screenHeightPx = 600;
    //ns.resizeTail(this.screenWidthPx, this.screenHeightPx);
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

    return [validColumnWidths, rejects];
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

  toString() {
    const columnData = this.getColumnWidths();
    const columnWidths = columnData[0];
    const headersToRemove = columnData[1];
    this.formatValues(columnWidths);

    const topLine = `${upLeft}${columnWidths
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

    // Calculate the number of tables that can fit within screenWidth
    const tableWidth = topLine.length + 1;
    const tablesPerRow = this.wrapRows ? Math.max(Math.floor(this.screenWidth / tableWidth), 1) : 1;

    // Split rows into multiple tables if necessary
    const rowsPerTable = Math.ceil(rows.length / tablesPerRow);
    let outputRows = [];
    for (let i = 0; i < tablesPerRow; i++) {
      const start = i * rowsPerTable;
      const end = Math.min((i + 1) * rowsPerTable, rows.length);
      const tableRows = rows.slice(start, end);
      while (tableRows.length < rowsPerTable) {
        tableRows.push(
          `${vertical} ${' '.repeat(columnWidths[0])} ${vertical} ${' '.repeat(columnWidths[1])} ${vertical}`,
        );
      }
      outputRows.push(tableRows);
    }

    // Print headers of removed columns
    let removedHeaders = '';
    if (headersToRemove.length > 0) {
      removedHeaders = `Columns removed from table: ${headersToRemove.join(', ')}`;
    }

    // Build the tables side by side
    const tables = [];
    for (let i = 0; i < rowsPerTable; i++) {
      const rowInTables = outputRows.map((tableRows) => tableRows[i] || '').join('  ');
      tables.push(rowInTables);
    }

    const topLines = topLine + '  '.repeat(tableWidth - topLine.length);
    const interiorLines = interiorLine + '  '.repeat(tableWidth - interiorLine.length);
    const bottomLines = bottomLine + '  '.repeat(tableWidth - bottomLine.length);

    const result = [
      topLines.repeat(tablesPerRow),
      (header + '  ').repeat(tablesPerRow).trim(),
      interiorLines.repeat(tablesPerRow),
      ...tables,
      bottomLines.repeat(tablesPerRow),
      removedHeaders,
    ].join('\n');

    return result;
  }
}
