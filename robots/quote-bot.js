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

function getRandomAnswer() {
    const happyAnswers = [
        'não fica triste!',
        'não fique assim!',
        'vai dar tudo certo!',
    ]
    return happyAnswers[Math.floor(Math.random() * happyAnswers.length)]
}