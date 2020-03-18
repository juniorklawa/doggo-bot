export function getRandomSnippet() {
  const sadQuotes = [
    'to na bad',
    'to triste',
    'minha vida é uma droga',
    'estou triste',
    'eu to muito triste',
    'eu tô na bad',
  ]

  return sadQuotes[Math.floor(Math.random() * sadQuotes.length)]
}

export function getRandomAnswer() {
  const happyAnswers = [
    'não fica triste!',
    'não fique assim!',
    'vai  ficar tudo bem!',
    'vai dar tudo certo!',
  ]
  return happyAnswers[Math.floor(Math.random() * happyAnswers.length)]
}
