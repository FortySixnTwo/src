/** @param {NS} ns */
export async function main(ns) {
    //Target server
    var hostname = "joesguns";
    //Target balance threshold
    var balanceThreshold = ns.getServerMaxMoney(hostname) * 0.8;
    //Target security threshold
    var securityThreshold = ns.getServerMinSecurityLevel(hostname) + 1;
    //Mainloop - hacks/weakens and grows until killed
    while (true) {
        //If current security level is above our threshold, weaken to reduce it
        if (ns.getServerSecurityLevel(hostname) > securityThreshold) {
            ns.print("Weakening");
            await ns.weaken(hostname);
        }
        //If current balance below balance threshold, grow to increase it
        if (ns.getServerMoneyAvailable(hostname) < balanceThreshold) {
            ns.print("growing");
            await ns.grow(hostname);
        }
        if (ns.getServerSecurityLevel(hostname) > securityThreshold) {
            ns.print("Weakening");
            await ns.weaken(hostname);
        }
        //hack and take the money
        if (ns.getServerMoneyAvailable(hostname) > balanceThreshold) {
            await ns.hack(hostname);
        }
        await ns.sleep(500);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFja190ZW1wbGF0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9EZXByZWNhdGVkL29sZC9oYWNrX3RlbXBsYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFCQUFxQjtBQUNyQixNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFFO0lBQzVCLGVBQWU7SUFDZixJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUM7SUFDMUIsMEJBQTBCO0lBQzFCLElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQTtJQUMzRCwyQkFBMkI7SUFDM0IsSUFBSSxpQkFBaUIsR0FBRyxFQUFFLENBQUMseUJBQXlCLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBRWxFLGlEQUFpRDtJQUNqRCxPQUFNLElBQUksRUFBRTtRQUNYLHVFQUF1RTtRQUN2RSxJQUFJLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxpQkFBaUIsRUFBRTtZQUM1RCxFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFBO1lBQ3JCLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUMxQjtRQUNELGlFQUFpRTtRQUNqRSxJQUFJLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxnQkFBZ0IsRUFBRTtZQUM1RCxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFBO1lBQ25CLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN4QjtRQUVELElBQUksRUFBRSxDQUFDLHNCQUFzQixDQUFDLFFBQVEsQ0FBQyxHQUFHLGlCQUFpQixFQUFFO1lBQzVELEVBQUUsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDckIsTUFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzFCO1FBRUQseUJBQXlCO1FBQ3pCLElBQUksRUFBRSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxHQUFHLGdCQUFnQixFQUFFO1lBQzVELE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN4QjtRQUNELE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUNuQjtBQUVGLENBQUMifQ==