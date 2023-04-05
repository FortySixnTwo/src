/** @param {NS} ns **/
import { HacknetNodeConstants, Hacknet } from '/@/hacknet/Constants.js';
import { BuyerSettings } from '@/conf/Constants';
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
const levelsPerBuy = 5;
const ramPerBuy = 1;
const coresPerBuy = 1;

export async function main(ns) {
  //Node constants

  const hacknet = new Hacknet(ns);
  hacknet.findNodes();

  while (hacknet.hasRemainingUpgrades()) {
    let targetUpgrade = getTargetUpgrade();
    await ns.sleep(600);
  }
}

/*
 * Target choosing logic
 */

function getTargetUpgrade(ns, nodes) {
  const targets

  if (ns.fileExists('formulas.exe')) {
    return getSmartTarget(nodes);
  } else {
    return getDumbTarget(nodes);
  }
}

function getSmartTarget(nodes) {}

function getDumbTargets(nodes) {}
