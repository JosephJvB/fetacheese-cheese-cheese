// https://bicyclecards.com/how-to-play/go-fish/
// https://bost.ocks.org/mike/shuffle/
class Game {
    deck = [new Card()]
    players = [new Player()]
    currentPlayer = new Player()
    playerIndex = 0
    constructor() {
        this.numPlayers = NUM_PLAYERS
        this.deck = []
        this.players = []
        this.currentPlayer = null
        this.setDeck()
        this.dealCards()
        this.startGame()
    }
    startGame() {
        this.currentPlayer = this.players[0]
        this.doTurn()
    }
    doTurn() {
        if(!this.deck.length) {
            return alert([
                'game over!',
                'player: ' + this.players[0].sets,
                'computer: ' + this.players[1].sets
            ].join('\n'))
        }
        this.currentPlayer.targets = this.players.filter(p => p.id != this.currentPlayer.id)
        this.currentPlayer.onSuccess = () => this.onSuccess()
        this.currentPlayer.onFail = () => this.onFail()
        this.currentPlayer.startTurn()
    }
    onSuccess() {
        console.log('guess: ✅')
        this.doTurn()
    }
    onFail() {
        this.currentPlayer.onSuccess = null
        this.currentPlayer.onFail = null
        this.currentPlayer.onFish = () => this.goFish()
        console.log('guess: ❌')
    }
    goFish() {
        this.currentPlayer.onFish = null
        console.log('go fish 🐟 caught', this.deck[0].value)
        this.currentPlayer.addToHand(this.deck[0])
        this.deck.splice(0, 1)
        this.playerIndex++
        if(this.playerIndex > this.players.length - 1) {
            this.playerIndex = 0
        }
        const stamp = this.playerIndex == 0 ? '👱‍♂️👱‍♂️👱‍♂️👱‍♂️' : '🖥🖥🖥🖥'
        console.log(stamp, 'guessing')
        this.currentPlayer = this.players[this.playerIndex]
        this.doTurn()
    }
    dealCards() {
        for(let i = 0; i < this.numPlayers; i++) {
            if(i == 0) {
                this.players.push(new Human(i))
            } else {
                this.players.push(new Computer(i))
            }
        }
        const handNum = this.numPlayers < 5 ? 7 : 5
        for(let i = 0; i < handNum; i++)
        for(const p of this.players) {
            p.addToHand(this.deck[0])
            this.deck.splice(0, 1)
        }
    }
    setDeck() {
        const suits = ['hearts', 'clubs', 'spades', 'diamonds']
        const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
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