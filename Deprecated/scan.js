/** @param {NS} ns */
export async function main(ns) {
    //Open Log
    ns.tail();
    //Silence logs
    ns.disableLog("disableLog");
    ns.disableLog("scan");
    ns.disableLog("brutessh");
    ns.disableLog("ftpcrack");
    ns.disableLog("relaysmtp");
    ns.disableLog("httpworm");
    ns.disableLog("sqlinject");
    ns.disableLog("getHackingLevel");
    ns.disableLog("getServerRequiredHackingLevel");
    ns.disableLog("getServerNumPortsRequired");
    //Config
    let fileName = "servers.txt";
    while (true) {
        //Refresh Server Data
        let servers = await recurseScan(ns, "home");
        //Print all "hostname" attributes - useful code
        //ns.print(servers.map(server => server["hostname"]));
        //Check for compromisable servers & Root them
        for (let index in servers) {
            let server = servers[index];
            //ns.print(server["hostname"])
            if (!server["hasAdminRights"]) {
                await getRootAccess(ns, server["hostname"]);
            }
        }
        //Save servers to file
        ns.write(fileName, JSON.stringify(servers, null, 4), "w");
        //Sleep
        await ns.sleep(60000);
    }
    //Print all "hostname" attributes - useful code
    //ns.print(servers.map(server => server["hostname"]));
}
//Returns a list of all server objects
export async function recurseScan(ns, target) {
    //Hold target name, make array for output, and assign scan results to variable
    var output = [];
    var result = ns.scan(target);
    //Removes the first scan results as this is the parent, to avoid infinite recursion
    if (target != "home") {
        result.shift();
    }
    while (result.length > 0) {
        let server = result.shift();
        //Add server to output
        if (output.includes(server) == false) {
            ns.print("Adding " + server + " to output.");
            output.push(ns.getServer(server));
            //Recursively run this function on current server and push return to output
            let result2 = await recurseScan(ns, server);
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
    let viablePorts = 0;
    if (ports > 4 && ns.fileExists("SQLInject.exe", "home")) {
        await ns.sqlinject(target);
    }
    if (ports > 3 && ns.fileExists("HTTPWorm.exe", "home")) {
        await ns.httpworm(target);
    }
    if (ports > 2 && ns.fileExists("RelaySMTP.exe", "home")) {
        await ns.relaysmtp(target);
    }
    if (ports > 1 && ns.fileExists("FTPCrack.exe", "home")) {
        await ns.ftpcrack(target);
    }
    if (ports > 0 && ns.fileExists("BruteSSH.exe", "home")) {
        await ns.brutessh(target);
    }
    if (ns.getHackingLevel() > ns.getServerRequiredHackingLevel(target) && viablePorts > ports) {
        await ns.nuke(target);
    }
}
export async function saveFile(ns, file, input) {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nhbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9EZXByZWNhdGVkL3NjYW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEscUJBQXFCO0FBQ3JCLE1BQU0sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUFDLEVBQUU7SUFDNUIsVUFBVTtJQUNWLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNWLGNBQWM7SUFDZCxFQUFFLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFBO0lBQzNCLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDckIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUN6QixFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ3pCLEVBQUUsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDMUIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUN6QixFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQzFCLEVBQUUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtJQUNoQyxFQUFFLENBQUMsVUFBVSxDQUFDLCtCQUErQixDQUFDLENBQUE7SUFDOUMsRUFBRSxDQUFDLFVBQVUsQ0FBQywyQkFBMkIsQ0FBQyxDQUFBO0lBQzFDLFFBQVE7SUFDUixJQUFJLFFBQVEsR0FBRyxhQUFhLENBQUE7SUFJNUIsT0FBTyxJQUFJLEVBQUU7UUFDWixxQkFBcUI7UUFDckIsSUFBSSxPQUFPLEdBQUcsTUFBTSxXQUFXLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzVDLCtDQUErQztRQUMvQyxzREFBc0Q7UUFDdEQsNkNBQTZDO1FBQzdDLEtBQUssSUFBSSxLQUFLLElBQUksT0FBTyxFQUFDO1lBQ3pCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUMzQiw4QkFBOEI7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