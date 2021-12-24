/** @param {NS} ns **/

//delay
export async function Logger(ns, delay, message, fileName, messageLevel){
    const logLevel = "INFO"
    
    if(ns.fileExists('./config.txt')){
        const config = JSON.parse(ns.read('./config.txt'))
        logLevel = config.logs.base[fileName]
    }
   

    let matrix = {
        "DEBUG": [
            "DEBUG",
            "INFO",
            "ERROR"
        ],
        "INFO": [
            "INFO",
            "ERROR"
        ]
    }

    let logTest = matrix[logLevel]
    
    if(logTest.includes(messageLevel)){
        if(delay){
            await ns.sleep(delay)
        }
        ns.tprint(message)
    }
}
