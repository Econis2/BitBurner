/** @param {NS} ns **/

import { Send, Listen, NewID } from "net.js"

export async function main(ns) {
    let args = JSON.parse(ns.args[0])
    console.log(`[test-pod.js][main][${args.id}]Start`)
    

    console.log(`[test-pod.js][main][${args.id}]Sending Request`)
    let message = await Send(ns, null, args.id, args.controller, { action: "hello_world" }, true)
    console.log(`[test-pod.js][main][${args.id}]Response: ${message}`)
    console.log(`[test-pod.js][main][${args.id}]End`)
}