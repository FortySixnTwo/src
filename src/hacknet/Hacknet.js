/** @param {NS} ns **/
import { HacknetNodeConstants } from '/src/hacknet/Constants.js';
import { HackNode } from '/src/hacknet/HackNode.js';
import { Table } from '/src/ui/tables/Table';

export class Hacknet {
  constructor(ns) {
    this.ns = ns;
    this.nodes = this.getNodes();
    //Amount of levels to purchase for a stat in one go
    this.increments = {
      levels: 5,
      ram: 1,
      cores: 1,
    };
    //Budget for buying nodes is capped at 0.1 * available money
    this.budgetMultiplier = 0.1;

    this.targetUpgrade = { property: '', cost: Infinity };
    this.nodesToUpgrade = [];
  }

  /*
   * Constructor Methods
   */

  getNodes() {
    const existingNodes = [];
    let numNodes = this.ns.hacknet.numNodes();

    for (let i = 0; i < numNodes; i++) {
      existingNodes.push(new HackNode(this.ns, i));
    }
    return existingNodes;
  }

  updateNodes() {
    this.nodes = this.getNodes();
  }

  /*
   * Getters
   */
  get numNodes() {
    return this.nodes.length;
  }
  get nextNodeCost() {
    return this.ns.hacknet.getPurchaseNodeCost();
  }

  get currentLevel() {
    return Math.min(...this.nodes.map((node) => node.level));
  }
  get nextLevelCost() {
    return this.ns.hacknet.getLevelUpgradeCost(this.minLevelIndex, this.increments.levels);
  }

  get currentRam() {
    return Math.min(...this.nodes.map((node) => node.ram));
  }
  get nextRamCost() {
    return this.ns.hacknet.getRamUpgradeCost(Math.log2(this.minRamIndex) + 1, this.increments.levels);
  }

  get currentCores() {
    return Math.min(...this.nodes.map((node) => node.cores));
  }
  get nextCoresCost() {
    return this.ns.hacknet.getCoreUpgradeCost(this.minCoresIndex, this.increments.cores);
  }

  get minLevelIndex() {
    let minServers = this.nodes.filter((node) => node.level === this.currentLevel);
    return minServers[0].index;
  }

  get minRamIndex() {
    let minServers = this.nodes.filter((node) => node.ram === this.currentRam);
    return minServers[0].index;
  }

  get minCoresIndex() {
    let minServers = this.nodes.filter((node) => node.cores === this.currentCores);
    return minServers[0].index;
  }

  get budget() {
    return this.ns.getServerMoneyAvailable('home') * this.budgetMultiplier;
  }

  /*
   * Upgrade methods
   */

  // Iterator helpers

  hasNextUpgrade() {
    return this.canBuyNodes() || this.canUpgradeLevel() || this.canUpgradeRam() || this.canUpgradeCores();
  }

  canBuyNodes() {
    return this.numNodes < HacknetNodeConstants.MaxServers;
  }

  canUpgradeLevel() {
    return this.minLevel !== HacknetNodeConstants.MaxLevel;
  }

  canUpgradeRam() {
    this.minRam !== HacknetNodeConstants.MaxRam;
  }

  canUpgradeCores() {
    this.minCores !== HacknetNodeConstants.MaxCores;
  }

  isNodesToUpgrade() {
    return this.nodesToUpgrade.length !== 0;
  }

  // Upgrade target methods
  findNextUpgrade() {
    let consideredUpgrade = { property: '', cost: Infinity };

    if (this.numNodes === 0) {
      consideredUpgrade = { property: 'node', cost: this.ns.hacknet.getPurchaseNodeCost() };
    } else {
      // Compared ROI or cost and returns an object with a {upgrade:'', cost: n} key set.
      const upgradeCosts = {
        level: this.nextLevelCost,
        ram: this.nextRamCost,
        cores: this.nextCoresCost,
        node: this.nextNodeCost,
      };

      // Work out best return on investment if we have formulas, buy the cheapest if we've not.
      if (this.ns.fileExists('Formulas.exe')) {
        this.ns.print('TODO!');
      } else {
        for (const [upgrade, cost] of Object.entries(upgradeCosts)) {
          if (cost < consideredUpgrade.cost) {
            consideredUpgrade.cost = cost;
            consideredUpgrade.property = upgrade;
          }
        }
      }
    }

    this.targetUpgrade = consideredUpgrade;
    //this.ns.print(`New target found: ${this.targetUpgrade.property}`);
    this.updateUpgradeList();
  }

  updateUpgradeList() {
    if (this.targetUpgrade.property === 'level') {
      this.nodesToUpgrade = this.nodes.filter((node) => node.level === this.currentLevel);
    } else if (this.targetUpgrade.property === 'ram') {
      this.nodesToUpgrade = this.nodes.filter((node) => node.ram === this.currentRam);
    } else if (this.targetUpgrade.property === 'cores') {
      this.nodesToUpgrade = this.nodes.filter((node) => node.cores === this.currentCores);
    } else if (this.targetUpgrade.property === 'node') {
      this.nodesToUpgrade.add({ null: null });
    }
    //this.ns.print(`New nodes in need of upgrade are: ${this.nodesToUpgrade}`);
  }

  // Actual upgrade methods
  upgradeNode() {
    let index = this.nodesToUpgrade[0].index;
    let property = this.targetUpgrade.property;
    const increment = this.increments[property];
    let result;
    if (this.budget > this.targetUpgrade.cost) {
      if (property === 'node') {
        result = this.ns.hacknet.purchaseNode();
      } else if (property === 'level') {
        result = this.ns.hacknet.upgradeLevel(index, increment);
      } else if (property === 'ram') {
        result = this.ns.hacknet.upgradeRam(index, increment);
      } else if (property === 'cores') {
        result = this.ns.hacknet.upgradeCore(index, increment);
      }

      if (result) {
        const updatedNode = this.nodes.find((node) => node.index === index);
        if (property === 'ram') {
          updatedNode.ram *= 2;
        } else if (property === 'node') {
          this.nodes.push(result);
          this.nodesToUpgrade = [];
        } else {
          updatedNode[property] += 1;
        }
        this.nodesToUpgrade = this.nodesToUpgrade.filter((node) => node.index !== index);
      }
    }
    return result;
  }

  /*
   * Display
   */

  display() {
    //this.ns.clearLog();
    this.updateNodes();

    const colHeaders = {
      rowHeaders: 'Hacknet Stats',
      count: 'Count',
      costs: 'Next cost',
    };

    const rowHeaders = {
      numNodes: 'Nodes',
      currentLevel: 'Level',
      currentRam: 'Ram',
      currentCores: 'Cores',
    };

    // Get an array of the class properties and their corresponding values
    const upgrades = Object.keys(colHeaders).map((property) => {
      return this[property];
    });

    // Map properties to their beautified headers
    const headers = Object.keys(colHeaders).map((property) => {
      return colHeaders[property] ? colHeaders[property] : property;
    });

    // Calculate costs
    const costs = [this.nextLevelCost, this.nextRamCost, this.nextCoresCost];

    // Create a 2D array with the headers and the values
    const rows = [headers, upgrades, costs];

    const table = new Table(this.ns, rows);
    this.ns.resizeTail(table.maxWidthPx, table.maxHeightPx);

    this.ns.clearLog();
    this.ns.print(table.toString());
  }
}
