const fs = require('fs')
// const { spawn } = require('child_process')
const { v4: ID } = require('uuid');

function main(){
    let config = JSON.parse(fs.readFileSync("./scripts/config.txt"))
    // Update Version
    config['version'] = ID()
    config.files = {
        base: fs.readdirSync("./scripts/base"),
        virus: fs.readdirSync("./scripts/replicate")
    }
    // .map((file) => {
    //     return {
    //         name: file,
    //     }
    // })
    // Write Config
    fs.writeFileSync("./scripts/config.txt", JSON.stringify(config, null, 2))

}

main()