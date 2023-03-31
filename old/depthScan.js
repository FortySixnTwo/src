/** @param {NS} ns */
export async function main(ns) {
	var script = "hack_template.js";
	var servers = await depthScan(ns, "home");

	while (servers.length > 0) {
		let server = servers.shift();
		let serverRAM = ns.getServerMaxRam(server);
		let scriptRAM = ns.getScriptRam(script);
		let threads = Math.floor(serverRAM / scriptRAM);

		if (threads != 0) {
			ns.print(ns.getServerUsedRam(server))
			ns.print(threads, " * ", scriptRAM, " = ", scriptRAM * threads,)
			ns.kill(script, server);
			await ns.sleep(600)
			if (server != "home") {
				ns.rm(script, server)
				ns.scp(script, server);
			} else {
				threads -= 10;
			}
			ns.exec(script, server, threads);
		}

	}
	
}

export async function depthScan(ns, target) {
	//Hold target name, make array for output, and assign scan results to variable
	var output = [];
	var result = ns.scan(target);

	//Removes the first scan results as this is the parent, to avoid infinite recursion
	if (target != "home") {
		result.shift();
	}

	while (result.length > 0) {
		let server = result.shift();

		//Check for root and get it if not
		if (ns.hasRootAccess(server) == false) {
			//ns.print("Getting Root Access on " + target);
			await getRootAccess(ns, server);
		}

		//Add server to output
		if (output.includes(server) == false && ns.hasRootAccess(server)) {
			ns.print("Adding " + server + " to output.")
			output.push(server);
			//Recursively run this function on current server and push return to output
			let result2 = await depthScan(ns, server);

			while (result2.length > 0) {
				let server2 = result2.shift();
				if (output.includes(result2) == false) {
					output.push(server2);
				}
			}
		}

	}
	return output;
}

export async function getRootAccess(ns, target) {
	var ports = ns.getServerNumPortsRequired(target);

	if (ports > 4 && ns.fileExists("SQLInject.exe", "home")) {
		await ns.sqlinject(target);
	}
	if (ports > 3 && ns.fileExists("HTTPWorm.exe", "home")) {
		await ns.httpworm(target);
	}
	if (ports > 2 && ns.fileExists("RelaySMTP.exe", "home")) {
		await ns.relaysmtp(target);
		ns.print("SMTP")
	}
	if (ports > 1 && ns.fileExists("FTPCrack.exe", "home")) {
		await ns.ftpcrack(target);
		ns.print("FTP")
	}
	if (ports > 0 && ns.fileExists("BruteSSH.exe", "home")) {
		ns.print("Brute")
		await ns.brutessh(target);
	}

	if (ports == 0) {
		await ns.nuke(target);
	}
	
}