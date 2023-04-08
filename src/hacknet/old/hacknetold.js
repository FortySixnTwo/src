/** @param {NS} ns **/
import { BudgetMult } from '/src/conf/Constants';
import { HacknetNodeConstants } from '/src/hacknet/Constants.js';
import { HackNode } from '/src/hacknet/HackNode.js';
import { Table } from '/src/ui/tables/Table';


export class Hacknet {
  constructor(ns) {
    this.ns = ns;
    this.nodes = [];
    this.increments = {
      levels: 5,
      ram: 1,
      cores: 1,
    };
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

  get currentNodes() {
    return this.nodes.length;
  }

  get nextNodeCost() {
    return this.ns.hacknet.getPurchaseNodeCost();
  }

  get currentLevel() {
    return this.getMin('level');
  }

  get nextLevelCost() {
    let nodeIndex = this.getCurrentLevelNodes()[0].index;
    return this.ns.HackNet.getLevelUpgradeCost(nodeIndex, this.increments.levels);
  }

  get currentRam() {
    return this.getMin('ram');
  }

  get nextRamCost() {
    let nodeIndex = this.getCurrentLevelNodes()[0].index;
    return this.ns.HackNet.getRamUpgradeCost(nodeIndex, this.increments.levels);
  }

  get currentCores() {
    return this.getMin('cores');
  }

  get nextCoresCost() {
    let nodeIndex = this.getCurrentLevelNodes()[0].index;
    return this.ns.HackNet.getCoreUpgradeCost(nodeIndex, this.increments.cores);
  }

  get targetUpgrade() {
    return this.targetUpgrade;
  }

  /*
   * Helper
   */

  //Returns min value of any property in the node list
  getMin(property) {
    return Math.min(this.nodes.map((node) => node[property]));
  }

  getCheapestUpgrade() {
    const upgradeCosts = {
      level: this.nextLevelCost,
      ram: this.nextRamCost,
      cores: this.nextCoresCost,
      node: this.nextNodeCost,
    };

    let minUpgrade = { property: '', cost: Infinity };

    for (const [upgrade, cost] of Object.entries(upgradeCosts)) {
      if (cost < minUpgrade.cost) {
        minUpgrade.cost = cost;
        minUpgrade.property = upgrade;
      }
    }

    return minUpgrade;
  }

  getCurrentLevelNodes() {
    return this.nodes.filter(
      (node) => node.level === this.currentLevel && node.ram === this.currentRam && node.cores === this.currentCores,
    );
  }

  let upgrade = this.getCheapestUpgrade();
    if (this.ns.fileExists('Formulas.exe')) {
      this.ns.print('TODO!');
    }
    return upgrade;

  /*
   * Boolean Checks
   */

  hasNextUpgrade() {
    return this.canBuyNodes() || this.canUpgradeLevel() || this.canUpgradeRam() || this.canUpgradeCores();
  }

  canBuyNodes() {
    return this.nodes.length < HacknetNodeConstants.MaxServers;
  }

  canUpgradeLevel() {
    return this.getCurrentLevel() !== HacknetNodeConstants.MaxLevel;
  }

  canUpgradeRam() {
    this.getCurrentRam() !== HacknetNodeConstants.MaxRam;
  }

  canUpgradeCores() {
    this.getCurrentCores() !== HacknetNodeConstants.MaxCores;
  }

  /*
   * ???
   */

  async upgradeBestProperty() {
    
    await this.upgradeHacknetProperty(targetUpgrade);
  }

  //Upgrades all of the nodes in the net by an amount
  async upgradeHacknetProperty(property, cost) {
    const increment = this.increments[property];
    let nodesToUpgrade = this.getCurrentLevelNodes();

    while (nodesToUpgrade.length > 0) {
      for (let node of nodesToUpgrade) {
        const index = node.index;
        const wallet = this.ns.getServerMoneyAvailable('home');
        const budget = wallet * BudgetMult.HackNet;

        //Check if it's in spend size limit, if so buy the upgrade, update the data, strike the index from the list to be done, and await async gods
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

  /*
   * Display methods
   */

  displayNodes() {
    const columns = ['index', 'level', 'cores', 'ram'];
    const config = {
      index: '#',
      level: 'Lvl.',
      ram: 'Ram',
      cores: 'Cores',
    };
    //this.ns.clearLog();

    let nodes = this.nodes;

    // map everything out into a 2d array of arrays.
    const rows = nodes.map((node) => {
      return columns.map((column) => {
        return node[column];
      });
    });

    //Make a header from the nicer property names and put that in the table data
    const header = columns.map((column) => config[column]);
    rows.unshift(header);

    const table = new Table(this.ns, rows);
    this.ns.print(table.toString());
  }

  // This should display stats, current target, etc and how many servers have been upgraded
  displayProcess() {
    return 0;
  }
}
