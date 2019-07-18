var Twit = require('twit')



var T = new Twit({
    consumer_key: 'dQiM3LFfBH9WL0fFqZ9UW4LRA',
    consumer_secret: 'TspJLkheHlm89vt3dLkVXaitMVFj2iSYNBfm07mQIQfmwubMz4',
    access_token: '1119352323178926081-yVuRyRZDFFQNEeuYFKaLrNUxY9eSEX',
    access_token_secret: 'QVHkfbpnd3wAGcGy1ZMnk19NU3emTgBV3bLDPTh3nFRh6',
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL: true,     // optional - requires SSL certificates to be valid.
})

//
//  tweet 'hello world!'
//

/*T.post('statuses/update', { status: 'hello world!' }, function (err, data, response) {
    console.log(data)
})*/

T.get('search/tweets', { q: 'xptr123 since:2018-07-11', count: 100 }, function (err, data, response) {
    console.log(data)
    //console.log(response)
})



T.post('statuses/update', {
    status: '@Everelindo Teste!',
    in_reply_to_status_id: '1151663004326539265'
}, function (err, data, response) {
    if (err) {
        console.log(err)
    } else {
        console.log(data.text + ' tweeted!')
    }
})



