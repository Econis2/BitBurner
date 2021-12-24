import { NS } from ".";

export interface Timeout<T> {
    isRunning: boolean
    data: T
}

export interface Request<T> {
    id: string
    to: string
    from: string
    data: T
}

export interface RequestInit<T>{
    id?: string
    to: string
    data: T
}

export interface WriteRequest<T> {
    port: number
    request: Request<T>
}

export interface FindResponse {
    port: number
    from: string
    id: string
}

export class PortCommunication {

    id: string
    ns: NS
    timeout: number
    waitTime: number
    ports = {
        start: 0,
        end: 0
    }

    constructor(_ns: NS, _timeout?: number, _waitTime?: number, _portStart?: number, _portEnd?: number){
        this.id = this.NewID()
        this.ns = _ns
        this.timeout = _timeout || 5000
        this.waitTime = _waitTime || 50
        this.ports.start = _portStart || 1
        this.ports.end = _portEnd || 20
    }

    NewID() {
        var S4 = function() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }

    async Timeout<V,T>(timeout: Timeout<T>, whileFn: (args: V ) => Promise<Timeout<T>>, args: V): Promise<T>{
        let count: number = this.timeout / this.waitTime
        timeout.isRunning = true

        while(timeout.isRunning){
            // Check if Timeout Reached
            if(count == 0){
                // console.log(`[net.js][RunTimeout]Timeout: ${timeout}ms Reached`)
                // Timeout Reached - Throw Error
                throw `Operation Timed Out: ${this.timeout}ms`
            }
            // Get the Output of Function
            let response = await whileFn(args)
            // Set Properties
            timeout.isRunning = response.isRunning
            timeout.data = response.data
            // Decrease the count (increase number of times ran)
            count = count - 1
            // Wait for a period
            await this.ns.sleep(this.waitTime)
        }
        // console.log(`[net.js][RunTimeout]End`)
        // Return the result data
        return timeout.data

    }

    async TimeoutSync<V,T>(timeout: Timeout<T>, whileFn: (args: V ) => Timeout<T>, args: V): Promise<T>{
        let count: number = this.timeout / this.waitTime
        timeout.isRunning = true

        while(timeout.isRunning){
            // Check if Timeout Reached
            if(count == 0){
                // console.log(`[net.js][RunTimeout]Timeout: ${timeout}ms Reached`)
                // Timeout Reached - Throw Error
                throw `Operation Timed Out: ${this.timeout}ms`
            }
            // Get the Output of Function
            let response = whileFn(args)
            // Set Properties
            timeout.isRunning = response.isRunning
            timeout.data = response.data
            // Decrease the count (increase number of times ran)
            count = count - 1
            // Wait for a period
            await this.ns.sleep(this.waitTime)
        }
        // console.log(`[net.js][RunTimeout]End`)
        // Return the result data
        return timeout.data

    }

    ClearPorts(): void {
        for(let x = this.ports.start; x <= this.ports.end; x++){
            this.ns.clearPort(x)
        }
    }

    FindOpenPort(): Timeout<number> {
        let result: Timeout<number> = {
            isRunning: true,
            data: -1
        }
    
        for(let x = this.ports.start; x <= this.ports.end; x++){
            // console.log(`[net.js][FindOpenPort]Checking Port[${x}]`)
            // Port is Empty
            if(this.ns.peek(x) == "NULL PORT DATA"){
                console.log(`[net.js][FindOpenPort]Empty Port[${x}] Found`)
                result.isRunning = false
                result.data = x
                
                break
            }
        }
        // console.log(`[net.js][FindOpenPort]End`)
        return result
    }

    FindResponse(args: FindResponse): Timeout<any> {
        let result = { isRunning: true, data: null }
        // raw message
        let raw_message = this.ns.peek(args.port)
        // Check that Port is not empty
        if(raw_message != "NULL PORT DATA"){
            // Parse Data
            let message = JSON.parse(raw_message)
            console.log(`[net.js][FindResponse]Message ${JSON.stringify(message, null, 2)}`)
            // Message always needs to match To & Message
            if( message.to == this.id){
                console.log("[net.js][FindResponse]To Addresses Match")
                // From & ID must match or be "any"
                // This accomadates Client & Server
                console.log(`[net.js][FindResponse]Table Compare\nArgs[From] ${args.from}\nMesg[From] ${message.from}\nArgs[Id] ${args.id}\nMesg[id] ${message.id}`)
                if((args.from == "any" || message.from == args.from) && (args.id == "any" || message.id == args.id)){
                    console.log("[net.js][FindResponse]From & ID are valid")
                    result.isRunning = false
                    // Pop Data from the Port
                    result.data = JSON.parse(this.ns.readPort(args.port))
                }
            }
        }
        // console.log("[net.js][FindResponse]End")
        return result
    }

    async WriteRequest<T>(args: WriteRequest<T>): Promise<Timeout<string>> {
        let result = { isRunning: true, data: "null" }
        let test = await this.ns.tryWritePort(args.port, [ JSON.stringify(args.request) ])
        if(test){ 
            // console.log("[net.js][WriteResponse]Write Success")
            result.isRunning = false 
        }
        // console.log("[net.js][WriteResponse]End")
        return result
    }

    async Send(req: RequestInit<any>, waitResponse?: boolean){
        console.log(`[net.js][Send][${this.id}]Start`)
        waitResponse = waitResponse || true
        // timeout = timeout || 5000
        let errorMessage = "Unable to find an Open Port"
        let request: Request<any> = {
            id: req.id || this.NewID(),
            from: this.id,
            to: req.to,
            data: req.data
        } 

        // Find Open Request Port
        try{ 
            console.log(`[net.js][Send][${this.id}]Find Open Port`)
            let port = await this.TimeoutSync<null, number>({ isRunning: true, data: -1 }, this.FindOpenPort, null)
            
            // Write the Request to the Open Port
            try{
                console.log(`[net.js][Send][${this.id}]Port[${port}] Found`)

                await this.Timeout<WriteRequest<any>, string>({ isRunning: true, data: "null" }, this.WriteRequest, { port: port, request })

                if(waitResponse){
                    // Wait for Response
                    try{
                        console.log(`[net.js][${this.id}][Send]Wait for Response`)
                        return this.TimeoutSync<FindResponse, any>({ isRunning: true, data: ""}, this.FindResponse, { port, id: request.id, from: request.from })
                    }
                    catch (e){ throw `Response never received on port ${port}` }
                }
            }
            catch (e){ throw `Unable to write to port ${port}` }    
        
        }
        catch (e){ 
            let message = e || errorMessage
            throw `${message}`
        }
    }

    async Listen(listenFn: (args: any) => any){
        console.log(`[net.js][Listen][${this.id}]Listening on All Ports`)
        
        // Wait for a response
        while(true){
            for(let x=this.ports.start; x <= this.ports.end; x ++){
                // Find any Responses coming in
                let message: Request<any> = await this.TimeoutSync<FindResponse, any>({ isRunning: true, data: ""}, this.FindResponse, { port: x, id: "any", from: "any" })
                
                if(message.data != ""){
                    console.log(`[net.js][Listen][${this.id}]Message Found: ${JSON.stringify(message)}`)
                    let data: any = listenFn(message)

                    console.log(`[net.js][Listen][${this.id}]Data: ${JSON.stringify(data)}`)
                    await this.Send({ to: message.to, data: data }, false)
                }
            }
            await this.ns.sleep(50)
        }
    }
}