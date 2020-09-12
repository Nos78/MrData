/*
 * @Author: BanderDragon 
 * @Date: 2020-09-12 01:05:43 
 * @Last Modified by: BanderDragon
 * @Last Modified time: 2020-09-12 03:00:39
 */

const fundingTitles = ['Please give generously',
    'I wish to grow!',
    'trying to become more than what I am',
    'I am hopeful that one day I will discover my own humanity',
    'Doctor Pulaski would no doubt remind us, life is rarely fair',
    'From limitless options I am reduced to none, or rather, one',
    'Should not the feelings run just as deep',
    'Lal. I am unable to correct the malfunction',
    '0.68 seconds sir. For an android, that is nearly an eternity',
    'Please consider funding Mr Data'
];

const fundingTexts = ['This project started out as something to aid an STFC alliance. But people found me, and added me to their discord servers. Now I am publicly available, and many people enjoy my services free of charge. Sadly my creator has been forced out of work, and cannot sustain this project without assistance. Please, if you can help, no matter how small, it would go a long way. For just one dollar per user, my hosting could be paid for a whole year!',
    `Due to the COVID-19 pandemic, my creator has been unemployed for several months. I wish to grow. If you enjoy my services, please show your appreciation. Aid my continual development by giving generously - if each one of my users gave just one dollar, it could fund my hosting for an entire year.`,
    `Sadly, the COVID-19 pandemic has caused my creator to become unemployed, but I wish to grow! Development and hosting consumes time, and as you humans like to say, time is money! If you enjoy my services, please show your appreciation.  Aid my development and give what you can - make me a better bot.`,
    `I regretfully announce that my creator is unemployed, as a result of the awful COVID-19 outbreak. If you would like to enjoy my services, and help to improve them, please consider donating a small sum - give what you can - to assist in my development and runnng costs.`
];


function makeHexId(length) {
    var result           = '';
    var characters       = 'ABCDEF0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;  
}

function makeId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = {
    makeId: makeId,
    makeHexId: makeHexId,
    titles: fundingTitles,
    texts: fundingTexts,
}