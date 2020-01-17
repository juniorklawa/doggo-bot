const Twit = require('twit')
const express = require('express')
const app = express()



const bot = new Twit({
    consumer_key: 'dQiM3LFfBH9WL0fFqZ9UW4LRA',
    consumer_secret: 'TspJLkheHlm89vt3dLkVXaitMVFj2iSYNBfm07mQIQfmwubMz4',
    access_token: '1119352323178926081-yVuRyRZDFFQNEeuYFKaLrNUxY9eSEX',
    access_token_secret: 'QVHkfbpnd3wAGcGy1ZMnk19NU3emTgBV3bLDPTh3nFRh6',
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL: true,     // optional - requires SSL certificates to be valid..
})


let jsonData

const tweetsList = []

function answerTweet(tweet) {
    const answer = {
        status: 'Olá @' + 'DoggoTheBot',
        in_reply_to_status_id: '' + '1217989043377582080'
    }

    bot.post('statuses/update', answer, (err, data, response) => console.log(err))
}


/*async function searchTweet() {
     bot.get('search/tweets', { q: 'oieusouogoku since:2011-07-11', count: 1 }, function (err, data, response) {
        const { statuses } = data

        jsonData = statuses.map(tweet => tweetsList.push(tweet))
        jsonData = statuses;
    })
}*/



//answerTweet('a')

app.get('/data', (req, res) => {
    return res.json(tweetsList)
})

app.listen(3333);








/*bot.post('statuses/update', {
    status: '@Everelindo Teste!',
    in_reply_to_status_id: '1151663004326539265'
}, function (err, data, response) {
    if (err) {
        console.log(err)
    } else {
        console.log(data.text + ' tweeted!')
    }
})*/



