/** @param {NS} ns **/

export async function main(ns) {
    const LOG_LEVEL = "command.js"
    const COMMAND = ns.args[0]

    // Run Default Updates
    for(let script of ["utils.js", "command.js"]){
        ns.tprint(`Downloading Script: ${script}`)
        await ns.wget(`http://localhost:9000/base/${script}`, script)
    }
  
    let commandFile = ""
    let commandArgs = {}

    switch(COMMAND){
        case "UPDATE":
            commandFile = "update.js"
            commandArgs['runCount'] = ns.args[1]
            break

        case "RESET":
            commandFile = "reset.js"
            break

        default:
            ns.tprint(`Exiting Script: ${commandFile}`)
            ns.exit()
    }
    if(LOG_LEVEL == "DEBUG"){
        ns.tprint(`Downloading Script: ${commandFile}`)
    }
    // Get Latest Version of Command
    await ns.wget(`http://localhost:9000/base/${commandFile}`, commandFile)

    if(LOG_LEVEL == "DEBUG"){
        ns.tprint(`Running Command: ${ns.args[0]}`)
    }
    // Run Command
    ns.run(commandFile,  1, JSON.stringify(commandArgs))

    ns.tprint(`Exiting command.js`)
}