/** @param {NS} ns **/
import { Logger } from "utils.js"

export async function main(ns){
    const LOG_LEVEL = "reset.js"

    const hostname = ns.getHostname()
    var noDelete = [
        "NUKE.exe",
        "hackers-starting-handbook.lit",
        "command.js",
        "utils.js"
    ]

    await Logger(ns, 1, "Reset Triggered",LOG_LEVEL,"INFO")

    for(let file of ns.ls(hostname)){
        if(!noDelete.includes(file) && !file.includes(".exe") && !file.includes(".msg")){
            await Logger(ns, 1, `Removing File: ${file}`,LOG_LEVEL,"DEBUG")
            ns.rm(file)
        }
    }

    await Logger(ns, 1, "Reset Complete",LOG_LEVEL,"INFO")
}