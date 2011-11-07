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

var helper = require("../../ghostHelper.js");

var talkPrompts = [
    "兄さん、朝ですよ♪",
    "おかえりなさい、兄さん♪",
    "に、兄さん…?",
    "お仕事お疲れ様、兄さん♪"
]

exports["talk"] = function(env, state, successFunc, failFunc) {
    var resp = helper.getResponseGenerator();
    var newPrompt = talkPrompts[Math.floor(Math.random() * talkPrompts.length)]
    if (state.lastPrompt) {
        resp.addPrompt(state.lastPrompt);
    }
    resp.addPrompt(newPrompt);
    resp.setTextAnswer();
    resp.state = {
        lastPrompt: newPrompt
    };
    successFunc(resp);
}
