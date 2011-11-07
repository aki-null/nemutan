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

var cradle = require("cradle");

var config = require("./config.js");
var logger = require("./logger.js");

var db = new (cradle.Connection)(config.databaseAddress, config.databasePort, {
    cache: true,
    raw: false
}).database(config.sessionDatabaseName);

db.exists(function(err, exists) {
    if (err) {
        logger.logError("Failed to check the database existance. Please check the database connection.");
    } else if (!exists) {
        // The database does not exist. Need to initialize tables.
        db.create(function() {
            db.save("_design/sessions", {
                all: {
                    map: function(doc) {
                        if (doc.type == "session") {
                            emit(doc._id, doc);
                        }
                    }
                }
            });
        });
   }
});

exports.storeSession = function(state, owner, ghost, successFunc, failFunc) {
    if (state && owner && ghost && successFunc && failFunc) {
        var wrappedState = {
            type: "session",
            state: state,
            owner: owner,
            ghost: ghost
        };
        db.save(null, wrappedState, function(err, res) {
            if (err) {
                failFunc("Failed to write session data");
                logger.logError(err.reason);
            } else {
                successFunc(res.id);
            }
        });
    } else {
        successFunc();
    }
}

exports.getSession = function(owner, ghost, sessionID, successFunc, failFunc) {
    if (owner && ghost && successFunc && failFunc) {
        db.view("sessions/all", { key: sessionID }, function(err, res) {
            if (err) {
                failFunc("Database error occured: " + err);
            } else if (res.length >= 1) {
                var sessionDetail = res[0].value;
                if (sessionDetail.owner === owner && sessionDetail.ghost === ghost && sessionDetail.state) {
                    successFunc(sessionDetail.state);
                } else {
                    failFunc("Invalid session ID for the specified ghost and user");
                }
            } else {
                failFunc("The specified session does not exist");
            }
        })
    } else {
        failFunc("Invalid argument specified for session restoration");
    }
}

