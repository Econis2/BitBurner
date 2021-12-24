import { NS } from "./utils/NetScriptDefinitions";
import * as Net from "./utils/net"


export async function main(ns: NS){
    const socket: Net.PortCommunication = new Net.PortCommunication(ns)

    socket.ClearPorts()

    await ns.run("test-pod.js", 1, socket.id)

    await socket.Listen((req) => {
        let result: string = "Nothing To See Here"
        switch(req.data.action){
            case "hello_world":
                console.log(`[test-podController.js][listenFunction][${socket.id}]Hello World`)
                result = "Hello World"
        }
        return result
    })
}