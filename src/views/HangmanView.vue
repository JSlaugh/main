<script>
import axios from 'axios'
import { Tree } from '../data/fsdatastructures'
import { Person } from '../data/fsdatastructures'

export default {
  created() {
    let uri = window.location.search.substring(1)
    let params = new URLSearchParams(uri)
    this.token = params.get('fstoken')
    console.log(this.token)
    this.familySearchDataFinal = this.getFamilySearchData()
  },
  mounted() {
    this.wordDisplay = this.$refs.wordDisplay
    this.guessesText = this.$refs.guessesText
    this.keyboardDiv = this.$refs.keyboardDiv
    this.hangmanImage = this.$refs.hangmanImage
    this.gameModal = this.$refs.gameModal
    this.playAgainBtn = this.$refs.playAgainBtn
    for (let i = 97; i <= 122; i++) {
      const button = document.createElement('button')
      button.innerText = String.fromCharCode(i)
      this.keyboardDiv.appendChild(button)
      button.addEventListener('click', (e) => this.initGame(e.target, String.fromCharCode(i)))
    }
    this.getRandomWord()
    this.playAgainBtn.addEventListener('click', this.getRandomWord)
  },
  data: () => ({
    token: '',
    accessToken: '',
    familySearchDataFinal: {},
    wordDisplay: '',
    guessesText: '',
    keyboardDiv: '',
    hangmanImage: '',
    gameModal: '',
    playAgainBtn: '',
    currentWord: '',
    correctLetters: [],
    wrongGuessCount: '',
    maxGuesses: 6
  }),
  methods: {
    async parseJWT(token) {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      return JSON.parse(jsonPayload)
    },
    async getFamilySearchData() {
      let fsData = await this.parseJWT(this.token)
        .then((result) => {
          return result
        })
        .catch((e) => {
          console.log(e)
        })
      console.log(fsData)
      const url = `https://api.familysearch.org/platform/tree/ancestry?person=${fsData.fs_user.pid}&generations=5&personDetails&marriageDetails=`
      var familySearchData
      await axios
        .get(url, {
          headers: { Authorization: `Bearer ${fsData.fs_access_token}` }
        })
        .then((res) => {
          familySearchData = {
            data: res.data,
            accessToken: fsData.fs_access_token,
            userPID: fsData.fs_user.pid
          }
          return familySearchData
        })
        .catch((err) => {
          console.log(err)
        })
      familySearchData = this.convertFamilySearchData(familySearchData)
      return familySearchData
    },
    convertFamilySearchData(rawFSData) {
      let newFSData = new Tree()

      if (rawFSData && rawFSData.data.persons) {
        for (var i in rawFSData.data.persons) {
          let person = new Person(rawFSData.data.persons[i])
          newFSData.addPerson(person)
        }
      }
      newFSData.insertRelationships(rawFSData.data.relationships)
      console.log(newFSData)
      return newFSData
    },

    resetGame() {
      // Ressetting game variables and UI elements
      this.correctLetters = []
      this.wrongGuessCount = 0
      this.hangmanImage.src = '/src/assets/hangman-0.svg'
      this.guessesText.innerText = `${this.wrongGuessCount} / ${this.maxGuesses}`
      this.wordDisplay.innerHTML = this.currentWord
        .split('')
        .map(() => `<li class="letter"></li>`)
        .join('')
      this.keyboardDiv.querySelectorAll('button').forEach((btn) => (btn.disabled = false))
      this.gameModal.classList.remove('show')
    },

    getRandomWord() {
      // Selecting a random word and hint from the wordList
      this.currentWord = 'ancestor' // Making currentWord as random word
      document.querySelector('.hint-text b').innerText = 'Info about ancestor here'
      this.resetGame()
    },
    gameOver(isVictory) {
      // After game complete.. showing modal with relevant details
      const modalText = isVictory ? `You found the word:` : 'The correct word was:'
      this.gameModal.querySelector('img').src = `/src/assets/${isVictory ? 'victory' : 'lost'}.gif`
      this.gameModal.querySelector('h4').innerText = isVictory ? 'Congrats!' : 'Game Over!'
      this.gameModal.querySelector('p').innerHTML = `${modalText} <b>${this.currentWord}</b>`
      this.gameModal.classList.add('show')
    },

    initGame(button, clickedLetter) {
      // Checking if clickedLetter is exist on the currentWord
      if (this.currentWord.includes(clickedLetter)) {
        // Showing all correct letters on the word display
        ;[...this.currentWord].forEach((letter, index) => {
          if (letter === clickedLetter) {
            this.correctLetters.push(letter)
            this.wordDisplay.querySelectorAll('li')[index].innerText = letter
            this.wordDisplay.querySelectorAll('li')[index].classList.add('guessed')
          }
        })
      } else {
        // If clicked letter doesn't exist then update the wrongGuessCount and hangman image
        this.wrongGuessCount++
        this.hangmanImage.src = `/src/assets/hangman-${this.wrongGuessCount}.svg`
      }
      button.disabled = true // Disabling the clicked button so user can't click again
      this.guessesText.innerText = `${this.wrongGuessCount} / ${this.maxGuesses}`

      // Calling gameOver function if any of these condition meets
      if (this.wrongGuessCount === this.maxGuesses) return this.gameOver(false)
      if (this.correctLetters.length === this.currentWord.length) return this.gameOver(true)
    }
  }
}
</script>
<template>
  <div class="game-modal" ref="gameModal">
    <div class="content">
      <img src="#" alt="gif" />
      <h4>Game Over!</h4>
      <p>The correct word was: <b>rainbow</b></p>
      <button class="play-again" ref="playAgainBtn">Play Again</button>
    </div>
  </div>
  <div class="container2">
    <div class="hangman-box">
      <img src="#" draggable="false" alt="hangman-img" ref="hangmanImage" />
      <h1>Lineage Letters</h1>
    </div>
    <div class="game-box">
      <ul class="word-display" ref="wordDisplay"></ul>
      <h4 class="hint-text">Fact: <b></b></h4>
      <h4 class="guesses-text">Incorrect guesses: <b ref="guessesText"></b></h4>
      <div class="keyboard" ref="keyboardDiv"></div>
    </div>
  </div>
