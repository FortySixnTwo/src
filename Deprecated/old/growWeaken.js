/** @param {NS} ns */
export async function main(ns) {
    var hostName = "joesguns";
    var balanceThreshold = ns.getServerMaxMoney(hostName) * 0.9;
    //Target security threshold
    var securityThreshold = ns.getServerMinSecurityLevel(hostName) + 3;
    while (true) {
        //If current balance below balance threshold, grow to increase it
        ns.print(ns.getServerMoneyAvailable(hostName), " ", balanceThreshold);
        if (ns.getServerMoneyAvailable(hostName) < balanceThreshold) {
            await ns.grow(hostName);
            ns.print("Growing to ", ns.getServerMoneyAvailable(hostName));
        }
        if (ns.getServerSecurityLevel(hostName) > securityThreshold) {
            await ns.weaken(hostName);
            ns.print("Weakening");
        }
        await ns.sleep(250);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3Jvd1dlYWtlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9EZXByZWNhdGVkL29sZC9ncm93V2Vha2VuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHFCQUFxQjtBQUNyQixNQUFNLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxFQUFFO0lBQzVCLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQTtJQUN6QixJQUFJLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUE7SUFDM0QsMkJBQTJCO0lBQzNCLElBQUksaUJBQWlCLEdBQUcsRUFBRSxDQUFDLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUNsRSxPQUFPLElBQUksRUFBRTtRQUNaLGlFQUFpRTtRQUNqRSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQTtRQUNyRSxJQUFJLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsR0FBRyxnQkFBZ0IsRUFBRTtZQUM1RCxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDeEIsRUFBRSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7U0FDN0Q7UUFFRCxJQUFJLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxpQkFBaUIsRUFBRTtZQUM1RCxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDMUIsRUFBRSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQTtTQUNyQjtRQUdELE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUNsQjtBQUVILENBQUMifQ==