/** @param {NS} ns */
import { Network } from '/src/servers/Network.js';

export async function main(ns) {
  

  
  const network = new Network(ns, true);
  await network.setFromNetwork();

  const columns = 
  const sort =
  const filter =


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

  network.displayServers(columns);
}
