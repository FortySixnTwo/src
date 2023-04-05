/** @param {NS} ns **/
import { BudgetMult } from '/src/conf/Constants';
import { HacknetNodeConstants } from '/src/hacknet/Constants.js';
import { HackNode } from '/src/hacknet/HackNode.js';
import { Table } from '/src/ui/tables/Table';
import(BudgetMult);

export class Hacknet {
  constructor(ns) {
    this.ns = ns;
    this.nodes = [];
    this.increments = {
      levels: 5,
      ram: 1,
      cores: 1,
    };
    this._currentNodes = 0;
    this._nextNodes = null;
    this._currentLevel = null;
    this._nextLevel = null;
    this._currentRam = null;
    this._nextRam = null;
    this._currentCores = null;
    this._nextCores = null;
  }

  /*
   * Constructor methods
   */

  findNodes() {
    const existingNodes = [];
    let numNodes = this.ns.hacknet.numNodes();

    for (let i = 0; i < numNodes; i++) {
      existingNodes.add(new HackNode(i));
    }
    return;
  }

  /*
   * Getters
   */
  get currentLevel() {
    return this.getMin('level');
  }

  get nextLevel() {
    return this.currentLevel() + 1;
  }

  get currentRam() {
    return this.getMin('ram');
  }

  get nextRam() {
    return this.currentRam() * 2;
  }

  get currentCores() {
    return this.getMin('cores');
  }

  get nextCores() {
    return this.currentCores() + 1;
  }

  /*
   * Helper
   */

  //Returns min value of any property in the node list
  getMin(property) {
    return Math.min(this.nodes.map((node) => node[property]));
  }

  /*
   * Boolean Checks
   */

  canUpgrade() {
    return this.canBuyNodes() || this.canUpgradeLevel() || this.canUpgradeRam() || this.canUpgradeCores();
  }

  canBuyNodes() {
    return this.nodes.length < HacknetNodeConstants.MaxServers;
  }

  canUpgradeLevel() {
    return this.getCurrentLevel() === HacknetNodeConstants.MaxLevel;
  }

  canUpgradeRam() {
    this.getCurrentRam() === HacknetNodeConstants.MaxRam;
  }

  canUpgradeCores() {
    this.getCurrentCores() === HacknetNodeConstants.MaxCores;
  }

  /*
   * ???
   */

  //Upgrades all of the nodes in the net by an amount
  async upgradeNodeProperty(property, increment) {
    let nodesToUpgrade = this.nodes.filter(
      (node) => node[property] === this[`getCurrent${property[0].toUpperCase()}${property.slice(1)}`](),
    );

    while (nodesToUpgrade.length > 0) {
      for (let node of nodesToUpgrade) {
        const index = node.index;
        const wallet = this.ns.getServerMoneyAvailable('home');
        const budget = wallet * BudgetMult.HackNet;
        let cost;

        // Get cost of the upgrade
        if (property === 'levels') {
          cost = this.ns.HackNet.getLevelUpgradeCost(node[index]);
        } else if (property === 'ram') {
          cost = this.ns.HackNet.getRamUpgradeCost(node[index]);
        } else if (property === 'cores') {
          cost = this.ns.HackNet.getCoreUpgradeCost(node[index]);
        }

        //Check if it's in budget, if so buy the upgrade, update the data, strike the index from the list to be done, and await async gods
        if (cost <= budget) {
          if (this.ns.hacknet.upgradeCore(index, increment)) {
            const updatedNode = this.nodes.find((node) => node.index === index);
            if (property === 'ram') {
              updatedNode.ram *= 2;
            } else {
              updatedNode[property] += 1;
            }
            nodesToUpgrade = nodesToUpgrade.filter((node) => node.index !== index);
          }
        }
        await this.ns.sleep(60);
      }
    }
  }

  buyNode() {
    let nodeIndex = this.ns.purchaseNode();
    if (nodeIndex >= -1) {
      this.nodes.add(new HackNode(nodeIndex));
    }
  }

  async upgradeLevels() {
    await this.upgradeNodeProperty('levels', this.increments.levels);
  }

  async upgradeRams() {
    await this.upgradeNodeProperty('ram', this.increments.ram);
  }

  async upgradeCores() {
    await this.upgradeNodeProperty('cores', this.increments.cores);
  }

  /*
   * Display methods
   */

  displayNodes(columns) {
    const columns = ['index', 'level', 'cores', 'ram'];
    const config = {
      hostname: 'Hostname',
      hasAdminRights: 'Admin',
      numOpenPortsRequired: 'Required Ports',
      moneyAvailable: 'Current $',
      moneyMax: 'Max $',
    };
    //this.ns.clearLog();

    let servers = this.servers;

    const rows = servers.map((server) => {
      return columns.map((column) => {
        return server[column];
      });
    });
    rows.unshift(columns);
    //this.ns.print(rows);
    const table = new Table(this.ns, rows);
    this.ns.print(table.toString());
  }
}
