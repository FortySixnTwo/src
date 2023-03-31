/** @param {NS} ns */
export async function main(ns) {

    const target = ns.args[0];
    const maxBatches = 3;

    ns.disableLog('ALL');
    ns.tail()

    // Get root access if we don't have it
    if (!ns.hasRootAccess(target)) {
        getRootAccess(ns, target);
    }


    // Prepare server, max money & min security
    ns.print("Prepping")
    await prepServer(ns, target);
    ns.print("Done, executing")
    // Execute batches until theres x batches running
    await executeBatches(ns, target, maxBatches);
    ns.print("Done")
}

export async function getRootAccess(ns, target) {
    // If we have the BruteSSH.exe program, use it to open the SSH Port
    // on the target server
    if (ns.fileExists("BruteSSH.exe", "home")) {
        ns.brutessh(target);
    }
    if (ns.fileExists("RelaySMTP.exe", "home")) {
        ns.relaysmtp(target);
    }
    if (ns.fileExists("FTPCrack.exe", "home")) {
        ns.ftpcrack(target);
    }
    if (ns.fileExists("HTTPWorm.exe", "home")) {
        ns.httpworm(target);
    }
    if (ns.fileExists("SQLInject,exe", "home")) {
        ns.sqlinject(target);
    }

    // Get root access to target server
    ns.nuke(target);
}


export async function prepServer(ns, target) {
    // Grow & weaken if the server's below the max/min values.
    let serverMinSec = ns.getServerMinSecurityLevel(target);
    let serverCurSec = ns.getServerSecurityLevel(target);
    let serverMoney = ns.getServerMoneyAvailable(target);
    let serverMoneyCap = ns.getServerMaxMoney(target);
    let host = ns.getHostname();
    let scriptSize = 1.75;

    let availableThreads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / 1.75);

    while (serverMinSec < serverCurSec || serverMoney < serverMoneyCap) {
        serverMinSec = ns.getServerMinSecurityLevel(target);
        serverCurSec = ns.getServerSecurityLevel(target);
        serverMoney = ns.getServerMoneyAvailable(target);
        serverMoneyCap = ns.getServerMaxMoney(target);
        if (serverMinSec < serverCurSec) {
            let wThreads = await getWeakenThreads(ns, target, serverCurSec - serverMinSec);
            if (wThreads > availableThreads) {
                await batchWeaken(ns, target, availableThreads);
                await ns.sleep((ns.getHackTime(target) * 4) + 200);
            } else {
                await batchWeaken(ns, target, wThreads);
                
                await ns.sleep((ns.getHackTime(target) * 4) + 200);
            }
        } else if (serverMoney < serverMoneyCap) {
            let gThreads = await getGrowThreads(ns, target, (serverMoneyCap - serverMoney), serverMoney);
            if (gThreads > availableThreads) {
                await batchGrow(ns, target, availableThreads);
                await ns.sleep((ns.getHackTime(target) * 4) + 200);
            } else {
                await batchGrow(ns, target, gThreads);
                await ns.sleep((ns.getHackTime(target) * 4) + 200);
            }
            await ns.sleep(60);
        }
    }
}


export async function executeBatches(ns, target, maxBatches) {
    const offset = 500;
    const hTime = await ns.getHackTime(target);
    const gTime = hTime * 3.2;
    const weakTime = hTime * 4;
    //Percentage amount to hack, 0.3 = 30%
    const hackMult = 0.3;
    const hackAmount = ns.getServerMaxMoney(target) * hackMult;
    const hackSecIncrease = 0.006;
    const hThreads = await getHackThreads(ns, target, hackMult);
    ns.print("Batch thread vars:" + target + " " + hackMult + " " + hackAmount + " " + (ns.getServerMaxMoney(target) - hackAmount))
    const gThreads = await getGrowThreads(ns, target, hackAmount, ns.getServerMaxMoney(target) - hackAmount);
    const weaken1Threads = await getWeakenThreads(ns, hThreads * hackSecIncrease);
    const weaken2Threads = await getWeakenThreads(ns, gThreads * hackSecIncrease);

    const batchPids = new Set();
    ns.print(hThreads, gThreads, weaken1Threads, weaken2Threads)
    if (batchPids.length < maxBatches) {
        ns.print("Doing weakens");
        await batchWeaken(ns, target, weaken1Threads);
        await ns.sleep(offset * 2);
        ns.print("Doing weakens");
        let batchPid = await batchWeaken(ns, target, weaken2Threads);
        await ns.sleep(weakTime - gTime - offset);
        ns.print("Doing grows");
        await batchGrow(ns, target, gThreads);
        await ns.sleep(gTime - hTime - offset * 2);
        ns.print("Doing hacks");
        await batchHack(ns, target, hackThreads);
        batchPids.add(batchPid);
    }

    for (pid in batchPids) {
        if (!ns.isRunning(pid)) {
            batchPids.remove(pid);
        }
    }
    await ns.sleep(60);
}


export async function batchHack(ns, target, threads) {
    if (threads > 0) {
        return ns.run("hack.js", threads, target);
    } else {
        return 0;
    }
}

export async function batchGrow(ns, target, threads) {
    if (threads > 0) {
        return ns.run("grow.js", threads, target);
    } else {
        return 0;
    }
}

export async function batchWeaken(ns, target, threads) {
    if (threads > 0) {
        return ns.run("weaken.js", threads, target);;
    } else {
        return 0;
    }
}

// Divide the difference between current and minimum security by a single threads grow amount to return the amount of threads required
export async function getWeakenThreads(ns, amount) {
    const weakenAmount = 0.05;
    return Math.ceil(amount / weakenAmount);
}

export async function getHackThreads(ns, host, gain) {
    const targetAmount = ns.getServerMaxMoney(host) * gain;
    const threads = Math.ceil(ns.hackAnalyzeThreads(host, targetAmount));
    ns.print(targetAmount + " will take " + threads + " hack threads.");
    return threads;
}

export async function getGrowThreads(ns, host, gainAmount) {
    let gainMultiplier
    let threads = Math.ceil(ns.growthAnalyze(host, gainMultiplier));
    ns.print(`host: ${host}, Multiplier: ${gain}, Threads: ${threads}`);
    return threads;
}