/** @param {NS} ns */
export async function main(ns) {
	//Target server
	var hostname = "zer0";
	//Target balance threshold
	var balanceThreshold = ns.getServerMaxMoney(hostname) * 0.8
	//Target security threshold
	var securityThreshold = ns.getServerMinSecurityLevel + 0.05

	//If possible open target SSH using BruteSSH
	if (ns.fileExists("BruteSSH.exe", "home")) {
		ns.brutessh(hostname);
	}

	//Gain root access with NUKE if not already done
	if (ns.hasRootAccess(hostname) == false) {
		ns.nuke(hostname);
	}

	//Run it's self in another thread if there's RAM free on the server
	if (ns.getServerMaxRam >= 3.8) {
		ns.run(zer0.js);
	}

	//Mainloop - hacks/weakens and grows until killed
	while(true) {
		//If current security level is above our threshold, weaken to reduce it
		if (ns.getServerSecurityLevel(hostname) > securityThreshold) {
			ns.weaken(hostname);
		}
		//If current balance below balance threshold, grow to increase it
		if (ns.getServerMoneyAvailable(hostname) > balanceThreshold) {
			ns.grow(hostname);
		}
		//hack and take the money
		await ns.hack(hostname);
	}

}