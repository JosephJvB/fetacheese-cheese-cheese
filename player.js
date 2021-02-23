class Player {
    id = 0
    hand = { x: [new Card()] } // intellisense
    sets = 0
    targets = []
    onSuccess = () => null
    onFail = () => null
    onFish = () => null
    constructor(id) {
        if(isNaN(id)) return
        this.id = id
        this.hand = {}
        this.targets = []
        this.onSuccess = null
        this.onFail = null
        this.onFish = null
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
    startTurn() {
        if(Object.keys(this.hand).length == 0) {
            this.onFail()
        }
    }
    fishCards(value) {
        const cards = this.hand[value]
        if(cards) delete this.hand[value]
        console.log('cards found:', cards && cards.map(c => c.value))
        return cards
    }
}
class Human extends Player {
    handEl = document.querySelector('.hand')
    deckEl = document.querySelector('.deck')
    stacks = { x: new CardStack() }
    constructor(id) {
        super(id)
        this.stacks = {}
        this.deckEl.addEventListener('click', () => {
            if(!this.onFish) return
            this.onFish()
        })
    }
    handleEndTurn(cardValue) {
        if(!this.onSuccess || !this.onFail) {
            return
        }
        console.log('human guessed', cardValue)
        const target = this.targets[0] // for now just ask computer
        const foundCards = target.fishCards(cardValue)
        if(foundCards) {
            for(const c of foundCards) this.addToHand(c)
            this.onSuccess()
        } else {
            this.onFail()
        }
    }
    addToHand(card) {
        super.addToHand(card)
        // console.log('human add to hand', card.value)
        if(!this.stacks[card.value]) {
            this.stacks[card.value] = new CardStack(card.value)
            this.stacks[card.value].el.addEventListener('click', () => {
                this.handleEndTurn(card.value)
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
    startTurn() {
        const target = this.targets[Math.floor(Math.random() * this.targets.length)]
        const cardOpts = Object.keys(this.hand)
        if(!cardOpts.length) {
            // no cards in hand - go straight to fish!
            setTimeout(() => this.onFail(), 1000)
            setTimeout(() => this.onFish(), 2000)
            return
        }
        const askCard = cardOpts[Math.floor(Math.random() * cardOpts.length)]
        console.log('🖥 guessed', askCard)
        const foundCards = target.fishCards(askCard)
        if(foundCards) {
            setTimeout(() => {
                for(const c of foundCards) super.addToHand(c)
                this.onSuccess()
            }, 1000)
        } else {
            setTimeout(() => this.onFail(), 1000)
            setTimeout(() => this.onFish(), 2000)
        }
    }
}