</template>

<style>
/* Importing Google font - Open Sans */

.container2 {
  display: flex;
  width: 850px;
  gap: 70px;
  padding: 60px 40px;
  background: #fff;
  border-radius: 10px;
  align-items: flex-end;
  justify-content: space-between;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
.hangman-box img {
  user-select: none;
  max-width: 270px;
}
.hangman-box h1 {
  font-size: 1.45rem;
  text-align: center;
  margin-top: 20px;
  text-transform: uppercase;
}
.game-box .word-display {
  gap: 10px;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.word-display .letter {
  width: 28px;
  font-size: 2rem;
  text-align: center;
  font-weight: 600;
  margin-bottom: 40px;
  text-transform: uppercase;
  border-bottom: 3px solid #000;
}
.word-display .letter.guessed {
  margin: -40px 0 35px;
  border-color: transparent;
}
.game-box h4 {
  text-align: center;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 15px;
}
.game-box h4 b {
  font-weight: 600;
}
.game-box .guesses-text b {
  color: #ff0000;
}
.game-box .keyboard {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-top: 40px;
  justify-content: center;
}
:where(.game-modal, .keyboard) button {
  color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 4px;
  text-transform: uppercase;
  background: #5e63ba;
}
.keyboard button {
  padding: 7px;
  width: calc(100% / 9 - 5px);
}
.keyboard button[disabled] {
  pointer-events: none;
  opacity: 0.6;
}
:where(.game-modal, .keyboard) button:hover {
  background: #8286c9;
}
.game-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 0 10px;
  transition: opacity 0.4s ease;
}
.game-modal.show {
  opacity: 1;
  pointer-events: auto;
  transition: opacity 0.4s 0.4s ease;
}
.game-modal .content {
  padding: 30px;
  max-width: 420px;
  width: 100%;
  border-radius: 10px;
  background: #fff;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
.game-modal img {
  max-width: 130px;
  margin-bottom: 20px;
}
.game-modal img[src='/src/assets/victory.gif'] {
  margin-left: -10px;
}
.game-modal h4 {
  font-size: 1.53rem;
}
.game-modal p {
  font-size: 1.15rem;
  margin: 15px 0 30px;
  font-weight: 500;
}
.game-modal p b {
  color: #5e63ba;
  font-weight: 600;
}
.game-modal button {
  padding: 12px 23px;
}

media (max-width: 782px) {
  .container2 {
    flex-direction: column;
    padding: 30px 15px;
    align-items: center;
  }
  .hangman-box img {
    max-width: 200px;
  }
  .hangman-box h1 {
    display: none;
  }
  .game-box h4 {
    font-size: 1rem;
  }
  .word-display .letter {
    margin-bottom: 35px;
    font-size: 1.7rem;
  }
  .word-display .letter.guessed {
    margin: -35px 0 25px;
  }
  .game-modal img {
    max-width: 120px;
  }
  .game-modal h4 {
    font-size: 1.45rem;
  }
  .game-modal p {
    font-size: 1.1rem;
  }
  .game-modal button {
    padding: 10px 18px;
  }
}
</style>
