/** @param {NS} ns */
export async function main(ns) {
	let host = "home";
	let target = "silver-helix";
	let scriptRAM = 1.75;
	let maxThreads = Math.floor((ns.getServerMaxRam(host) / scriptRAM));


	ns.print("Server Threads= ", maxThreads)

	while (true) {
		let wTime = ns.getWeakenTime(target);
		let gTime = ns.getGrowTime(target);
		let hTime = ns.getHackTime(target);

		//Hack if Money full
		await batchHack(ns, target);
		//Hack will always complete before weaken
		await ns.sleep(5);

		//Weaken if security not minimum
		await batchWeak(ns, target);
		//Wait for the weakenTime - growTime + offset, then start the next grow so it happens after the weaken completes
		await ns.sleep(ns.getWeakenTime(target) * 0.5)

		//Grow if below max money
		await batchGrow(ns, target);
		//Grow will always complete before weaken
		await ns.sleep(ns.getGrowTime(target) * 0.5);

		//Weaken if security not minimum
		await batchWeak(ns, target, 1);
		//Wait for weakenTime - hackTime + offset then start next batch
		await ns.sleep(ns.getWeakenTime(target) * 0.5);
	}
}

export async function executeBatch(ns, target, threads) {
	while (true) {
	//Batch offset in ms
		let timingOffset = 600
		//Hack if Money full
		await batchHack(ns, target);
		//Hack will always complete before weaken
		await ns.sleep(timingOffset);

		//Weaken if security not minimum
		await batchWeak(ns, target);
		//Wait for the weakenTime - growTime + offset, then start the next grow so it happens after the weaken completes
		await ns.sleep(ns.getWeakenTime(target) + timingOffset)

		//Grow if below max money
		await batchGrow(ns, target);
		//Grow will always complete before weaken
		await ns.sleep(ns.getGrowTime(target) + timingOffset);

		//Weaken if security not minimum
		await batchWeak(ns, target, 1);
	w	//Wait for weakenTime - hackTime + offset then start next batch
		await ns.sleep(ns.getWeakenTime(target) + timingOffset);
	}
}

export async function batchHack(ns, target) {
	//Enough threads to take 50% host money
	let hackThreads = ns.hackAnalyzeThreads(target, ns.getServerMaxMoney(target) * 0.5)
	ns.print(ns.getServerMoneyAvailable(target), " / ", ns.getServerMaxMoney(target))
	if (ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target)) {
		ns.run("hack.js", hackThreads, target)
	}
}

export async function batchGrow(ns, target) {
	//Enough threads to double server money
	let growThreads = ns.growthAnalyze(target, 2)
	ns.run("grow.js", growThreads, target);
	}

export async function batchWeak(ns, target) {
	let targetSec = ns.getServerSecurityLevel(target);
	let targetMinSec = ns.getServerMinSecurityLevel(target)

	if (targetSec > targetMinSec) {
		//Find out how many threads are needed to weaken
		let weakenThreads = (targetSec - targetMinSec) / ns.weakenAnalyze(1)
		ns.run("weak.js", weakenThreads, target);
	}
}