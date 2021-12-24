// /** @param {NS} ns **/

export function NewID() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function ErrorResponse(error){
    let result = "500: Internal Server Error"
    switch(error){
        case 503:
            result = `${error}: Gateway Timeout`

        case 404:
            result = `${error}: Not Found`
    }
    
    return result
}

async function RunTimeout(ns, waitTime, timeout, whileFunc, funcArgs){
    // console.log(`[net.js][RunTimeout]Start`)
    // // Setup Defaults
	
    waitTime = waitTime || 50
    let count = (timeout || 5000) / waitTime
    let data = null
	let isRunning = true
    // While the Function is continues to run
    while(isRunning){
        // Check if Timeout Reached
        if(count == 0){
            // console.log(`[net.js][RunTimeout]Timeout: ${timeout}ms Reached`)
            // Timeout Reached - Throw Error
            throw `Operation Timed Out: ${timeout}ms`
        }
        // Get the Output of Function
        let response = await whileFunc(funcArgs)
        // Set Properties
        isRunning = response.isRunning
        data = response.data
        // Decrease the count (increase number of times ran)
        count = count - 1
        // Wait for a period
        await ns.sleep(waitTime)
    }
    // console.log(`[net.js][RunTimeout]End`)
    // Return the result data
    return data
}
// //Args:
// // {
// //     ns: NS Instance
// //     request: Request Object
// //     port: Port Number
// // }
// // Returns
// // Port Number
function FindOpenPort(args){
    // console.log("[net.js][FindOpenPort]Start")
    let result = {
        isRunning: true,
        data: null
    }

    for(let x = args.start; x <= args.end; x++){
        // console.log(`[net.js][FindOpenPort]Checking Port[${x}]`)
        // Port is Empty
        if(args.ns.peek(x) == "NULL PORT DATA"){
            console.log(`[net.js][FindOpenPort]Empty Port[${x}] Found`)
            result.isRunning = false
            result.data = x
            
            break
        }
    }
    // console.log(`[net.js][FindOpenPort]End`)
    return result
}
// //Args:
// // {
// //     ns: NS Instance
// //     request: Request Object
// //     port: Port Number
// // }
// // Returns
// // void
async function WriteRequest(args){
    // console.log("[net.js][WriteResponse]Start")
    let result = { isRunning: true, data: null }
    let test = await args.ns.tryWritePort(args.port, JSON.stringify(args.request))
    if(test){ 
        // console.log("[net.js][WriteResponse]Write Success")
        result.isRunning = false 
    }
    // console.log("[net.js][WriteResponse]End")
    return result
}
// //Args:
// // {
// //     ns: NS Instance
// //     from: ID
// //     to: ID
// //     port: Port Number
// // }
// // Returns
// // Response data || void
function FindResponse(args){
    // console.log("[net.js][FindResponse]Start")
    let result = { isRunning: true, data: null }
    // raw message
    let raw_message = args.ns.peek(args.port)
    // Check that Port is not empty
    if(raw_message != "NULL PORT DATA"){
        // Parse Data
        let message = JSON.parse(raw_message)
        console.log(`[net.js][FindResponse]Message ${JSON.stringify(message, null, 2)}`)
        // Message always needs to match To & Message
        if( message.to == args.to){
            console.log("[net.js][FindResponse]To Addresses Match")
            // From & ID must match or be "any"
            // This accomadates Client & Server
            console.log(`[net.js][FindResponse]Table Compare\nArgs[From] ${args.from}\nMesg[From] ${message.from}\nArgs[Id] ${args.id}\nMesg[id] ${message.id}`)
            if((args.from == "any" || message.from == args.from) && (args.id == "any" || message.id == args.id)){
                console.log("[net.js][FindResponse]From & ID are valid")
                result.isRunning = false
                // Pop Data from the Port
                result.data = JSON.parse(args.ns.readPort(args.port))
            }
        }
    }
    // console.log("[net.js][FindResponse]End")
    return result
}

export function ClearPorts(ns){
    for(let x = 1; x <= 20; x++){
        ns.clearPort(x)
    }
}

export async function Send(ns, request_id, id, destination, data, waitResponse, timeout){
    console.log(`[net.js][Send][${id}]Start`)
    waitResponse = waitResponse
    timeout = timeout || 5000
    let errorMessage = "Unable to find an Open Port"
    let requestObject = {
        id: request_id || NewID(),
        to: destination,
        from: id,
        data
    }

    // Find Open Request Port
    try{ 
        console.log(`[net.js][Send][${id}]Find Open Port`)
        let port = await RunTimeout(ns, null, timeout, FindOpenPort, { ns, start: 1, end: 20 })
        
        // Write the Request to the Open Port
        try{
            console.log(`[net.js][Send][${id}]Port[${port}] Found`)
            await RunTimeout(ns, null, timeout, WriteRequest, { ns, port: port, request: requestObject })
            
            if(waitResponse){
                // Wait for Response
                try{
                    console.log(`[net.js][${id}][Send]Wait for Response`)
                    return await RunTimeout(ns, null, timeout, FindResponse, { ns, port, to: id, from: destination, id: requestObject.id })
                }
                catch (e){ throw `Response never received on port ${port}` }
            }
        }
        catch (e){ throw `Unable to write to port ${port}` }    
    
    }
    catch (e){ 
        let message = e || errorMessage
        throw `${ErrorResponse(503)}\n${message}`
    }
}

export async function Listen(ns, id, requestTimeout, listenFunction){
    console.log(`[net.js][Listen][${id}]Listening on All Ports`)
    
    // Wait for a response
    while(true){
        for(let x=1; x <=20; x ++){
            // Find any Responses coming in 
            let message = await RunTimeout(ns, null, null, FindResponse, { ns, port: x, to: id, from: "any", id: "any"})
            if(message){
                console.log(`[net.js][Listen][${id}]Message Found: ${JSON.stringify(message)}`)
                let data = await listenFunction({ns, message})
                console.log(`[net.js][Listen][${id}]Data: ${JSON.stringify(data)}`)
                await Send(ns, message.id, id, message.from, data, false, requestTimeout)
            }
        }
        await ns.sleep(50)
    }
}