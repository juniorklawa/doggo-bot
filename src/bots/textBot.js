export function getRandomSnippet() {
  const sadQuotes = [
    'to na bad',
    'to triste',
    'estou triste',
    'eu to muito triste',
    'eu tô na bad',
  ]

  return sadQuotes[Math.floor(Math.random() * sadQuotes.length)]
}
