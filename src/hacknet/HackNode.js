/** @param {NS} ns **/
import { HacknetNodeConstants } from '/src/hacknet/Constants.js';

export class HackNode {
  constructor(ns, index) {
    this.ns = ns;
    this._index = index();
    this._data = this.ns.getNodeStats(this._index);
  }

  /*
   * Getters and setters
   */

  get index() {
    return this._index;
  }

  set index(value) {
    this._index = value;
    this._data = this.ns.getNodeStats(this._index);
  }

  get name() {
    return this._data.name;
  }

  set name(value) {
    this._data.name = value;
  }

  get level() {
    return this._data.level;
  }

  set level(value) {
    this._data.level = value;
  }

  get ram() {
    return this._data.ram;
  }

  set ram(value) {
    this._data.ram = value;
  }

  get cores() {
    return this._data.cores;
  }

  set cores(value) {
    this._data.cores = value;
  }

  get production() {
    return this._data.production;
  }

  set production(value) {
    this._data.production = value;
  }

  get timeOnline() {
    return this._data.timeOnline;
  }

  set timeOnline(value) {
    this._data.timeOnline = value;
  }

  get totalProduction() {
    return this._data.totalProduction;
  }

  set totalProduction(value) {
    this._data.totalProduction = value;
  }

  /*
   * Data refresh stuff
   */

  updateData() {
    this._data = this.ns.getNodeStats(this._index);
  }
}
