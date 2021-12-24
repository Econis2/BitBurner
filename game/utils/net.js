"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortCommunication = void 0;
class PortCommunication {
    constructor(_ns, _timeout, _waitTime, _portStart, _portEnd) {
        this.ports = {
            start: 0,
            end: 0
        };
        this.id = this.NewID();
        this.ns = _ns;
        this.timeout = _timeout || 5000;
        this.waitTime = _waitTime || 50;
        this.ports.start = _portStart || 1;
        this.ports.end = _portEnd || 20;
    }
    NewID() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
    Timeout(timeout, whileFn, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let count = this.timeout / this.waitTime;
            timeout.isRunning = true;
            while (timeout.isRunning) {
                if (count == 0) {
                    throw `Operation Timed Out: ${this.timeout}ms`;
                }
                let response = yield whileFn(args);
                timeout.isRunning = response.isRunning;
                timeout.data = response.data;
                count = count - 1;
                yield this.ns.sleep(this.waitTime);
            }
            return timeout.data;
        });
    }
    TimeoutSync(timeout, whileFn, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let count = this.timeout / this.waitTime;
            timeout.isRunning = true;
            while (timeout.isRunning) {
                if (count == 0) {
                    throw `Operation Timed Out: ${this.timeout}ms`;
                }
                let response = whileFn(args);
                timeout.isRunning = response.isRunning;
                timeout.data = response.data;
                count = count - 1;
                yield this.ns.sleep(this.waitTime);
            }
            return timeout.data;
        });
    }
    ClearPorts() {
        for (let x = this.ports.start; x <= this.ports.end; x++) {
            this.ns.clearPort(x);
        }
    }
    FindOpenPort() {
        let result = {
            isRunning: true,
            data: -1
        };
        for (let x = this.ports.start; x <= this.ports.end; x++) {
            if (this.ns.peek(x) == "NULL PORT DATA") {
                console.log(`[net.js][FindOpenPort]Empty Port[${x}] Found`);
                result.isRunning = false;
                result.data = x;
                break;
            }
        }
        return result;
    }
    FindResponse(args) {
        let result = { isRunning: true, data: null };
        let raw_message = this.ns.peek(args.port);
        if (raw_message != "NULL PORT DATA") {
            let message = JSON.parse(raw_message);
            console.log(`[net.js][FindResponse]Message ${JSON.stringify(message, null, 2)}`);
            if (message.to == this.id) {
                console.log("[net.js][FindResponse]To Addresses Match");
                console.log(`[net.js][FindResponse]Table Compare\nArgs[From] ${args.from}\nMesg[From] ${message.from}\nArgs[Id] ${args.id}\nMesg[id] ${message.id}`);
                if ((args.from == "any" || message.from == args.from) && (args.id == "any" || message.id == args.id)) {
                    console.log("[net.js][FindResponse]From & ID are valid");
                    result.isRunning = false;
                    result.data = JSON.parse(this.ns.readPort(args.port));
                }
            }
        }
        return result;
    }
    WriteRequest(args) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = { isRunning: true, data: "null" };
            let test = yield this.ns.tryWritePort(args.port, [JSON.stringify(args.request)]);
            if (test) {
                result.isRunning = false;
            }
            return result;
        });
    }
    Send(req, waitResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[net.js][Send][${this.id}]Start`);
            waitResponse = waitResponse || true;
            let errorMessage = "Unable to find an Open Port";
            let request = {
                id: req.id || this.NewID(),
                from: this.id,
                to: req.to,
                data: req.data
            };
            try {
                console.log(`[net.js][Send][${this.id}]Find Open Port`);
                let port = yield this.TimeoutSync({ isRunning: true, data: -1 }, this.FindOpenPort, null);
                try {
                    console.log(`[net.js][Send][${this.id}]Port[${port}] Found`);
                    yield this.Timeout({ isRunning: true, data: "null" }, this.WriteRequest, { port: port, request });
                    if (waitResponse) {
                        try {
                            console.log(`[net.js][${this.id}][Send]Wait for Response`);
                            return this.TimeoutSync({ isRunning: true, data: "" }, this.FindResponse, { port, id: request.id, from: request.from });
                        }
                        catch (e) {
                            throw `Response never received on port ${port}`;
                        }
                    }
                }
                catch (e) {
                    throw `Unable to write to port ${port}`;
                }
            }
            catch (e) {
                let message = e || errorMessage;
                throw `${message}`;
            }
        });
    }
    Listen(listenFn) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`[net.js][Listen][${this.id}]Listening on All Ports`);
            while (true) {
                for (let x = this.ports.start; x <= this.ports.end; x++) {
                    let message = yield this.TimeoutSync({ isRunning: true, data: "" }, this.FindResponse, { port: x, id: "any", from: "any" });
                    if (message.data != "") {
                        console.log(`[net.js][Listen][${this.id}]Message Found: ${JSON.stringify(message)}`);
                        let data = listenFn(message);
                        console.log(`[net.js][Listen][${this.id}]Data: ${JSON.stringify(data)}`);
                        yield this.Send({ to: message.to, data: data }, false);
                    }
                }
                yield this.ns.sleep(50);
            }
        });
    }
}
exports.PortCommunication = PortCommunication;
