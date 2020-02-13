const Twit = require("twit");
const express = require("express");
const fs = require("fs-extra");
const config = require("./credentials/config.js");
const download = require("image-downloader");
const moment = require("moment");
const app = express();
const watsonApiKey = require('./credentials/watson-nlu.json').apikey
const cloudinaryConfig = require('./credentials/cloudinary.json')
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const nlu = new NaturalLanguageUnderstandingV1({
    authenticator: new IamAuthenticator({ apikey: watsonApiKey }),
    version: '2018-04-05',
    url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});


//@TODO decent structure
//@TODO add node schedule
//@TODO add tests

const bot = new Twit(config);
let jsonReturn = null;
let tweetsList = [];


async function imgBot() {
    async function getRandomImgURL() {
        const url = cloudinaryConfig.url
        const max = cloudinaryConfig.max_size
        const randomNumber = Math.ceil(Math.random() * max + 1);

        return `${url}${randomNumber}.jpg`;
    }

    async function downloadImg() {
        try {
            const options = {
                url: await getRandomImgURL(),
                dest: "./img/"
            };
            const { filename, image } = await download.image(options);
            return filename;
        } catch (e) {
            console.error(e);
        }
    }

    return downloadImg();
}

async function tweetFilterBot(tweetList) {
    console.log('filtering tweets...')
    let tweets = analyseTweet(tweetList)

    function customFilter(tweetList) {
        console.log('applying custom filter...')
        const filteredTweets = tweetList.filter(tweet => {
            const { text, metadata } = tweet;
            return (
                metadata.iso_language_code === "pt" &&
                !text.includes("RT") &&
                !text.includes("cachorro") &&
                !text.includes("Cachorro")
            );
        });

        return filteredTweets
    }

    async function analyseTweet(tweetList) {
        console.log('applying nlu filter...')
        const filteredTweets = customFilter(tweetList).filter(async (tweet) => {
            const { text } = tweet
            try {
                const fetchWatson = await nlu.analyze(
                    {
                        text: text,
                        features: {
                            sentiment: {}
                        }
                    })
                const { score } = fetchWatson.result.sentiment.document
                return score < -0.7
            } catch (e) {
                console.error(e)
            }
        })
        return filteredTweets

    }
    return tweets
}


//TWIT
async function answerTweets(tweetsList) {
    try {
        const filteredTweets = await tweetFilterBot(tweetsList);
        jsonReturn = filteredTweets;
        await filteredTweets.map(async tweet => {
            const imagePath = `./${await imgBot()}`;
            const b64content = fs.readFileSync(imagePath, { encoding: "base64" });
            const { user, id_str } = tweet;
            bot.post("media/upload", { media_data: b64content }, function (
                err,
                data,
                response
            ) {
                const mediaIdStr = data.media_id_string;
                const altText = "A random puppy picture";
                const meta_params = {
                    media_id: mediaIdStr,
                    alt_text: { text: altText }
                };
                // bot.post("media/metadata/create", meta_params, function (
                //     err,
                //     data,
                //     response
                // ) {
                //     if (!err) {
                //         const params = {
                //             status: `@${
                //                 user.screen_name
                //                 } ${getRandomAnswer()} olha aqui um cachorro fofinho pra te alegrar! \n :)`,
                //             media_ids: [mediaIdStr],
                //             in_reply_to_status_id: "" + id_str
                //         };

                //         bot.post("statuses/update", params, function (
                //             err,
                //             data,
                //             response
                //         ) { });
                //         console.log(`answering tweet with id: ${id_str}`);
                //     }
                // });
            });
        });
    } catch (e) {
        console.error(e);
    }
}
//TEXT
function getRandomQuote() {
    const sadQuotes = [
        "to na bad",
        "to triste",
        "estou triste",
        "eu to muito triste",
        "eu tô na bad"
    ];

    return sadQuotes[Math.floor(Math.random() * sadQuotes.length)];
}
//TEXT
function getRandomAnswer() {
    const happyAnswers = [
        "não fica triste!",
        "não fique assim!",
        "vai dar tudo certo!"
    ];
    return happyAnswers[Math.floor(Math.random() * happyAnswers.length)];
}
//TWIT
async function searchTweet() {
    try {
        const now = moment().format("YYYY-MM-DD");
        const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
        const randomQuote = getRandomQuote();
        const today = moment().format("YYYY-MM-DD");
        const result = await bot.get("search/tweets", {
            q: `${randomQuote}  since:${yesterday}`,
            count: 10
        });
        const { data } = result;
        const tweetsData = data.statuses;
        tweetsList = tweetsData;
        jsonReturn = tweetsList;
    } catch (e) {
        console.error(e);
    }
    console.log("searching tweets...");
}

async function runBot() {
    try {
        fs.emptyDirSync("./img/");
        await searchTweet();
        await answerTweets(tweetsList);
    } catch (e) {
        console.error(e);
    }
}

runBot();
app.get("/tweets", (req, res) => {
    return res.json(jsonReturn);
});

app.listen(3333);
