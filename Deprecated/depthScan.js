/** @param {NS} ns */
export async function main(ns) {
    var script = "hack_template.js";
    var servers = await depthScan(ns, "home");
    while (servers.length > 0) {
        let server = servers.shift();
        let serverRAM = ns.getServerMaxRam(server);
        let scriptRAM = ns.getScriptRam(script);
        let threads = Math.floor(serverRAM / scriptRAM);
        if (threads != 0) {
            ns.print(ns.getServerUsedRam(server));
            ns.print(threads, " * ", scriptRAM, " = ", scriptRAM * threads);
            ns.kill(script, server);
            await ns.sleep(600);
            if (server != "home") {
                ns.rm(script, server);
                ns.scp(script, server);
            }
            else {
                threads -= 10;
            }
            ns.exec(script, server, threads);
        }
    }
}
export async function depthScan(ns, target) {
    //Hold target name, make array for output, and assign scan results to variable
    var output = [];
    var result = ns.scan(target);
    //Removes the first scan results as this is the parent, to avoid infinite recursion
    if (target != "home") {
        result.shift();
    }
    while (result.length > 0) {
        let server = result.shift();
        //Check for root and get it if not
        if (ns.hasRootAccess(server) == false) {
            //ns.print("Getting Root Access on " + target);
            await getRootAccess(ns, server);
        }
        //Add server to output
        if (output.includes(server) == false && ns.hasRootAccess(server)) {
            ns.print("Adding " + server + " to output.");
            output.push(server);
            //Recursively run this function on current server and push return to output
            let result2 = await depthScan(ns, server);
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
export async function getRootAccess(ns, target) {
    var ports = ns.getServerNumPortsRequired(target);
    if (ports > 4 && ns.fileExists("SQLInject.exe", "home")) {
        await ns.sqlinject(target);
    }
    if (ports > 3 && ns.fileExists("HTTPWorm.exe", "home")) {
        await ns.httpworm(target);
    }
    if (ports > 2 && ns.fileExists("RelaySMTP.exe", "home")) {
        await ns.relaysmtp(target);
        ns.print("SMTP");
    }
    if (ports > 1 && ns.fileExists("FTPCrack.exe", "home")) {
        await ns.ftpcrack(target);
        ns.print("FTP");
    }
    if (ports > 0 && ns.fileExists("BruteSSH.exe", "home")) {
        ns.print("Brute");
        await ns.brutessh(target);
    }
    if (ports == 0) {
        await ns.nuke(target);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwdGhTY2FuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL0RlcHJlY2F0ZWQvZGVwdGhTY2FuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFCQUFxQjtBQUNyQixNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFFO0lBQzVCLElBQUksTUFBTSxHQUFHLGtCQUFrQixDQUFDO0lBQ2hDLElBQUksT0FBTyxHQUFHLE1BQU0sU0FBUyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUUxQyxPQUFPLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQzFCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM3QixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNDLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLENBQUM7UUFFaEQsSUFBSSxPQUFPLElBQUksQ0FBQyxFQUFFO1lBQ2pCLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7WUFDckMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsU0FBUyxHQUFHLE9BQU8sQ0FBRSxDQUFBO1lBQ2hFLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNuQixJQUFJLE1BQU0sSUFBSSxNQUFNLEVBQUU7Z0JBQ3JCLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxD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