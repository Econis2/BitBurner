/** @param {NS} ns **/

let config = {
	securityMultiplyer: 0.75,
	moneyAddifyer: 5,
	files: [
		"config.txt",
		"deploy.js",
		"spread.js",
		"controller.js"
	]
}

export async function main(ns) {
	const config = JSON.parse(ns.read("./config.txt"))

	await ns.run(config.files[2])
	await ns.run(config.files[3])

	ns.
}