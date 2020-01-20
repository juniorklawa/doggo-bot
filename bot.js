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


let tweetsList = [];

async function answerTweet(tweetsList) {
    try {

        await tweetsList.map((tweet) => {
            const answer = {
                status: ':) @' + tweet.user.screen_name,
                in_reply_to_status_id: '' + tweet.id_str
            }
            //bot.post('statuses/update', answer, (err, data, response) => console.log(data))
        })

    } catch (e) {
        console.error(e)
    }
    console.log('answering tweets...')
}

//@TODO Upload images
//@TODO Use moment for search query date
//@TODO Search more about query q params
async function searchTweet() {
    try {
        const result = await bot.get('search/tweets', { q: 'quero adotar um cachorro  since:2011-07-11', count: 5 })
        const { data } = result
        const tweetsData = data.statuses
        tweetsList = tweetsData
    } catch (e) {
        console.error(e)
    }
    console.log('searching tweets...')
}

main()
//searchTweet()
app.get('/tweets', (req, res) => {
    return res.json(tweetsList)
})

async function main() {
    try {
        await searchTweet()
        await answerTweet(tweetsList)
    } catch (e) {
        console.error(e)
    }

}

app.listen(3333);







