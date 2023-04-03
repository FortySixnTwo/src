/** @param {NS} ns */
export class Server {
  constructor(ns, hostname) {
    this.ns = ns;
    this._id = hostname;
  }

  /**
   * @return {ServerData}
   */
  get id() {
    return this._id;
  }
  get data() {
    return this.ns.getServer(this.id);
  }
  get hostname() {
    return this.data.hostname;
  }
  get admin() {
    return this.data.hasAdminRights;
  }
  get level() {
    return this.data.requiredHackingSkill;
  }
  get ports() {
    return {
      required: this.data.numOpenPortsRequired,
      open: this.data.openPortCount,
    };
  }
  get security() {
    return {
      level: this.data.hackDifficulty,
      min: this.data.minDifficulty,
    };
  }
  get money() {
    return {
      available: this.data.moneyAvailable,
      max: this.data.moneyMax,
    };
  }
  get ram() {
    return {
      max: this.data.maxRam,
      available: this.data.maxRam - this.data.ramUsed,
      used: this.data.ramUsed,
    };
  }
  get scripts() {
    return {
      running: this.data.runningScripts,
      onServer: this.data.scripts,
    };
  }
  get cpuCores() {
    return this.data.cpuCores;
  }
  get growth() {
    return this.data.serverGrowhth;
  }
  get contracts() {
    return this.data.contracts;
  }
  get textFiles() {
    return this.data.textFiles;
  }
  get programs() {
    return this.data.programs;
  }

  get purchasedByPlayer() {
    return this.data.purchasedByPlayer;
  }

  /*
   * Extra stats
   */
  threadCount(ns, scriptRam) {
    let threads = 0;
    threads = (this.maxRam - ns.getServerUsedRam(this.hostname)) / scriptRam;

    if (this.hostname.equals('home')) {
      threads * 0.8;
    }
    return Math.floor(threads);
  }

  /*
   * Helpers
   */
}
