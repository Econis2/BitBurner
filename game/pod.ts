import { NS } from "./utils";
import * as Net from "./utils/net"


export async function main(ns: NS){
    let controller_id: string = ns.args[0].toString()
    const socket = new Net.PortCommunication(ns)

    await socket.Send({to: controller_id, data: { action: "hellow_world"}} )

}