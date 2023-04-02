/** @param {NS} ns */
export async function main(ns) {
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
  while (servers.length > 0) {
    for (let i = 0; i < servers.length; i++) {
      ns.print("ram upgradthing");
      let server = servers[i];
      let upgradedRam = ns.getServerMaxRam(server) * 2;
      ns.upgradePurchasedServer(server, upgradedRam);
    }
    await ns.sleep(1000);
  }
}
