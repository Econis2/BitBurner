/** @param {NS} ns **/

export async function main(ns) {
    let hostname = ns.args[0] //ns.getHostname()
    // Doesnt Have Admin
    if(!ns.hasRootAccess(hostname)){
        // No Port Opening Programs Yet - Looking only for 0 Ports ATM
        if(ns.getServerNumPortsRequired < 1){
            // Get Admin
            await ns.nuke(hostname)
        }
    }
    // Now Has Root
    if(ns.hasRootAccess(hostname)){
        // Copy this script to new Host
        await ns.scp("init.js", null, hostname)
        // Run Spread.js on new host
        ns.exec("init.js", hostname, 1, null)
    }

}