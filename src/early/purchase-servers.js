/** @param {NS} ns */
export async function main(ns) {
  ns.disableLog('ALL');
  let servers = ns.getPurchasedServers();
  await buyServers(ns);
  await upgradeServers(ns, servers);
}

export async function buyServers(ns) {
  //RAM size servers to purchase
  const ram = 8;
  //Amount of servers you can have at once
  const serverLimit = 25;

  //If amount of servers you have is less than you can, buy more.
  let i = ns.getPurchasedServers().length + 1;
  while (i < serverLimit) {
    if (ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(ram)) {
      await ns.purchaseServer('pserv-' + i, ram);
      i++;
    }
    //Sleep before next iteration
    await ns.sleep(1000);
  }
}

export async function upgradeServers(ns, servers) {
  //Always check if you can buy a server double the size of the current
  //TODO - Swap this for a while upgrades left?
  let minUpgrade = 0;
  while (servers.length > 0) {
    let nextMin = 999999999;
    ns.print(`Current RAM Upgrade is ${minUpgrade}, next RAM upgrade is ${nextMin}`);
    for (let i = 0; i < servers.length; i++) {
      let server = servers[i];
      let upgradedRam = ns.getServerMaxRam(server) * 2;
      if (upgradedRam == minUpgrade) {
        ns.upgradePurchasedServer(server, upgradedRam);
      }
      if (upgradedRam < nextMin || nextMin == 0) {
        nextMin = upgradedRam;
      }
    }
    minUpgrade = nextMin;
    await ns.sleep(3000);
  }
}
