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

var responseGenerator = {
    init: function() {
        this.nextCall = "";
        this.state = null;
        this.answerType = "none";
        this.answerStruct = {};
        this.prompts = [];
        return this;
    },
    compile: function() {
        return {
            values: {
                nextCall: this.nextCall,
                answerType: this.answerType,
                answerStruct: this.answerStruct,
                prompts: this.prompts
            },
            state: this.state
        };
    },
    addPrompt: function(prompt) {
        return this.prompts.push(prompt);
    },
    setMultipleChoice: function(selectionInfo) {
        this.answerType = "multiple";
        this.answerStruct = {
            selections: selectionInfo
        };
    },
    setTextAnswer: function() {
        this.answerType = "text";
        this.answerStruct = {};
    },
    setConfirmationAnswer: function(optionText) {
        this.answerType = "confirmation";
        if (optionText && optionText.yes && optionText.no) {
            this.answerStruct = {
                yes: optionText.yes,
                no: optionText.no
            };
        } else {
            this.answerStruct = {};
        }
    },
    setNoAnswer: function() {
        this.answerType = "none";
        this.answerStruct = {};
    }
};

exports.getResponseGenerator = function(initVals) {
    return Object.create(responseGenerator).init();
};
