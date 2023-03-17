//react
import { useCallback, useEffect, useState } from 'react';

//css
import './App.css';

//data
import { wordsList } from './data/words';

//components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
]

function App() {
  const guessesQty = 3
  const [gameStage, setGameStage] = useState(stages[0].name)
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState()
  const [pickedCategory, setPickedCategory] = useState()
  const [letters, setLetters] = useState()

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(0)


  // return a random category and word
  const pickWordAndCategory = useCallback(() => {
    //pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    //pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return { word, category }
  }, [words])
  //start the secret word 
  const startGame = useCallback(() => {
    clearLetterStates()
    //select random category and word
    const { word, category } = pickWordAndCategory()

    //array of letters
    let wordLetters = word.split("")

    wordLetters = wordLetters.map((l) => l.toLowerCase())


    //fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)
    setGameStage(stages[1].name)
  }, [pickWordAndCategory])


  //verify the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();
    //chech if letter has already utilized
    if (guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return
    }
    //push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetter) => [
        ...actualGuessedLetter,
        normalizedLetter
      ])
    } else {
      setWrongLetters((actualWrongLetter) => [
        ...actualWrongLetter,
        normalizedLetter
      ])

      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  //check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      clearLetterStates()

      setGameStage(stages[2].name)
    }
  }, [guesses])

  //check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    //win confition
    if (guessedLetters.length === uniqueLetters.length) {
      //add score
      setScore((actualScore) => (actualScore += 100))

      //restart the game 
      startGame()
    }
  }, [guessedLetters, letters, startGame])

  //retry
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)

    setGameStage(stages[0].name)
  }

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" &&
        <Game
          verifyLetter={verifyLetter}
          pickedCategory={pickedCategory}
          pickedWord={pickedWord}
          guessedLetters={guessedLetters}
          guesses={guesses}
          score={score}
          wrongLetters={wrongLetters}
          letters={letters} />}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  )

}
export default App;
