/** @param {NS} ns */
export async function main(ns) {
  const name = ns.args[0];
  const servers = ns.getPurchasedServers();
  for (let i = 0; i < servers.length; i++) {
    let server = servers[i];
    ns.renamePurchasedServer(server, name + '-' + i);
  }
}
