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


let jsonData = null;

function answerTweet(tweet) {
    const answer = {
        status: 'Oi @' + tweet.user.screen_name,
        in_reply_to_status_id: '' + tweet.id_str
    }
    bot.post('statuses/update', answer, (err, data, response) => console.log(data))
}


async function searchTweet() {
    try {
        const result = await bot.get('search/tweets', { q: 'aquepenaseria since:2011-07-11', count: 3 })
        const { data } = result
        const tweetsList = data.statuses
        jsonData = tweetsList[0]
        answerTweet(jsonData)
    } catch (e) {
        console.error(e)
    }
}

searchTweet()
app.get('/data', (req, res) => {
    return res.json(jsonData)
})

app.listen(3333);







