/** @param {NS} ns */
export async function main(ns) {
    let host = "home";
    let target = "silver-helix";
    let scriptRAM = 1.75;
    let maxThreads = Math.floor((ns.getServerMaxRam(host) / scriptRAM));
    ns.print("Server Threads= ", maxThreads);
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
        await ns.sleep(ns.getWeakenTime(target) * 0.5);
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
        let timingOffset = 600;
        //Hack if Money full
        await batchHack(ns, target);
        //Hack will always complete before weaken
        await ns.sleep(timingOffset);
        //Weaken if security not minimum
        await batchWeak(ns, target);
        //Wait for the weakenTime - growTime + offset, then start the next grow so it happens after the weaken completes
        await ns.sleep(ns.getWeakenTime(target) + timingOffset);
        //Grow if below max money
        await batchGrow(ns, target);
        //Grow will always complete before weaken
        await ns.sleep(ns.getGrowTime(target) + timingOffset);
        //Weaken if security not minimum
        await batchWeak(ns, target, 1);
        w; //Wait for weakenTime - hackTime + offset then start next batch
        await ns.sleep(ns.getWeakenTime(target) + timingOffset);
    }
}
export async function batchHack(ns, target) {
    //Enough threads to take 50% host money
    let hackThreads = ns.hackAnalyzeThreads(target, ns.getServerMaxMoney(target) * 0.5);
    ns.print(ns.getServerMoneyAvailable(target), " / ", ns.getServerMaxMoney(target));
    if (ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target)) {
        ns.run("hack.js", hackThreads, target);
    }
}
export async function batchGrow(ns, target) {
    //Enough threads to double server money
    let growThreads = ns.growthAnalyze(target, 2);
    ns.run("grow.js", growThreads, target);
}
export async function batchWeak(ns, target) {
    let targetSec = ns.getServerSecurityLevel(target);
    let targetMinSec = ns.getServerMinSecurityLevel(target);
    if (targetSec > targetMinSec) {
        //Find out how many threads are needed to weaken
        let weakenThreads = (targetSec - targetMinSec) / ns.weakenAnalyze(1);
        ns.run("weak.js", weakenThreads, target);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VxdWVudGlhbEJhdGNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL0RlcHJlY2F0ZWQvb2xkL3NlcXVlbnRpYWxCYXRjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxxQkFBcUI7QUFDckIsTUFBTSxDQUFDLEtBQUssVUFBVSxJQUFJLENBQUMsRUFBRTtJQUM1QixJQUFJLElBQUksR0FBRyxNQUFNLENBQUM7SUFDbEIsSUFBSSxNQUFNLEdBQUcsY0FBYyxDQUFDO0lBQzVCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztJQUNyQixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBR3BFLEVBQUUsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxDQUFDLENBQUE7SUFFeEMsT0FBTyxJQUFJLEVBQUU7UUFDWixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JDLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDbkMsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVuQyxvQkFBb0I7UUFDcEIsTUFBTSxTQUFTLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzVCLHlDQUF5QztRQUN6QyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbEIsZ0NBQWdDO1FBQ2hDLE1BQU0sU0FBUyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1QixnSEFBZ0g7UUFDaEgsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUE7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