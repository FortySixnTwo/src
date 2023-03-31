/** @param {NS} ns */
export async function main(ns) {
  const root = "home";
  const visited = new Set();
  const stack = [root];
  ns.disableLog("scan");
  ns.tail();
  
  while (stack.length > 0) {
    const current = stack.pop();

    if (!visited.has(current)) {
      visited.add(current);

      const connections = ns.scan(current);
      for (const next of connections.reverse()) {
        if (next !== root && !visited.has(next)) {
          //ns.print(`Currently traversing ${current}. Next node is ${next}.`);
          stack.push(next);
        }
      }
    }
  }

  ns.print([...visited]);
}