/** @param {NS} ns */
export async function main(ns) {
	let host = "home";
	let target = "joesguns";
	let scriptRAM = 1.75;
	let maxThreads = Math.floor((ns.getServerMaxRam(host) / scriptRAM));


	ns.print("Server Threads= ", maxThreads)

	while (true) {
		let timingOffset = 50;

		//Weaken if security not minimum
		await batchWeak(ns, target);
		//Wait for the weakenTime - growTime + offset, then start the next grow so it happens after the weaken completes
		await ns.sleep(timingOffset * 2)

		//Weaken if security not minimum
		await batchWeak(ns, target);
		//Wait for weakenTime - hackTime + offset then start next batch
		await ns.sleep(ns.getWeakenTime(target) - ns.getGrowTime(target) - timingOffset);

		//Grow if below max money
		await batchGrow(ns, target);
		//Grow will always complete before weaken
		await ns.sleep(ns.getGrowTime(target) - ns.getHackTime(target) - timingOffset);

		//Hack if Money full
		await batchHack(ns, target);
		//Hack will always complete before weaken
		await ns.sleep(timingOffset * 2);
	}
}

export async function executeBatch(ns, target, threads) {
	while (true) {
	//Batch offset in ms
		let timingOffset = 50;

		//Weaken if security not minimum
		await batchWeak(ns, target);
		//Wait for the weakenTime - growTime + offset, then start the next grow so it happens after the weaken completes
		await ns.sleep(timingOffset * 2)

		//Weaken if security not minimum
		await batchWeak(ns, target);
		//Wait for weakenTime - hackTime + offset then start next batch
		await ns.sleep(ns.getWeakenTime(target) - ns.getGrowTime(target) - timingOffset);

		//Grow if below max money
		await batchGrow(ns, target);
		//Grow will always complete before weaken
		await ns.sleep(ns.getGrowTime(target) - ns.getHackTime(target) - timingOffset);

		//Hack if Money full
		await batchHack(ns, target);
		//Hack will always complete before weaken
		await ns.sleep(timingOffset);
	}
}

export async function batchHack(ns, target) {
	//Enough threads to take 50% host money
	let hackThreads = ns.hackAnalyzeThreads(target, ns.getServerMaxMoney(target) * 0.5)
	ns.print(ns.getServerMoneyAvailable(target), " / ", ns.getServerMaxMoney(target))
	if (ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target)) {
		ns.run("hack.js", hackThreads, target, Math.random())
	}
}

export async function batchGrow(ns, target) {
	//Enough threads to double server money
	let growThreads = ns.growthAnalyze(target, 2)
	ns.run("grow.js", growThreads, target, Math.random());
	}

export async function batchWeak(ns, target) {
	let targetSec = ns.getServerSecurityLevel(target);
	let targetMinSec = ns.getServerMinSecurityLevel(target)

	if (targetSec > targetMinSec) {
		//Find out how many threads are needed to weaken, run with 10 minimum just in case
		let weakenThreads = Math.max((targetSec - targetMinSec) / ns.weakenAnalyze(1), 10)
		ns.run("weak.js", weakenThreads, target, Math.random());
	}
}