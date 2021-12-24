/** @param {NS} ns **/

import { Send, Listen, NewID, ClearPorts } from "net.js"

// function ServerStats(ns){

// }
// message.data = {
//     action: String
//     args: Object
// }
// function Run(ns, message){
//     switch(message.data.action){
//         case 'pod_args':

//     }
// }

export async function main(ns) {

    ClearPorts(ns)
    
    let id = NewID()
    console.log(`[test-podController.js][${id}]Start`)

    // Create Test Pod
    await ns.run("test-pod.js", 1, JSON.stringify({
       id: NewID(),
       controller: id
    }))

    await Listen(ns, id, null, function(args){
        console.log(`[test-podController.js][listenFunction][${id}]Start`)
        console.log(`[test-podController.js][listenFunction][${id}]args: ${JSON.stringify(args, null, 2)}`)
        let result = "Nothing To See Here"
        switch(args.message.data.action){
            case "hello_world":
                console.log(`[test-podController.js][listenFunction][${id}]Hello World`)
                result = "Hello World"
        }

        return result
    })
    

}