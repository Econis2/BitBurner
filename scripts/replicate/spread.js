/** @param {NS} ns **/

export async function main(ns) {
    // Scan for New Hosts
    ns.tprint(`Scanning for new Hosts`)
    let hosts = ns.scan()
    
    for(let host of hosts){
        if(host != "home"){
            ns.tprint(`Rooting: ${host}`)
            ns.run("root.js", 1, host)
        }
    }

    ns.exit()

}