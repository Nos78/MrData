/*
 * @Author: BanderDragon 
 * @Date: 2019-03-14
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-25 10:08:42
 */

const { serializeError } = require("serialize-error");

//
// format.js
// =========
// Simple library of useful formatting functions
//

module.exports = {
    //
    // numberWithCommas(x) takes a number, and adds comma seperatiors
    //
    numberWithCommas: function (x) {
        if (x == null) {
            return x;
        }

        if (!isNaN(x)) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        else {
            return x;
        }
    },

    //
    // stripCommas(x) will strip all the commas from a string
    // no assumptions are made that the return value will be a numer
    // the regex will not be performed if x is already a number
    //
    stripCommas: function (x) {
        if (x == null) {
            return x;
        }

        if (isNaN(x)) {
            x = x.replace(/[,]+/g, "");
        }
        return x;
    },

    //
    // clean(text) takes a line of text and inserts a zero length character
    // after the @ symbol, to prevent the mentioned user recieving notifications.
    //
    clean: function(text) {
    if (typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
    },

    //
    // Turns an error object into a plain object
    //
    plainTextError: function(error) {
        return serializeError(error);
    },

    /**
     * Method to stringify an error - uses the serialize-error NPM module
     * @param {Object} error 
     */
    stringifyError: function(error) {
        let serializedError = this.plainTextError(error);
        return JSON.stringify(serializedError);
    },

    /**
     * Method to return the type of an object - improves the default javascript typeof operator.
     * @param {Object} obj
     * @returns {string}
     */
    typeOf: function(obj) {
        return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    },

    /**
     * Generate a random number between two values, inclusive.
     * @param {integer} min 
     * @param {integer} max 
     * @returns {integer} random number between @min and @max
     */
    between: function(min, max) {  
        return Math.floor(
            Math.random() * (max - min + 1) + min
        )
    },

    randomString: function(stringsArray) {
        var stringsCount = stringsArray.length;
        var stringChoice = this.between(0, stringsCount - 1);
        return stringsArray[stringChoice];
    },


    encodeDataInColor: function(color, data) {
        var lowOrder32 = color;
        var highOrder = data;
        return lowOrder32 * (2 ** 32) + highOrder;
    },

    decodeDataFromColor: function(encodedColor) {
        const lowOrder32 = Math.floor(encodedColor / (2 ** 32));
        const highOrder = encodedColor - lowOrder32 * (2 ** 32);

        return [lowOrder32, highOrder];
    },

    textBarChart: function(value, numCharsPerLine, numLines, valueSuffix, maximum = 100, minimum = 0) {
        // Some simple error checking
        if(isNaN(numLines) || numLines < 3) {
            return 'textBarChart: not enough lines requested. Cannot display a bar chart.';
        }
        if(isNaN(maximum) || isNaN(minimum) || maximum <= 0 || minimum >= maximum) {
            return 'textBarChart: There was an error, maximum and/or minimum values are incorrectly set';
        }
        if(isNaN(value) || value < minimum || value > maximum) {
            return 'textBarChart: cannot calculate a percentage - the given value falls outside the min/max boundaries';
        }

        // define our variables to calculate the box
        var charsToLeft = 0;
        var charsToRight = 0;

        // Chars to define the box:
        var boxTop = '_';
        var boxBot = '¯';
        var boxFill1 = ['/', '·', '\\', '·'];
        var boxFill2 = ' ';
        var boxEnd = '¦';
        var boxStart = '¦';
        var boxSep = '¦';
        var output = '';
        var numFormatCharsPerLine = boxEnd.length + boxSep.length + boxStart.length;

        // More error checking
        if(isNaN(numCharsPerLine) || numCharsPerLine <= (numFormatCharsPerLine + 4)) {
            return 'textBarChart: There was an error, requested number of characters was too low'
        }

        // Get pretty strings for the values
        var prettyMax = this.numberWithCommas(maximum);
        var prettyMin = '';
        if(minimum > 0) {
            prettyMin = this.numberWithCommas(minimum);
        }
        var prettyValue = this.numberWithCommas(value);
        // Calculate the percentage, to nearest whole number
        const valuePercent = (value / (maximum - minimum));

        // calculate the box
        charsToLeft = Math.round((numCharsPerLine - 1) * valuePercent);
        charsToRight = (numCharsPerLine - 2) - charsToLeft;

        // Generate the box
        output += ' ' + boxTop.repeat(numCharsPerLine - 2) + ' ' + '\n';
        var k = 0;
        for(var i = 0; i < numLines; i++) {
            output += boxStart;
            for(var j = 0; j < charsToLeft; j++) {
                if(k >= boxFill1.length) {
                    k = 0;
                }
                output += boxFill1[k];
                k++;
            }
            output += boxFill2.repeat(charsToRight) + boxEnd + '\n';
        }
        output += ' ' + boxBot.repeat(numCharsPerLine - 2) + ' ' + '\n';

        // // Generate values line
        var valuesStr = "Current value: " + prettyValue + valueSuffix + "\n" + "Target value: " + prettyMax + valueSuffix + "\n";
        valuesStr += `${Math.round(valuePercent * 100)}% toward levelling your alliance`;
        // var valuesStr = prettyMin;
        // var valueStartPos = (charsToLeft - prettyMin.length) - (Math.floor(prettyValue.length / 2));
        // if (valueStartPos <= 0) {
        //     valueStartPos = 1;
        // }
        // valuesStr += ' '.repeat(valueStartPos) + prettyValue;
        // var maxStartPos = (charsToRight - prettyMin.length - prettyValue.length) - prettyMax.length;
        // if(maxStartPos <= 0) {
        //     maxStartPos = 1;
        // }
        // valuesStr += ' '.repeat(maxStartPos) + prettyMax;
        valuesStr += '\n';

        // Append the output to the values string
        output = valuesStr + output;

        // Return our chart to the user
        return output;
    }
}
