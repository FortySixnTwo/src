/** @param {NS} ns */
export async function main(ns) {
	//Target server
	var hostname = "joesguns";
	//Target balance threshold
	var balanceThreshold = ns.getServerMaxMoney(hostname) * 0.8
	//Target security threshold
	var securityThreshold = ns.getServerMinSecurityLevel(hostname) + 1

	//Mainloop - hacks/weakens and grows until killed
	while(true) {
		//If current security level is above our threshold, weaken to reduce it
		if (ns.getServerSecurityLevel(hostname) > securityThreshold) {
			ns.print("Weakening")
			await ns.weaken(hostname);
		}
		//If current balance below balance threshold, grow to increase it
		if (ns.getServerMoneyAvailable(hostname) < balanceThreshold) {
			ns.print("growing")
			await ns.grow(hostname);
		}

		if (ns.getServerSecurityLevel(hostname) > securityThreshold) {
			ns.print("Weakening")
			await ns.weaken(hostname);
		}
		
		//hack and take the money
		if (ns.getServerMoneyAvailable(hostname) > balanceThreshold) {
			await ns.hack(hostname);
		}
		await ns.sleep(500)
	}	

}