class Player {
    id = 0
    hand = { x: [new Card()] } // intellisense
    sets = 0
    constructor(id) {
        if(isNaN(id)) return
        this.id = id
        this.hand = {}
    }
    addToHand(card) {
        if(!this.hand[card.value]) this.hand[card.value] = []
        this.hand[card.value].push(card)
        if(this.hand[card.value].length == 4) {
            console.log('➕ made a set!', card.value)
            this.sets++
            delete this.hand[card.value]
        }
    }
    async turn() {
        throw 'Must override base turn method'
    }
    async goFish() {
        throw 'Must override base goFish method'
    }
    fishCards(value) {
        const cards = this.hand[value]
        if(cards) delete this.hand[value]
        console.log('cards found:', cards.map(c => c.value))
        return cards
    }
}
class Human extends Player {
    handEl = document.querySelector('.hand')
    deckEl = document.querySelector('.deck')
    stacks = { x: new CardStack() }
    targets = [new Player()]
    endTurn = () => null
    pickupCard = () => null
    constructor(id) {
        super(id)
        this.stacks = {}
        this.targets = []
        this.deckEl.addEventListener('click', () => {
            this.pickupCard()
        })
    }
    goFish() {
        this.deckEl.style.pointerEvents = 'unset'
        return new Promise((resolve) => {
            this.pickupCard = () => {
                this.deckEl.style.pointerEvents = 'none'
                resolve()
            }
        })
    }
    turn(players) {
        this.handEl.style.pointerEvents = 'unset'
        this.targets = players
        return new Promise((resolve) => {
            if(Object.keys(this.hand).length == 0) {
                return resolve(false)
            }
            this.endTurn = (caught) => {
                this.handEl.style.pointerEvents = 'none'
                resolve(caught)
            }
        })
    }
    handleStackClick(cardValue) {
        console.log('human guessed', cardValue)
        const target = this.targets[0] // for now just ask computer
        const foundCards = target.fishCards(cardValue)
        if(foundCards) {
            for(const c of foundCards) this.addToHand(c)
        }
        this.endTurn(!!foundCards)
    }
    addToHand(card) {
        super.addToHand(card)
        // console.log('human add to hand', card.value)
        if(!this.stacks[card.value]) {
            this.stacks[card.value] = new CardStack(card.value)
            this.stacks[card.value].el.addEventListener('click', () => {
                this.handleStackClick(card.value)
            })
            this.handEl.appendChild(this.stacks[card.value].el)
        }
        if(this.stacks[card.value].count + 1 == 4) {
            this.handEl.removeChild(this.stacks[card.value].el)
            delete this.stacks[card.value]
        } else {
            this.stacks[card.value].addCard()
        }
    }
    fishCards(value) {
        const cards = super.fishCards(value)
        const stack = this.stacks[value]
        if(stack) {
            this.handEl.removeChild(stack.el)
            delete this.stacks[value]
        }
        return cards
    }
}
class Computer extends Player {
    constructor(id) {
        super(id)
        document.querySelector('h1').addEventListener('click', () => {
            console.log(Object.keys(this.hand).map(k => this.hand[k].map(c => c.value).join('')))
        })
    }
    async turn(players) {
        await new Promise((r) => setTimeout(r), 500)
        const target = players[Math.floor(Math.random() * players.length)]
        const cardOpts = Object.keys(this.hand)
        if(!cardOpts.length) {
            return false // no cards in hand - go straight to fish!
        }
        const askCard = cardOpts[Math.floor(Math.random() * cardOpts.length)]
        console.log('🖥 guessed', askCard)
        const foundCards = target.fishCards(askCard)
        if(foundCards) {
            for(const c of foundCards) super.addToHand(c)
        }
        await new Promise((r) => setTimeout(r), 500)
        return !!foundCards
    }
    async goFish() {
        console.log('-- computer go fish --')
        await new Promise((r) => setTimeout(r), 500)
    }
}