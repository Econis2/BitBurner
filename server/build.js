const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { v4: ID } = require('uuid');


// class BitBurnerPack {
const baseDir = path.dirname(__dirname)
console.log(baseDir)
const gameDir = path.join(baseDir, "game")
const distDir = path.join(baseDir, "dist")

try{
    fs.mkdirSync(distDir)
}
catch {
    // Do Nothing if exists
}
    // constructor(_gameDirectory, _distributionDirectory){

    //     gameDir = _gameDirectory || path.resolve(__dirname, "game")
    //     distDir = _distributionDirectory || path.resolve(__dirname, "dist")

    // }

    // Build(){
        // Checking each file in gameDir

let files = fs.readdirSync(gameDir).map((file) => {
    // Only Javscript Files
    if(file.includes('.js')){
        // Get the File
        let importFile = fs.readFileSync(path.join(gameDir, file), { encoding: "utf-8"})
        // File to be Outputed
        let outputFile = [
            '/** @param {NS} ns **/'
        ]
        // Run through each line
        importFile.split('\n').forEach( (line) => {
            // Matches import statements
            const importMatch = /import .* from ".*"/g
            // Line is an Import
            if(line.match(importMatch)){
                // Parse the Relative Path from the Import Statement
                let raw = line.split('from "')[1].replace('"','').replace(';','')
                // Change from a Relative Path to an Absolute
                let importPath = path.join(gameDir, raw.substring(1, raw.length))
                if(!importPath.includes(".js")){
                    importPath = `${importPath}.js`
                }
                console.log(`Importing from: ${importPath}`)
                // Inject the Import
                outputFile.push(fs.readFileSync(importPath, { encoding: "utf-8"}))
            }
            // Not Import
            else{
                // Normal Script 
                outputFile.push(line)
            }
        })

        // If files have changed
        if(!(importFile === outputFile)){
            // write to new combined file to distribution folder
            fs.writeFileSync(path.join(distDir, file), outputFile.join('\n'))
            return {
                name: file,
                version: ID()
            }
        }


    }
}).filter( item => item != null)

fs.writeFileSync(path.join(distDir, "updateConf.txt"), JSON.stringify({
    files
}, null, 2))
