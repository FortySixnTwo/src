/** @param {NS} ns */
export async function main(ns) {
	ns.tail()
	let servers = findBots(ns, await depthScan(ns, "home"));
	let targets = findProfitable(ns, servers);
	
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
			output.push(ns.getServer(server));
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
	
	await ns.nuke(target);
}

export function findProfitable(ns, servers) {
	let pHacking = ns.getHackingLevel();
	let viable = []

	for (let server of servers) {

		if (server["requiredHackingSkill"] <= (pHacking / 3) && server["moneyMax"] > 0) {
			viable.push(server)
		}

	}
	
	let output = viable.sort(({moneyMax:a}, {moneyMax:b}) => b-a);

	for (let server of output) {
		ns.print(server["hostname"], " $= ", server["moneyMax"])
	}

	return output

}

export function findBots(ns, servers) {
	let viable = [];

	for (let server of servers) {
		if (server["maxRam"] > 0) {
			viable.push(server);
		}
	}

	
	let output = viable.sort(({maxRam:a}, {maxRam:b}) => b-a);

	for (let server of output) {
		ns.print(server["hostname"], " RAM ", server["maxRam"])
	}

	return output
}