/** @param {NS} ns **/
export async function main(ns) {
    const config = JSON.parse(ns.read("./config.txt"))
    // Get from a Config
    let hosts = ns.scan()

    hosts.forEach(async (host) => {
        // Doesnt Have Admin
        if(!ns.hasRootAccess()){
            // No Port Opening Programs Yet - Looking only for 0 Ports ATM
            if(ns.getServerNumPortsRequired < 1){
                // Get Admin
                await ns.nuke(host)
            }

        }
        // Now Has Root
        if(ns.hasRootAccess()){
            ns.scp([
                
            ])
        }

    })

    // let detailedHosts = await Promise.all(hosts.map(async (host) => {
    //     let dHost = await ns.getServer(host)
    //     return {
    //         name: dHost.hostname,
    //         company: dHost.organizationName,
    //         ip: dHost.ip,
    //         backdoor: dHost.backdoorInstalled,
    //         admin: dHost.hasAdminRights,
    //         connected: dHost.isConnectedTo,
    //         purchased: dHost.purchasedByPlayer,
    //         hardware: {
    //             cores: dHost.cpuCores,
    //             memory: {
    //                 max: dHost.maxRam,
    //                 used: dHost.ramUsed,
    //                 available: dHost.maxRam - dHost.ramUsed
    //             }
    //         },
    //         security: {
    //             hack: dHost.requiredHackingSkill,
    //             current: dHost.hackDifficulty,
    //             min: dHost.baseDifficulty
    //         },
    //         ports: {
    //             required: dHost.numOpenPortsRequired,
    //             http: dHost.httpPortOpen,
    //             ftp: dHost.ftpPortOpen,
    //             smtp: dHost.smtpPortOpen,
    //             sql: dHost.sqlPortOpen,
    //             ssh: dHost.sshPortOpen
    //         },
    //         money: {
    //             available: dHost.moneyAvailable,
    //             max: dHost.moneyMax,
    //             growth: dHost.serverGrowth
    //         }
    //     }
    // }))



}