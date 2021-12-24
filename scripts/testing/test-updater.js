/** @param {NS} ns **/
import { Logger } from "logger.js"
import { Send, Server } from "net.js"
// Wget is Free
// Read is Free

export async function main(ns){
   
    const commandArgs = JSON.parse(ns.args[0])

    const LOG_LEVEL = "update.js" //commandArgs.logLevel
    const RUN_COUNT = parseInt(commandArgs.runCount)

    let count = 0

    if(!RUN_COUNT){
        count = -1
    }

    let running = true
    

    while(running){

        // Set base URL for local file server
        var baseUrl = 'http://localhost:9000'
        // Download new config
        await Logger(ns, 1000, "Downloading New Config", LOG_LEVEL, "DEBUG")
        console.log("Downloading New Config")
        await ns.wget(`${baseUrl}/config.txt`,"new_config.txt")
        
        // Read new config
        await Logger(ns, 1000, "Reading New Config File", LOG_LEVEL, "DEBUG")
        var new_config = JSON.parse(ns.read("new_config.txt"))

        let current_config = {
            version: "NEW"
        }

        if(ns.fileExists("config.txt")){
            await Logger(ns, 1000, "Reading existing config.txt", LOG_LEVEL, "DEBUG")
            // Read the existing config
            current_config = JSON.parse(ns.read('config.txt'))
        }
        else{
            await Logger(ns, 1000, "Configuration does not Exist", LOG_LEVEL, "DEBUG")
        }


        if(new_config.version != current_config.version){
            await Logger(ns, 1000, "Version Change Detected - Running Update", LOG_LEVEL, "INFO")
            await Logger(ns, 1000, "Updating Configuration File", LOG_LEVEL, "DEBUG")
            console.log("Updating Configuration File")

            // Update config
            await ns.write('config.txt', JSON.stringify(new_config), "w")

            let files = new_config.files.base
            for(const file of files){
                await Logger(ns, 1000, `Downloading File: ${file}`, LOG_LEVEL, "INFO")
                // Download the latest file
                await ns.wget(`${baseUrl}/base/${file}`, file)
            }
            
            await Logger(ns, 1000, `Running File: controller.js`, LOG_LEVEL, "INFO")
            ns.run("controller.js", 1)

        }

        count ++

        if(count == RUN_COUNT){
            // await Logger(ns, 1000, "Run Count Reached", LOG_LEVEL, "INFO")
            running = false
        }

        await ns.sleep(2000)
    }

    // await Logger(ns, 1000, "Updating Complete", LOG_LEVEL, "INFO")
}