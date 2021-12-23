/** @param {NS} ns **/

export async function main(ns) {

    let host = ns.getHostname() //ns.args[0]

    let controllerRam = ns.getScriptRam("controller.js")
    let maxMoney = ns.getServerMaxMoney(host)
    // Get Details
    let controllerArgs = {
        hostname: host,
        pods: [
            {
                host: host,
                instances: "100%",
                security: {
                    hackLevel: ns.getServerRequiredHackingLevel(host),
                    maxLimit: ns.getServerMinSecurityLevel(host) + 5
                },
                money: {
                    max:  maxMoney,
                    minLimit: maxMoney * 0.75
                }
            }
        ],
        memory: {
            max: ns.getServerMaxRam(host) - controllerRam,
            controller: controllerRam,
            pod: ns.getScriptRam("pod.js")
        }
    }



    // Run the Controller
    ns.tprint(`Running controller.js`)
    await ns.write('server.txt', JSON.stringify(controllerArgs))
    ns.run("controller.js", 1, JSON.stringify(controllerArgs))

}