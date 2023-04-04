/** @param {NS} ns */
import { Network } from '@/servers/Network';
import { Server } from '@/servers/Server.js';
import { scan } from '@/early/scan.js';
import {
  hackAmount,
  hackSec,
  growAmount,
  growSec,
  hackRam,
  growRam,
  weakenRam,
  weakenAmount,
} from '@/batch/hackingConstants.js';

export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();
  //ns.resizeTail(1280, 720);

  let servers = await scan(ns);
  let batches = new Set();

  while (true) {
    await compromiseServers(ns, servers);
    let targets = getTargets(ns, servers);
    let botnet = getBots(ns, servers);

    //Run a batch aimed at every target server until an error (no ram, hopefully) occurs.
    for (let target of targets) {
      if (!batches.keys().includes(target)) {
        try {
          let batch = await getBatch(ns, target, botnet);
          batches.add(target, batch);
        } catch (error) {
          ns.print(error);
          ns.sleep(600);
        }
      }
    }

    //Check if a batch's pid exists with the hostname parameters and remove it from the list if not.
    for (let [host, pid] of batches.entries()) {
      if (!ns.isRunning(host, pid)) {
        batches.delete(pid);
      }
    }
    await ns.sleep(600);
  }
}
//@TODO
async function getPrepBatch(ns, target, botnet) {
  if (target.securityLevel == target.securityMin) {
    let growThreads = ns.growthAnalyze(target.hostname, target.maxMoney / target.AvailableMoney);
    let weakenThreads = target.securityLevel - growThreads * growSec;
    while (!(growThreads + weakenThreads <= botnet.threadCount(growRam))) {
      growThreads = growThreads * 0.8;
      weakenThreads = weakenThreads * 0.8;
    }
    let pid = 0;
    while (growThreads > 0 && weakenThreads > 0) {
      for (let host of botnet) {
        pid = await ns.exec('/batch/weaken.js', host.hostname, weakenThreads, target.hostname);
        await ns.exec('/batch/grow.js', target.hostname, growThreads, target.hostname);
      }
    }
    return pid;
  }
}

async function getBatch(ns, target, botnet) {
  if (target.securityLevel == target.securityMin && target.AvailableMoney == target.maxMoney) {
    //return await getHwgwBatch(ns, target, botnet);
  } else if (target.AvailableMoney == target.maxMoney) {
    return await getPrepBatch(ns, target, botnet);
  }
}

async function getTargets(ns, servers) {
  let network = new Network(ns, servers);
  network.displayServers();
  network.filterServersBy('maxMoney > 0 && hasAdminRights');
  network.displayServers();
  network.sortServersBy('maxMoney');
  return network;
}

async function getBots(ns, servers) {
  let network = new Network(ns, servers);
  network.filterServersBy('maxRam > 0 && hasAdminRights');
  network.sortServersBy('maxRam');
  return network;
}

async function compromiseServers(ns, servers) {
  for (let server of servers) {
    try {
      //ns.print('Trying to crack server.');
      ns.brutessh(server);
      ns.ftpcrack(server);
      ns.relaysmtp(server);
      ns.httpworm(server);
      ns.sqlinject(server);
    } catch {
      //ns.print('Failed to crack server? Probably?');
    }

    try {
      //ns.print('Trying to nuke server.');
      ns.nuke(server);
    } catch {
      //ns.print('Failed to nuke, probably?');
    }
  }
}
