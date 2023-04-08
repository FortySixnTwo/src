/** @param {NS} ns **/
import { Hacknet } from '/src/hacknet/Hacknet';
/*
 *  Notes:
 *    Need to know:
 *      max amount of each upgrade
 *      max nodes
 *      ROI of each
 *      How to get the ROI for new nodes
 *
 *
 * General Process:
 * Make sure list of nodes is current
 * While there's upgrades left to buy
 * Get the lowest value next purchase of each option
 * Find the ROIs, and upgrade the quickest
 */

export async function main(ns) {
  ns.disableLog('ALL');
  ns.tail();
  //Node constants
  const hacknet = new Hacknet(ns);

  // While there's still upgrades left for the node net
  while (hacknet.hasNextUpgrade()) {
    //Have the hacknet find the next upgrade
    hacknet.findNextUpgrade();
    //While there's still nodes left to upgrade
    while (hacknet.isNodesToUpgrade()) {
      hacknet.upgradeNode();
      hacknet.display();
      await ns.sleep(600);
    }
  }
}
