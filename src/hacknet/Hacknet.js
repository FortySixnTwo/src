/** @param {NS} ns **/
import { HacknetNodeConstants } from '/@/hacknet/Constants.js';

export class Hacknet {
  constructor(ns) {
    this.ns = ns;
    this.nodes = this.findNodes();
  }

  /*
   * Constructor methods
   */

  findNodes(ns) {
    const existingNodes = [];
    let numNodes = ns.hacknet.numNodes();
    for (let i = 0; i < numNodes; i++) {
      existingNodes.add(ns.getNodeStats(i));
    }
    return;
  }

  /*
   * Helper
   */

  //Returns min value of any property in the node list
  getMin(property) {
    return Math.min(this.nodes.map((node) => node[property]));
  }

  getCurrentLevel() {
    return this.getMin('level');
  }

  getCurrentRamLevel() {
    return Math.log2(this.getMin('ram')) + 1;
  }

  getCurrentCores() {
    return this.getMin('cores');
  }

  /*
   * ???
   */

  buyNode() {
    let nodeIndex = this.ns.purchaseNode();
    if (nodeIndex >= -1) {
      this.nodes.add(this.ns.getNodeStats(nodeIndex));
    }
  }

  upgradeLevel(index) {
    if (this.ns.hacknet.upgradeLevel(index, 1)) {
      this.nodes.level += 1;
    }
  }

  upgradeRam() {}

  upgradeCore() {}
}
