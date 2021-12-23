/** @param {NS} ns **/

export async function main(ns) {

    let phases = [
        "kill.js",
        "spread.js",
        "details.js"
    ]

    // Download Latest Config
    ns.tprint(`Downloading Config File`)
    await ns.wget("http://localhost:9000/config.txt", "config.txt")
    // Get current Conf
    ns.tprint(`Parsing Config File`)
    const config = JSON.parse(ns.read("config.txt"))

    // Download the require scripts
    for(let file of config.files.virus){
        ns.tprint(`Downloading File: ${file}`)
        await ns.wget(`http://localhost:9000/replicate/${file}`, file)
    }

    for(let phase of phases){
        ns.run(phase, 1)
        await ns.sleep(2)
        // while(ns.scriptRunning(phase, hostname)){
        //     // Wait for completion before starting the next
        // }
    }
}