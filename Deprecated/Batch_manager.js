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
        let hackAmount = ns.getServerMaxMoney(target);
        let hackThreads = ns.hackAnalyzeThreads(target);
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
    return threads;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmF0Y2hfbWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9EZXByZWNhdGVkL0JhdGNoX21hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscUJBQXFCO0FBQ3JCLE1BQU0sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLEVBQUU7SUFDNUIsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDO0lBQ3hCLElBQUksT0FBTyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsZUFBZSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ3BFLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztJQUNyQixJQUFJLE9BQU8sR0FBRyxNQUFNLGVBQWUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDaEQsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyQixtQkFBbUI7SUFDbkIsSUFBSSxPQUFPLEdBQUcsTUFBTSxhQUFhLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUUxRCxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRWxCLE9BQU8sSUFBSSxFQUFFO1FBQ1osZUFBZTtRQUNmLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDN0MsSUFBSSxXQUFXLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBRSxDQUFBO0tBQ2hEO0FBQ0YsQ0FBQztBQUVELE1BQU0sQ0FBQyxLQUFLLFVBQVUsZUFBZSxDQUFDLEVBQUUsRUFBRSxRQUFRO0lBQ2pELDhFQUE4RTtJQUM5RSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDaEIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUUvQixtRkFBbUY7SUFDbkYsSUFB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