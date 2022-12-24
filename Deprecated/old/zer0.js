/** @param {NS} ns */
export async function main(ns) {
    //Target server
    var hostname = "zer0";
    //Target balance threshold
    var balanceThreshold = ns.getServerMaxMoney(hostname) * 0.8;
    //Target security threshold
    var securityThreshold = ns.getServerMinSecurityLevel + 0.05;
    //If possible open target SSH using BruteSSH
    if (ns.fileExists("BruteSSH.exe", "home")) {
        ns.brutessh(hostname);
    }
    //Gain root access with NUKE if not already done
    if (ns.hasRootAccess(hostname) == false) {
        ns.nuke(hostname);
    }
    //Run it's self in another thread if there's RAM free on the server
    if (ns.getServerMaxRam >= 3.8) {
        ns.run(zer0.js);
    }
    //Mainloop - hacks/weakens and grows until killed
    while (true) {
        //If current security level is above our threshold, weaken to reduce it
        if (ns.getServerSecurityLevel(hostname) > securityThreshold) {
            ns.weaken(hostname);
        }
        //If current balance below balance threshold, grow to increase it
        if (ns.getServerMoneyAvailable(hostname) > balanceThreshold) {
            ns.grow(hostname);
        }
        //hack and take the money
        await ns.hack(hostname);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemVyMC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9EZXByZWNhdGVkL29sZC96ZXIwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFCQUFxQjtBQUNyQixNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFFO0lBQzVCLGVBQWU7SUFDZixJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUM7SUFDdEIsMEJBQTBCO0lBQzFCLElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtJQUMzRCwyQkFBMkI7SUFDM0IsSUFBSSxpQkFBaUIsR0FBRyxFQUFFLENBQUMseUJBQXlCLEdBQUcsSUFBSSxDQUFBO0lBRTNELDRDQUE0QztJQUM1QyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxFQUFFO1FBQzFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDdEI7SUFFRCxnREFBZ0Q7SUFDaEQsSUFBSSxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssRUFBRTtRQUN4QyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2xCO0lBRUQsbUVBQW1FO0lBQ25FLElBQUksRUFBRSxDQUFDLGVBQWUsSUFBSSxHQUFHLEVBQUU7UUFDOUIsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDaEI7SUFFRCxpREFBaUQ7SUFDakQsT0FBTSxJQUFJLEVBQUU7UUFDWCx1RUFBdUU7UUFDdkUsSUFBSSxFQUFFLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDLEdBQUcsaUJBQWlCLEVBQUU7WUFDNUQsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNwQjtRQUNELGlFQUFpRTtRQUNqRSxJQUFJLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxnQkFBZ0IsRUFBRTtZQUM1RCxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ2xCO1FBQ0QseUJBQXlCO1FBQ3pCLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUN4QjtBQUVGLENBQUMifQ==