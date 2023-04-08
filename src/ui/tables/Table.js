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
  constructor(ns, rows, maxWidth = 600, maxHeight = 500, fitWidth = true, wrapColumns = false, wrapRows = true) {
    this.ns = ns;
    this.rows = rows;
    this.wrapColumns = wrapColumns;
    this.wrapRows = wrapRows;
    this.maxWidthPx = maxWidth;
    this.maxHeightPx = maxHeight;
    this.fitWidth = fitWidth;
    this.textWidth = 12.25;
    this.screenWidth = this.maxWidthPx / this.textWidth;
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
        const cellWidth = cell.length + 5;
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

    // Scale validColumnWidths to fit the screen width if fitWidth is true
    if (this.fitWidth) {
      const remainingSpace = this.screenWidth - tableWidth;
      const extraSpacePerColumn = remainingSpace / validColumnWidths.length;

      validColumnWidths = validColumnWidths.map((width) => width + extraSpacePerColumn);
    }

    return [validColumnWidths, rejects];
  }

  formatValues(columnWidths) {
    const rows = this.rows;
    const firstRow = rows[0];
    for (let i = 1; i < rows.length; i++) {
      for (let j = 0; j < rows[i].length; j++) {
        let value = rows[i][j];
        let newVal;
        if (typeof value === 'number') {
          //this.ns.print(`Processing value: ${value}, header: ${firstRow[j]}`);
          if (new RegExp('money|\\$', 'i').test(firstRow[j])) {
            //this.ns.print('Money case');
            newVal = this.ns.nFormat(value, '0.000a');
            // Minus 2 to account for $ and spacing
            newVal = newVal.padStart(columnWidths[j] - 1);
            newVal = '$' + newVal;
          } else if (new RegExp('Percent|Growth|Chance', 'i').test(firstRow[j])) {
            //this.ns.print('Percent case');
            newVal = this.ns.nFormat(value / 100, '0.0%');
            newVal = newVal.padStart(columnWidths[j]);
          } else if (new RegExp('Ram', 'i').test(firstRow[j])) {
            //this.ns.print('Ram case');
            if (value >= 1e12) {
              // 1 PB
              newVal = this.ns.nFormat(value / 1e12, '0.0') + 'PB';
            } else if (value >= 1e9) {
              // 1 TB
              newVal = this.ns.nFormat(value / 1e9, '0.0') + 'TB';
            } else {
              newVal = this.ns.nFormat(value, '0,0') + 'GB';
            }
            newVal = newVal.padStart(columnWidths[j]);
          } else {
            //this.ns.print('General number case');
            newVal = this.ns.nFormat(value, '0,0');
            newVal = newVal.padStart(columnWidths[j]);
          }
        } else if (typeof value === 'boolean') {
          //this.ns.print('Bool case');
          newVal = value ? 'Yes' : 'No';
        } else {
          //this.ns.print('No format case');
          newVal = value;
        }
        //this.ns.print(`Processed Value: ${newVal}\n`);
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
    const tablesPerRow = this.wrapRows
      ? Math.min(Math.max(Math.floor(this.screenWidth / tableWidth), 1), this.rows.length)
      : 1;
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
