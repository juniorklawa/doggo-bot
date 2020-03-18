const watsonApiKey = require('../../credentials/watson-nlu.json').apikey

const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1')
const { IamAuthenticator } = require('ibm-watson/auth')

const nlu = new NaturalLanguageUnderstandingV1({
  authenticator: new IamAuthenticator({ apikey: watsonApiKey }),
  version: '2018-04-05',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/',
})
export async function tweetFilterBot(tweetList) {
  console.log('filtering tweets...')
  let tweets = analyseTweet(tweetList)
  function customFilter(tweetList) {
    console.log('applying custom filter...')
    const filteredTweets = tweetList.filter(tweet => {
      const { text, metadata } = tweet
      return (
        metadata.iso_language_code === 'pt' &&
        !text.includes('RT') &&
        !text.includes('cachorro') &&
        !text.includes('Cachorro')
      )
    })
    return filteredTweets
  }

  async function analyseTweet(tweetList) {
    console.log('applying nlu filter...')
    const filteredTweets = customFilter(tweetList).filter(async tweet => {
      const { text } = tweet
      try {
        const fetchWatson = await nlu.analyze({
          text: text,
          features: {
            sentiment: {},
          },
        })
        const { score } = fetchWatson.result.sentiment.document
        return score < -0.8
      } catch (e) {
        console.error(e)
      }
    })
    return filteredTweets
  }
  return tweets
}
