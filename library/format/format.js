/*
 * @Author: BanderDragon 
 * @Date: 2019-03-14
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-12 02:26:23
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
    }
}
