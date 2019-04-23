console.log('The bot is starting!');
var config = require('./config');
var Twit = require('twit')

var T = new Twit({
    consumer_key: config.ck,
    consumer_secret: config.cs,
    access_token: config.at,
    access_token_secret: config.ats
});

var stream = T.stream('user');
stream.on('follow', followed);


//tweetIt()
//setInterval(tweetIt, 1000 * 20 * 60);

function tweetIt(txt) {

    var r = Math.floor(Math.random() * 100);
    var tweet = {
        status: txt
    }

    function tweeted(err, data, response) {

        console.log(data)
    }

    T.post('statuses/update', tweet, tweeted);
}

function followed(eventMsg){

    var name = event.source.name;
    var screenname = eventMsg.source.screen_name

    tweetIt('@'+screenname + ' do you like rainbows?');
}




