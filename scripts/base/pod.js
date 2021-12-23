/** @param {NS} ns **/
import { Logger, ID } from "utils.js"

export async function main(ns) {
	const LOG_LEVEL = "pod.js"
	// const podArgs = JSON.parse(ns.args[0])
	// var host = podArgs.host
	var host = ns.args[0]
	let id = ID()

	var infoRequest = {
		id,
		host
	}

	// Write Data to the Port
	while(!ns.tryWritePort(1, infoRequest)){
		// Do Nothing
	}

	
	

	while(true){

		let hackLevel = ns.getHackingLevel()
		let currentSec = ns.getServerSecurityLevel(host)
		let currentMoney = ns.getServerMoneyAvailable(host)

		await Logger(ns, 1, `--- [${podArgs.controller}]->[${host}] ---` ,LOG_LEVEL,"INFO")
		await Logger(ns, 1, `Money: [Limit]${podArgs.money.minLimit} ${currentMoney.toFixed(2)}/${podArgs.money.max}`,LOG_LEVEL,"INFO")
		await Logger(ns, 1, `Security: ${currentSec.toFixed(2)}/${podArgs.security.maxLimit}` ,LOG_LEVEL,"INFO")

		if(podArgs.security.hackLevel <= hackLevel){
			if( currentSec > podArgs.security.maxLimit){
				await Logger(ns, 1, `Action: Weaken\n------------------------` ,LOG_LEVEL,"INFO")
				await ns.weaken(host)
			}
			else if(currentMoney < podArgs.money.minLimit){
				await Logger(ns, 1, `Action: Grow\n------------------------` ,LOG_LEVEL,"INFO")
				await ns.grow(host)
			}
			else {
				await Logger(ns, 1, `Action: Hack\n------------------------` ,LOG_LEVEL,"INFO")
				await ns.hack(host)
			}
		}
		
	}

}