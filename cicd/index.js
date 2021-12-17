const fs = require('fs')
const ini = require('ini-parser')

async function main(){
    let config = JSON.parse(fs.readFileSync("../config.txt"))
    // Clear the Files list
    config.files = []
    // Get the Repo URL
    let gitConf = ini.parseFileSync("../.git/config")

    // Get list of all files in Scripts folder
    let scripts = fs.readdirSync("../scripts").forEach((script) => {
        let gitUrl = 
        config.files.push({
            url: 
        })
    })

}

main()