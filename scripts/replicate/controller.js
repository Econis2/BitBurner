/** @param {NS} ns **/

export async function main(ns) {
    ns.tprint(`Starting Controller`)
    var details = ns.args[0] || ns.read('details.txt')
    var controllerArgs = JSON.parse(details)

    let [total, used] = ns.getServerRam(controllerArgs.hostname)
    ns.tprint(`Memory: ${used} of ${total}`)

    // for(let pod of controllerArgs.pods){
    //     let percent = parseInt(pod.instances.replace('%','')) / 100
    //     // ns.tprint(`Percent: ${percent}`)
    //     let podPercent = ((total - used) * percent) / controllerArgs.memory.pod

    //     ns.tprint(`Pods: ${Math.floor(podPercent)}`)
    //     ns.run("pod.js", Math.floor(podPercent), JSON.stringify(pod))
    // }
    
    ns.tprint(`Exiting Controller`)
}