/** @param {NS} ns */
export async function main(ns) {
	//Open Log
	ns.tail();
	//Silence logs
	ns.disableLog("disableLog")
	ns.disableLog("scan")
	ns.disableLog("brutessh")
	ns.disableLog("ftpcrack")
	ns.disableLog("relaysmtp")
	ns.disableLog("httpworm")
	ns.disableLog("sqlinject")
	ns.disableLog("getHackingLevel")
	ns.disableLog("getServerRequiredHackingLevel")
	ns.disableLog("getServerNumPortsRequired")
	//Config
	let fileName = "servers.txt"



	while (true) {
		//Refresh Server Data
		let servers = await recurseScan(ns, "home");
		//Print all "hostname" attributes - useful code
		//ns.print(servers.map(server => server["hostname"]));
		//Check for compromisable servers & Root them
		for (let index in servers){
			let server = servers[index]
			//ns.print(server["hostname"])
			if (!server["hasAdminRights"]) {
				await getRootAccess(ns, server["hostname"])
			}
		}

		//Save servers to file
		ns.write(fileName, JSON.stringify(servers, null, 4), "w")
		//Sleep
		await ns.sleep(60000)
	}

	//Print all "hostname" attributes - useful code
	//ns.print(servers.map(server => server["hostname"]));

}

//Returns a list of all server objects
export async function recurseScan (ns, target) {
	//Hold target name, make array for output, and assign scan results to variable
	var output = [];
	var result = ns.scan(target);

	//Removes the first scan results as this is the parent, to avoid infinite recursion
	if (target != "home") {
		result.shift();
	}

	while (result.length > 0) {
		let server = result.shift();

		//Add server to output
		if (output.includes(server) == false) {
			ns.print("Adding " + server + " to output.")
			output.push(ns.getServer(server));
			//Recursively run this function on current server and push return to output
			let result2 = await recurseScan(ns, server);

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
	let viablePorts = 0

	if (ports > 4 && ns.fileExists("SQLInject.exe", "home")) {
		await ns.sqlinject(target);
	}
	if (ports > 3 && ns.fileExists("HTTPWorm.exe", "home")) {
		await ns.httpworm(target);
	}
	if (ports > 2 && ns.fileExists("RelaySMTP.exe", "home")) {
		await ns.relaysmtp(target);
	}
	if (ports > 1 && ns.fileExists("FTPCrack.exe", "home")) {
		await ns.ftpcrack(target);
	}
	if (ports > 0 && ns.fileExists("BruteSSH.exe", "home")) {
		await ns.brutessh(target);
	}

	if (ns.getHackingLevel() > ns.getServerRequiredHackingLevel(target) && viablePorts > ports) {
		await ns.nuke(target);
	}
	
}

export async function saveFile(ns, file, input) {

}