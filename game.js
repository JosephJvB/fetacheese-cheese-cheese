// https://bicyclecards.com/how-to-play/go-fish/
// https://bost.ocks.org/mike/shuffle/
class Game {
    deck = [new Card()]
    players = []
    activePlayer = 0
    gameOver = false
    constructor() {
        this.numPlayers = NUM_PLAYERS
        this.setDeck()
        this.dealCards()
        this.startGame()
    }
    async startGame() {
        while(this.deck.length) {
            const currentPlayer = this.players[this.activePlayer]
            const validTargets = this.players.filter(p => p.id != currentPlayer.id)
            const caught = await currentPlayer.turn(validTargets)
            if(!caught) {
                console.log('guess: ❌')
                // go fish!
                await currentPlayer.goFish()
                console.log('go fish 🐟 caught', this.deck[0].value)
                currentPlayer.addToHand(this.deck[0])
                this.deck.splice(0, 1)
                await new Promise((r) => setTimeout(r, 2000))
                this.activePlayer++
                if(this.activePlayer > this.players.length - 1) {
                    this.activePlayer = 0
                }
                const stamp = this.activePlayer == 0 ? '👱‍♂️👱‍♂️👱‍♂️👱‍♂️' : '🖥🖥🖥🖥'
                console.log(stamp, 'guessing')
            } else {
                console.log('guess: ✅')
            }
            console.log('🏁 turn complete. cards in deck:', this.deck.length)
        }
        alert([
            'game over!',
            'player: ' + this.players[0].sets,
            'computer: ' + this.players[1].sets
        ].join('\n'))
    }
    dealCards() {
        for(let i = 0; i < this.numPlayers; i++) {
            if(i == 0) {
                this.players.push(new Human(i))
            } else {
                this.players.push(new Computer(i))
            }
        }
        let handNum = this.numPlayers < 5 ? 7 : 5
        for(let i = 0; i < handNum; i++)
        for(const p of this.players) {
            p.addToHand(this.deck[0])
            this.deck.splice(0, 1)
        }
    }
    setDeck() {
        const suits = ['hearts', 'clubs', 'spades', 'diamonds']
        const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A']
        this.deck = []
        for(const s of suits)
        for(const c of cards) {
            this.deck.push(new Card(s, c))
        }
        this._shuffleDeck()
    }
    _shuffleDeck() {
        let deckLength = this.deck.length
        while(deckLength) {
            let rnd = Math.floor(Math.random() * deckLength)
            deckLength-- // length is + 1 to the last index!
            const tmp = this.deck[deckLength]
            this.deck[deckLength] = this.deck[rnd]
            this.deck[rnd] = tmp
            deckLength--
        }
    }
}