/** @param {NS} ns **/

//0: Hostname
//1: Min Money Multiplyer
//2: Max Security Addifyer

export async function main(ns) {
	var host = args[0] | null
	var minMoney = ns.getServerMaxMoney() * args[1]
    var maxSecurity = ns.getServerMinSecurityLevel() + args[2]
    
	if(ns.getServerRequiredHackingLevel() <= ns.getHackingLevel()){
        if(ns.getServerSecurityLevel() > maxSecurity){
            await ns.weaken(host)
        }
		else if(ns.getServerMoneyAvailable() < minMoney){
			await ns.grow(host)
		}
		else {
			await ns.hack(host)
		}
	}
}