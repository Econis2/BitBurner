import { NS } from "./utils/NetScriptDefinitions";

interface UpdateFile {
    name: string
    version: string
}

interface UpdateConfig {
    files: UpdateFile[]
}

export async function main(ns: NS){
    // Set base URL for local file server
    const baseUrl: string = 'http://localhost:9000'
    // Standard required config files
    const configName: string = "updateConf.txt"
    const tempConfigName: string = "updateConf-temp.txt"
    let result: boolean = false

    // No configuration Exists
    if(ns.read(configName) == ""){
        // Download new config
        result = await ns.wget(`${baseUrl}/${configName}`,configName)
        if(!result){
            throw "Unable to Download Initial Config File"
        }
    }

    while(true){
        let success = true
        // Download new config
        result = await ns.wget(`${baseUrl}/${configName}`,tempConfigName)
        if(!result){
            success = false
            console.warn("Unable to Download Config File")
        }
        else{
            let conf: UpdateConfig = JSON.parse(ns.read(configName))
            let newConf: UpdateConfig = JSON.parse(ns.read(tempConfigName))
            // Configuration has changed
            if(newConf !== conf){
                // Loop through files
                for(let file of conf.files){
                    // Get the stats for the updated file
                    let compareFile: UpdateFile = newConf.files[newConf.files.findIndex((newFile) => { return newFile.name == file.name })]
                    // File versions are different
                    if(file.version != compareFile.version){
                        // Download New version of file
                        console.log(`Update found File[${file.name}]`)
                        result = await ns.wget(`${baseUrl}/${file.name}`, file.name)
                        if(!result){
                            console.warn(`Unable to Download File[${file.name}]`)
                            // Not Successful update
                            success = false
                        }
                    }
                }
                // If updated everything
                if(success){
                    // write new config file
                    await ns.write(configName, [ JSON.stringify(newConf, null, 2) ], 'w')
                }
            }
        }
        // wait for X seconds
        await ns.sleep(2000)
    }
}