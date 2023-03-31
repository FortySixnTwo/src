/** @param {NS} ns */
export async function main(ns) {
	while (true) {
		await ns.weaken("nectar-net");
		await ns.sleep(500)
		await ns.grow("nectar-net")
	}
}