/** @param {NS} ns **/
import { Logger } from "utils.js"

export async function main(ns) {
    const LOG_LEVEL = "kill.js"
    // Kill all current running scripts
    await Logger(ns, null, `Kill All Scripts`, LOG_LEVEL, "INFO")

    // let scripts = ns.ps(ns.args[0])
    // if(scripts.length > 0){
    //     for(let script of scripts){
    //         if(script.filename != "spread.js" && script.filename != "update.js" && script.filename != "kill.js"){
    //             ns.tprint(`Atempting to Kill Script: ${script.filename}`)
    //             ns.kill(script.filename, hostname, script.args)
    //         }
    //     }
    // }
    await Logger(ns, null, `Kill Confirmed`, LOG_LEVEL, "INFO")
}