/** @param {NS} ns */

async function getServers(ns) {
  const root = 'home';
  const visited = [];
  const stack = [root];

  while (stack.length > 0) {
    const current = stack.pop();

    if (!visited.includes(current)) {
      visited.push(current);
      //ns.print(`Currently traversing ${current}`);
      const connections = await ns.scan(current);
      for (const next of connections.reverse()) {
        if (next !== root && !visited.includes(next)) {
          stack.push(next);
        }
      }
    }
  }
  return visited;
}

function threadCount(ns, hostname, scriptRam) {
  let threads = 0;

  threads = (ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname)) / scriptRam;
  return Math.floor(threads);
}

export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();

  const servers = await getServers(ns);
  const targetServer = ns.args[0];
  const scriptRam = 1.75;
  //ns.print(servers);

  // Infinite loop that does a bunch of stuff
  while (true) {
    for (let server of servers) {
      //ns.print(server);
      if (ns.hasRootAccess(server)) {
        let availableThreads = threadCount(ns, server, scriptRam);
        if (availableThreads > 1) {
          if (ns.getServerSecurityLevel(targetServer) > ns.getServerMinSecurityLevel(targetServer)) {
            ns.print(`Executing weaken on ${server} with ${availableThreads} threads, aimed at ${targetServer}.`);
            ns.scp('/batch/weaken.js', server);
            ns.exec('/batch/weaken.js', server, availableThreads, targetServer);
          } else if (ns.getServerMoneyAvailable(targetServer) < ns.getServerMaxMoney(targetServer)) {
            ns.print(`Executing grow on ${server} with ${availableThreads} threads, aimed at ${targetServer}.`);
            ns.scp('/batch/grow.js', server);
            ns.exec('/batch/grow.js', server, availableThreads, targetServer);
          } else {
            ns.print(`Executing hack on ${server} with ${availableThreads} threads, aimed at ${targetServer}.`);
            ns.scp('/batch/hack.js', server);
            ns.exec('/batch/hack.js', server, availableThreads, targetServer);
          }
        }
      } else {
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
    await ns.sleep(600);
  }
}
