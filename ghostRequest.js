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

var fs = require("fs");
var logger = require("./logger.js");
var database = require("./database.js");

var GHOST_DIR = "./ghosts/";

// Ghost listing
exports.ghostList = {};

function tryLoadingGhost(ghostname) {
    var foundMain = false;
    fs.readdir(GHOST_DIR + ghostname, function (err, files) {
        files.forEach(function(filename) {
            if (filename === "main.js") {
                var fullPath = GHOST_DIR + ghostname + "/" + filename;
                fs.stat(fullPath, function(err, stats) {
                    if (err) {
                        logger.logError("Failed to get information about the file at '" + fullPath + "'");
                    } else {
                        if (stats.isFile()) {
                            exports.ghostList[ghostname.toLowerCase()] = require(fullPath);
                            foundMain = true;
                            console.log("Loaded ghost: " + ghostname);
                        } else {
                            logger.logError("main.js for the ghost located at '" + fullPath + "' is not a file.");
                        }
                    }
                })
            }
        });
    });
}

// This function is called on server launch
exports.loadGhosts = function() {
    fs.readdir(GHOST_DIR, function(err, files) {
        if (err != null) {
            logger.logError("Failed to list ghosts directory");
        } else {
            var count = files.length;
            files.forEach(function(filename) {
                fs.stat(GHOST_DIR, function(err, stats) {
                    if (err) {
                        logger.logError("Failed to check whether '" + filename + "' is a directory or not");
                    } else {
                        if (stats.isDirectory()) {
                            // Found a directory - might be a ghost
                            tryLoadingGhost(filename);
                        } else {
                            logger.logError("Found non-folder in ghosts directory - " + filename);
                        }
                    }
                });
            });
        }
    });
}

// Ghost API request handler
exports.processRequest = function(urlComps, successFunc, failFunc) {
    var pathName = urlComps.pathname;
    var pathNames = pathName.split("/");
    if (pathNames.length > 2) {
        var ghostName = pathNames[2];
        var ghost = exports.ghostList[ghostName.toLowerCase()];
        if (ghost) {
            if (pathNames.length == 3) {
                // Show ghost info
                // TODO: Implement ghost info API
                failFunc("Ghost info API has not been implemented yet");
            } else if (pathNames.length == 4) {
                // Forward the request to ghost
                // TODO: Implement environment variables
                var sessionID = urlComps.query.session;
                var response = urlComps.query.response;
                var gState = null;
                var gReqFunc = function(state) {
                    ghost.respond(pathNames[3], null, null, response, state, function(response) {
                        successFunc(response, ghostName.toLowerCase());
                    }, failFunc);
                };
                if (sessionID && sessionID.length > 0) {
                    database.getSession("temp", ghostName, sessionID, gReqFunc, failFunc);
                } else {
                    gReqFunc({});
                }
            } else {
                // Invalid number of paths
                failFunc("The request has too many path components");
            }
        } else {
            failFunc("The specified ghost is not available");
        }
    } else {
        failFunc("Incomplete path for ghost request");
    }
}
