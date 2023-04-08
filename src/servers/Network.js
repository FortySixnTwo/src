/** @param {NS} ns */
import { Table } from '/src/ui/tables/Table.js';

export class Network {
  constructor(ns, debug = false) {
    this.debug = debug;
    this.ns = ns;
    this.servers = [];
  }

  // Getters
  get servers() {
    return this._servers;
  }

  // Setters
  set servers(input) {
    this._servers = input;
  }

  // List Population Methods
  async setFromNetwork() {
    const root = 'home';
    const visited = [];
    const stack = [root];
    this.ns.disableLog('scan');

    while (stack.length > 0) {
      const current = stack.pop();

      if (!visited.includes(current)) {
        visited.push(current);

        const connections = await this.ns.scan(current);
        for (const next of connections.reverse()) {
          if (next !== root && !visited.includes(next)) {
            stack.push(next);
          }
        }
      }
    }

    const servers = [];
    for (const server of visited) {
      servers.push(await this.ns.getServer(server));
    }

    this.servers = servers;

    if (this.debug) {
      this.ns.print(`Found ${this.servers.length} servers:`);
      this.servers.forEach((server) => {
        this.ns.print(`- ${server.hostname}`);
      });
    }
  }

  // Data Helpers
  sortServersBy(property, descending = true) {
    this.servers.sort((a, b) => {
      //this.ns.print(`${a[property]} vs ${b[property]}`);
      if (a[property] < b[property]) {
        //this.ns.print(`${a[property]} < ${b[property]}`);
        return descending ? 1 : -1;
      } else if (a[property] > b[property]) {
        //this.ns.print(`${a[property]} > ${b[property]}`);
        return descending ? -1 : 1;
      } else {
        //this.ns.print(`Error: ??????????????`);
        return 0;
      }
    });
    //this.ns.print(this.servers);
  }

  filterServersBy(condition, invert = false) {
    if (typeof condition === 'function') {
      this.servers = this.servers.filter((server) => condition(server) !== invert);
    } else {
      this.servers = this.servers.filter((server) => server[condition] !== invert);
    }
  }

  applyMultipleFilters(conditions) {
    for (let [condition, inversion] of Object.entries(conditions)) {
      this.filterServersBy(condition, inversion);
    }
  }

  //Display Helpers

  displayServers(columns) {
    const config = {
      hostname: 'Hostname',
      hasAdminRights: 'Admin',
      numOpenPortsRequired: 'Open ports needed',
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

    // Map columns to their beautified headers
    const headers = columns.map((column) => {
      return config[column] ? config[column] : column;
    });

    rows.unshift(headers);
    const table = new Table(this.ns, rows);
    this.ns.print(table.toString());
  }

  //Server Operations

  scpToAllServers(script) {
    if (typeof script === 'string') {
      this.ns.scp(script);
    } else if (typeof script[Symbol.iterator] === 'function') {
      for (let item in script) {
        this.ns.scp(item);
      }
    }
  }

  //Statistics

  getTotalThreads(scriptRam) {
    let availableRamBlocks = this.servers.map((server) => server.ramAvailable);
    let sum = 0;
    for (let ram of availableRamBlocks) {
      sum += Math.floor(ram / scriptRam);
    }
    return Math.ceil(sum);
  }

  getServerProperties() {
    return Object.keys(this.servers[0]);
  }
}
