/**
 * @Date:   2020-03-29T16:40:40+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: format.js
 * @Last modified time: 2020-03-29T18:42:59+01:00
 */

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
    }
}
