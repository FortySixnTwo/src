/** @param {NS} ns */
import { Network } from '/src/servers/Network.js';
export async function main(ns) {
  const columns = ns.args[0] || ['hostname', 'moneyMax', 'requiredHackingSkill', 'serverGrowth', 'minDifficulty'];
  const sort = ns.args[1] || undefined;
  const filter = ns.args[2] || undefined;
  const network = new Network(ns);
  await network.setFromNetwork();

  if (filter == undefined) {
    network.filterServersBy('purchasedByPlayer', true);
    network.filterServersBy('hasAdminRights');
  } else {
    network.filterServersBy(filter);
  }
  if (sort != undefined) {
    network.sortServersBy(sort);
  } else {
    network.sortServersBy('moneyMax');
  }

  ns.tail();
  network.displayServers(columns, sort, filter);
}
