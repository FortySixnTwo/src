/** @param {NS} ns */
import { Network } from '/src/servers/Network.js';

export async function main(ns) {
  // Open UI
  ns.disableLog('ALL');
  ns.tail();
  //Get a network object and populate it
  const network = new Network(ns);
  await network.setFromNetwork();
  //Add default server foreign key variable and display thes

  //let columns = await getUserInput(ns, network.getServerProperties(), 'columns');
  //let sort = await getUserInput(ns, network, 'sort');
  //let filter = await getUserInput(ns, network, 'filter');
  let columns = undefined;
  let sort = undefined;
  let filter = undefined;

  if (columns == undefined) {
    columns = network.getServerProperties();
    //columns = ['hostname', 'moneyMax', 'moneyAvailable', 'hackDifficulty', 'maxRam'];
  }
  if (filter == undefined) {
    //network.filterServersBy('purchasedByPlayer', true);
    network.filterServersBy('hasAdminRights');
  } else {
    network.filterServersBy(filter);
  }
  if (sort != undefined) {
    network.sortServersBy(sort);
  } else {
    network.sortServersBy('moneyMax');
  }

  //Prompts render behind log
  network.displayServers(columns);
}

async function getUserInput(ns, allItems, itemName) {
  let reqItems = new Set();
  let done = false;
  while (done === false) {
    ns.clearLog();
    ns.tprint(`Available ${itemName}s are`);
    ns.tprint([...allItems]);
    ns.tprint('Current table columns, in order, are:');
    ns.tprint([...reqItems]);

    let result = await ns.prompt(`Add or remove a ${itemName}.`, { type: 'text' });
    if (reqItems.has(result) && allItems.has(result)) {
      reqItems.delete(result);
    } else if (allItems.has(result)) {
      reqItems.add(result);
    }
    if (reqItems.length != 0) {
      done = await ns.prompt('Done?', { type: 'boolean' });
    }
  }
}
