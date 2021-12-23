/** @param {NS} ns **/

import { request } from "express"

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

export function ID() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

export function GetOpenPort(ns){
    let result = 500
    let portFound = false
    let x = 0
    while(!portFound){
        if(ns.getPortHandle(x).empty()){
            result = x
            portFound = true
        }
        else if(x == 20){
            x = -1
        }
        
        x++
        
    }

    return result
}

export function RequestCommPort(ns, _id, _action){
    let  request = {
        id: _id,
        action: _action,
    }

    let port = GetOpenPort(ns)
    while(!await ns.tryWritePort(port,JSON.stringify(request))){}

    let response_found = false

    while(!response_found){

        let response = ns.getPortHandle(0).data.find((item) => {
            return JSON.parse(item).id == _id
        })
    }


}



export function Request(){

}