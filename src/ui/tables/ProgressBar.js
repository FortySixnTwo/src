/** @param {NS} ns */
import { Table } from './table.js';
import { block } from './boxDrawing.js';

class ProgressBar extends Table {
  constructor(ns, header, start, current, end, maxWidth = 600, maxHeight = 50) {
    const rows = [
      [header], // header row
      [start, end], // start and end numbers row
      // other rows for progress bar and any additional customizations
    ];
    super(ns, rows, maxWidth, maxHeight, true, false, false); // fitWidth: true, wrapColumns: false, wrapRows: false
    this.current = current;
  }

  // Override getColumnWidths() or other methods if needed
  getColumnWidths() {
    // Custom implementation for ProgressBar
    // You can call super.getColumnWidths() if you need the parent class implementation
  }

  // Add additional methods specific to ProgressBar
  generateProgressBar() {
    // Logic to generate the progress bar using '█' character
    // Update this.rows or any other necessary properties to incorporate the progress bar
  }

  // Override toString() or any other methods to customize the output
  toString() {
    this.generateProgressBar();
    return super.toString(); // Call the parent class implementation to generate the final output
  }
}

