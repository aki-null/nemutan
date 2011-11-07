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

exports["talk"] = function(env, response, state, successFunc, failFunc) {
    var resp = helper.getResponseGenerator();
    resp.addPrompt("兄さん、お帰りなさい♪ ご飯にする、お風呂にする? それとも、あ・た・し?");
    resp.setMultipleChoice({
        meal: "ご飯",
        bath: "お風呂",
        nemutan: "ねむたん"
    });
    resp.nextCall = "talk-1";
    successFunc(resp);
}

exports["talk-1"] = function(env, response, state, successFunc, failFunc) {
    var resp = helper.getResponseGenerator();
    if (!response) {
        response = state.response;
    }
    switch (response) {
        case "meal":
            resp.addPrompt("今晩は張り切って作ったの! はい、どーぞ♥ (ピンク触手)");
            resp.setMultipleChoice({
                eat: "お、旨そうじゃん。食感がたまらない!",
                escape: "あっ、やっぱり風呂浴びるわ。",
                escape2: "やっぱりねむたんを食べたい・・・。"
            });
            resp.nextCall = "talk-2";
            break;
        case "bath":
            resp.addPrompt("じゃあ一緒に入ろう♪ お風呂の用意はもう出来てるよ♥");
            break;
        case "nemutan":
            resp.addPrompt("やだ、兄さんったら、積極的…♥");
            break;
        default:
            resp.addPrompt("兄さん、何言ってるの?");
            break;
    }
    successFunc(resp);
}

exports["talk-2"] = function(env, response, state, successFunc, failFunc) {
    var resp = helper.getResponseGenerator();
    switch (response) {
        case "eat":
            resp.addPrompt("兄さんの為に沢山作ったよ♪ まだまだあるから遠慮しないでね♥");
            break;
        case "escape":
        case "escape2":
            resp.addPrompt("兄さん、どこへ逃げる気……?");
            resp.state = {
                response: "meal"
            };
            resp.nextCall = "talk-1";
            break;
        default:
            resp.addPrompt("兄さん、何言ってるの?");
            break;
    }
    successFunc(resp);
}
