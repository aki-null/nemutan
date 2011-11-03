/*!
 * Copyright (C) 2011 by Akihiro Noguchi
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var http = require("http");
var url = require("url");
var config = require("./config.js");
var ghostReq = require("./ghostRequest.js");
var logger = require("./logger.js");
var session = require("./session.js");

ghostReq.loadGhosts();

function processRequest(req, res) {
    // Log access
    logger.logAccess(req.connection.remoteAddress + " - " + req.url);

    var urlComps = url.parse(req.url, true);
    var pathName = urlComps.pathname;

    var failFunc = function failed(message) {
        res.end(JSON.stringify({
            success: false,
            message: message,
            result: null
        }));
    }

    var successFunc = function success(result, state, from) {
        var resultStruct = {
            success: true,
            message: null,
            result: result
        };
        session.storeSession(state, "temp", from, function(sessionID) {
            resultStruct.sessionID = sessionID;
            res.end(JSON.stringify(resultStruct));
        }, failFunc);
    }

    // Request forwarfing
    var pathNames = pathName.split("/");
    if (pathNames.length > 1) {
        switch (pathNames[1]) {
            case "ghost":
                ghostReq.processRequest(urlComps, successFunc, failFunc);
                break;
            default:
                failFunc("Invalid API path");
                break;
        }
    } else {
        failFunc("Invalid API path");
    }
}

http.createServer(processRequest).listen(config.serverPort);
console.log('Nemutan running at port ' + config.serverPort);
