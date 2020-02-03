const Twit = require('twit')
const express = require('express')
const fs = require('fs')
const config = require('./config.js')
const download = require('image-downloader')
const axios = require('axios')
const moment = require('moment')
const app = express()

//@TODO filter tweet array by word cachorro and pt-br language
//@TODO Use moment for search query date
//@TODO Train model to indentify puppies
//@TODO Delete images after it has been used


const bot = new Twit(config)

let tweetsList = [];

async function getRandomImg() {
    const randomImage = await axios.get('https://dog.ceo/api/breeds/image/random')
    const { message } = randomImage.data

    return message
}

async function downloadImg() {
    try {
        const options = {
            url: await getRandomImg(),
            dest: './img/'
        }
        const { filename, image } = await download.image(options)
        console.log(filename) // => /path/to/dest/image.jpg
        return filename
    } catch (e) {
        console.error(e)
    }
}

async function answerTweets(tweetsList) {
    try {
        const imagePath = `./${await downloadImg()}`
        const b64content = fs.readFileSync(imagePath, { encoding: 'base64' })
        await tweetsList.map((tweet) => {
            const { user, id_str } = tweet

            const answer = {
                status: ':) @' + user.screen_name,
                in_reply_to_status_id: '' + id_str
            }

            bot.post('media/upload', { media_data: b64content }, function (err, data, response) {
                if (err) {
                    console.log('ERROR:');
                    console.log(err);
                }
                else {
                    console.log('Image uploaded!');
                    console.log('Now tweeting it...');

                    bot.post('statuses/update', {
                        
                        answer: answer,
                        media_ids: new Array(data.media_id_string)
                    },
                        function (err, data, response) {
                            if (err) {
                                console.log('ERROR:');
                                console.log(err);
                            }
                            else {
                                console.log('Posted an image!');
                            }
                        }
                    );
                }
            });

        })

    } catch (e) {
        console.error(e)
    }
    console.log('answering tweets...')
}


function getRandomQuote() {
    const sadQuotes = [
        'to na bad',
        'to triste',
        'estou triste',
        'eu to muito triste',
        'eu tô na bad'
    ]

    return sadQuotes[Math.floor(Math.random() * sadQuotes.length)]
}

async function searchTweet() {

    try {
        const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
        const today = moment().format('YYYY-MM-DD')

        const result = await bot.get('search/tweets', { q: `${'achei que tinha perdido minha chave'}  since:${yesterday}`, count: 5, locale: 'pt-br' })
        const { data } = result
        const tweetsData = data.statuses
        tweetsList = tweetsData
    } catch (e) {
        console.error(e)
    }
    console.log('searching tweets...')
}


async function runBot() {
    try {
        await searchTweet()
        await answerTweets(tweetsList)
        // await genericTweet()
        // await downloadImg()
        // await genericTweet()
    } catch (e) {
        console.error(e)
    }

}

runBot()
app.get('/tweets', (req, res) => {
    return res.json(tweetsList)
})



app.listen(3333);







