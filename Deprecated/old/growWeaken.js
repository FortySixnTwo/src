/** @param {NS} ns */
export async function main(ns) {
	var hostName = "joesguns"
	var balanceThreshold = ns.getServerMaxMoney(hostName) * 0.9
	//Target security threshold
	var securityThreshold = ns.getServerMinSecurityLevel(hostName) + 3
	while (true) {
		//If current balance below balance threshold, grow to increase it
		ns.print(ns.getServerMoneyAvailable(hostName), " ", balanceThreshold)
		if (ns.getServerMoneyAvailable(hostName) < balanceThreshold) {
			await ns.grow(hostName);
			ns.print("Growing to ", ns.getServerMoneyAvailable(hostName))
		}

		if (ns.getServerSecurityLevel(hostName) > securityThreshold) {
			await ns.weaken(hostName);
			ns.print("Weakening")
		}


		await ns.sleep(250)
		}

}