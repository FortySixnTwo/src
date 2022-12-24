/** @param {NS} ns */
export async function main(ns) {
	let target = "joesguns";
	let scripts = ["Batch_weaken.js", "Batch_grow.js", "Batch_Hack.js"];
	let scriptRAM = 1.75;
	let servers = await getOwnedServers(ns, "home");
	servers.push("home");
	//Threads available
	var threads = await getMaxThreads(ns, servers, scriptRAM);

	ns.print(threads);

	while (true) {
		//% hack amount
		let hackPer = 30; 
		let hackAmount = ns.getServerMaxMoney(target)
		let hackThreads = ns.hackAnalyzeThreads(target,)
	}
}

export async function getOwnedServers(ns, hostName) {
	//Hold target name, make array for output, and assign scan results to variable
	let output = [];
	let result = ns.scan(hostName);

	//Removes the first scan results as this is the parent, to avoid infinite recursion
	if (hostName != "home") {
		result.shift();
	}

	while (result.length > 0) {
		let server = result.shift();

		//Add server to output
		if (output.includes(server) == false && ns.hasRootAccess(server)) {
			//ns.print("Adding " + server + " to output.");
			output.push(server);
			//Recursively run this function on current server and push return to output
			let result2 = await getOwnedServers(ns, server);

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

export async function getMaxThreads(ns, servers, scriptRAM) {
	let threads = 0;
	//ns.print(servers.length);
	while (servers.length > 0) {
		let server = servers.shift();
		let serverRAM = ns.getServerMaxRam(server);
		threads += Math.floor(serverRAM / scriptRAM);
		//ns.print(server, " ", serverRAM, " / ", scriptRAM, " = ", Math.floor(serverRAM / scriptRAM));
	}

	return threads
}

export async function getRequiredThreads(ns, target, scripts) {

}

export async function prepServer(ns, target, scripts) {
		//Upload/update scripts, get min security level and max money
		for (const script of scripts) {
			ns.print(script);
			await ns.rm(script, target);
			await ns.scp(script, target);
			await ns.sleep(0);
		}

	while (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) || ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
		let weakenThreads = Math.floor((ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target)) / ns.weakenAnalyze(1));
		let growThreads = Math.floor(ns.growthAnalyze(target, (ns.getServerMaxMoney / ns.getServerMoneyAvailable)));
		await ns.exec(scripts[0], target, weakenThreads);
		await ns.exec(scripts[1], target, growThreads);
		await ns.sleep(60);
	}
}

export async function executeBatch(ns, target, scripts) {

}