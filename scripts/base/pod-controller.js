/** @param {NS} ns **/
import { Logger } from "utils.js"

export async function main(ns) {

    const LOG_LEVEL = "pod-controller.js" //ns.args[0] || "INFO"

    let dlFiles = [
        "kill.js",
        "pod.js",
        "clusterConfig.txt"
    ]

    for(const file of dlFiles){
        await Logger(ns, 2, `Downloading File: ${file}`, LOG_LEVEL, "DEBUG")
        await ns.wget(`http://localhost:9000/base/${file}`, file)
    }

    await Logger(ns, 2, `Reading Cluster Config`, LOG_LEVEL, "INFO")
    var clusterConfig = JSON.parse(ns.read('clusterConfig.txt'))
    
    let podCost = ns.getScriptRam('pod.js')

    for(let pod of clusterConfig.pods){

        let podHost = pod.host
        let maxMoney = ns.getServerMaxMoney(pod.target)

        for(const cFile of ["utils.js","kill.js"]){
            await Logger(ns, 2, `Copying ${cFile}`, LOG_LEVEL, "DEBUG")
            await ns.scp(cFile, podHost)
        }
        await Logger(ns, 2, `Running kill.js`, LOG_LEVEL, "DEBUG")
        await ns.exec("kill.js", podHost, 1, podHost)

        

        await Logger(ns, 2, `Waiting for all scripts to shut down`, LOG_LEVEL, "INFO")
        while(ns.getServerRam(podHost)[1] != 0){
            // Waiting for Kill
        }

        await Logger(ns, 2, `Getting PodHost Ram`, LOG_LEVEL, "DEBUG")
        let [total, used] = ns.getServerRam(podHost)

        var podArgs = {
            host: pod.target,
            controller: podHost,
            security: {
                hackLevel: ns.getServerRequiredHackingLevel(pod.target),
                maxLimit: ns.getServerMinSecurityLevel(pod.target) + 5
            },
            money: {
                max:  maxMoney,
                minLimit: maxMoney * 0.75
            }
        }

        // Replace the % with nothing and move the decimal 2 places left
        let percent = parseInt(pod.instances.replace('%','')) / 100
        // Round Down ( (Total Capable) - (Ram Used) ) X (Percent Calc Above) / (Cost to Run Pod.js)
        let threads = Math.floor(((total - used) * percent) / podCost)

        await Logger(ns, 2, `Copying pod.js`, LOG_LEVEL, "DEBUG")
        await ns.scp("pod.js", "home", podHost)

        await Logger(ns, 2, `Starting Pod Pool: [${threads}]`, LOG_LEVEL, "DEBUG")
        let pID = ns.exec("pod.js", podHost, threads, JSON.stringify(podArgs))
        
        await Logger(ns, 2, `Pod Pool Started: [${pID}]`, LOG_LEVEL, "DEBUG")

    }
    
}