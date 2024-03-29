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
var database = require("./database.js");

ghostReq.loadGhosts();

function processRequest(req, res) {
    // Log access
    logger.logAccess(req.connection.remoteAddress + " - " + req.url);

    var urlComps = url.parse(req.url, true);
    var pathName = urlComps.pathname;
    var readable = urlComps.query.readable !== undefined ? "    " : false;

    var failFunc = function failed(message) {
        res.end(JSON.stringify({
            success: false,
            message: message,
            result: null
        }, null, readable));
    };

    var successFunc = function success(response, from) {
        var responseFinal = response.compile();
        var resultStruct = {
            success: true,
            result: responseFinal.values
        };
        database.storeSession(responseFinal.state, "temp", from, function(sessionID) {
            resultStruct.result.sessionID = sessionID;
            res.end(JSON.stringify(resultStruct, null, readable));
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
