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

var responder = require("./responder.js");
var desc = require("./description.js");

// Respond to the user request
// Parameters:
// responder: Name of the responder function (It MUST respond to at leat "talk")
// env: Environment (user info)
// gEnv: Ghost environment (user info for this ghost)
// state: Session state (can contain things like the discussion state)
// successFunc: Must be called with the resulting structure if the request has succeeded
// failFunc: Must be called with the error message string if the request has failed
exports.respond = function(responderName, env, gEnv, state, successFunc, failFunc) {
    if (responderName && responderName.length > 0) {
        var responderFunc = responder[responderName];
        if (!responderFunc) {
            failFunc("The specified responder function (" + responderName + ") is undefined");
        } else {
            responderFunc(env, state, successFunc, failFunc);
        }
    } else {
        failFunc("Responder function name needs to be specified");
    }
}

exports.name = desc.name;
exports.introduction = desc.introduction;
