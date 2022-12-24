/** @param {NS} ns */
export async function main(ns) {
    let host = "home";
    let target = "joesguns";
    let scriptRAM = 1.75;
    let maxThreads = Math.floor((ns.getServerMaxRam(host) / scriptRAM));
    ns.print("Server Threads= ", maxThreads);
    while (true) {
        let timingOffset = 50;
        //Weaken if security not minimum
        await batchWeak(ns, target);
        //Wait for the weakenTime - growTime + offset, then start the next grow so it happens after the weaken completes
        await ns.sleep(timingOffset * 2);
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
        await ns.sleep(timingOffset * 2);
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
    let hackThreads = ns.hackAnalyzeThreads(target, ns.getServerMaxMoney(target) * 0.5);
    ns.print(ns.getServerMoneyAvailable(target), " / ", ns.getServerMaxMoney(target));
    if (ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target)) {
        ns.run("hack.js", hackThreads, target, Math.random());
    }
}
export async function batchGrow(ns, target) {
    //Enough threads to double server money
    let growThreads = ns.growthAnalyze(target, 2);
    ns.run("grow.js", growThreads, target, Math.random());
}
export async function batchWeak(ns, target) {
    let targetSec = ns.getServerSecurityLevel(target);
    let targetMinSec = ns.getServerMinSecurityLevel(target);
    if (targetSec > targetMinSec) {
        //Find out how many threads are needed to weaken, run with 10 minimum just in case
        let weakenThreads = Math.max((targetSec - targetMinSec) / ns.weakenAnalyze(1), 10);
        ns.run("weak.js", weakenThreads, target, Math.random());
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VxdWVudGlhbEJhdGNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL0RlcHJlY2F0ZWQvc2VxdWVudGlhbEJhdGNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFCQUFxQjtBQUNyQixNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFFO0lBQzVCLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQztJQUNsQixJQUFJLE1BQU0sR0FBRyxVQUFVLENBQUM7SUFDeEIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFHcEUsRUFBRSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxVQUFVLENBQUMsQ0FBQTtJQUV4QyxPQUFPLElBQUksRUFBRTtRQUNaLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUV0QixnQ0FBZ0M7UUFDaEMsTUFBTSxTQUFTLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLGdIQUFnSDtRQUNoSCxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBRWhDLGdDQUFnQztRQUNoQyxNQUFNLFNBQVMsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDNUIsK0RBQStEO1FBQy9ELE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUM7UUFFakYseUJBQXlCO1FBQ3pCLE1BQU0sU0FBUyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1Qix5Q0FBeUM7UUFDekMsTUFBTSxFQUFFLENBQUMsS0FBSyxD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