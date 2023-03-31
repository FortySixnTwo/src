/** @param {NS} ns */
export async function main(ns) {
	var servers = ns.scan("home")
	var script = "zer0.js"
	while (servers.length > 0) {
		let server = servers.shift();
		
		if (ns.hasRootAccess(server)) {
			ns.scp(script, server);
			 ns.exec(script, server, ns.getServerMaxRam(server) / ns.getScriptRam(script));
		}
	}
}