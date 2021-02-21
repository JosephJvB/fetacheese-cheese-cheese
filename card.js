class Card {
    suit = ''
    value = ''
    constructor(suit, value) {
        this.suit = suit
        this.value = value
    }
}
class CardStack {
    value = ''
    count = 0
    el = document.createElement('div')
    valueEl = document.createElement('p')
    complete = false
    constructor(value) {
        if(!value) return
        this.el.className = 'card-stack'
        this.valueEl.style.margin = 'auto'
        this.value = value
        this.el.appendChild(this.valueEl)
    }
    addCard() {
        this.count++
        this.valueEl.innerText += this.value
    }
}