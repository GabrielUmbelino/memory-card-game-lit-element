import { LitElement, html, css } from 'lit-element';
import '../cardElement'
export class MemoryCardGame extends LitElement {

  static get properties() {
    return {
      cards: { type: Array },
      matchedCards: { type: Array },
      points: { type: Number },
      started: { type: Boolean },
      possibleCardFaces: { type: Array },
      clicks: { type:  Number },
      score: { type: Number }
    };
  }

  constructor() {
    super();
    this.possibleCardFaces = ["&#x1F602;", "&#x1F60E;", "&#x1F60D;", "&#x1F61C;", "&#x1F643;", "&#x1F913;"];
    this.cards = this.getFaces();
    this.matchedCards = [];
    this.started = false;
    this.points = 0;
    this.clicks = 0;
    this.score = 0;
  }

  static get styles() {
    return css`
      .start-container {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #ffffffad;
        z-index: 999;
        z-index: 999;
      }

      .start-container button {
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 20px;
      }

      .container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        max-width: 900px;
        perspective: 800px;
        margin: auto;
      }
    `;
  }

  render() {
    const elements = this.cards.map((face, index) => {
      return html`
         <card-element
            face="${face.face}"
            ?disabled='${this.isDisabled()}'
            ?flipped="${face.flipped}"
            @flipped="${(e) => this.flipHandler(e, index)}">
         </card-element>
       `
    });

    const start = html`
      <div class="start-container">
        <button @click="${this.start}">
          start
        </button>
      </div>
    `;

    const score = html`
      <p>
        score: ${this.score} clicks: ${this.clicks}
      </p>
    `;

    return html`
      ${!this.started ? start : null}
      <section class="container">
        ${elements}
      </section>
      <section class="container">
        ${this.clicks || this.score ? score : null}
      </section>
    `;
  }

  updated(changedProperties) {
    changedProperties.forEach((_newValue, propName) => {
      if(propName === 'cards') {
        this.facesChangeHandler(this.cards);
      }
    });
  }

  start() {
    console.log('started points:', this.points);

    if (this.score) {
      this.cards = [];
      setTimeout(() => {
        this.cards = this.getFaces();
        this.flipAll();
      }, 100)  
    } else {
      this.flipAll();
    }

    this.started = true;
    setTimeout(this.flipAll.bind(this), 3000)
  }

  generate() {
    console.log('cards', this.cards)
    this.cards = [];
    setTimeout(() => {
      this.cards = this.getFaces();
    }, 5)
    console.log('cards', this.cards)
  }


  flipAll() {
    this.cards = this.cards.map(({ face, flipped }) => ({face, flipped: !flipped}));
  }

  flipHandler(e, index) {
    this.clicks = this.clicks + 1;
    const cards = [...this.cards];
    cards[index].flipped = e.detail.flipped;
    this.cards = cards;
  }

  facesChangeHandler(newFaces) {
    if (!newFaces || !newFaces.length) {
      return;
    }
    let flippedCards = this.getFlipped(newFaces);
    if (this.matchedCards) {
      flippedCards = this.getNonMatchedFaces();
    }

    if (flippedCards && flippedCards.length == 2) {
      const equalFaces = this.equalFaces(...flippedCards);
      if (equalFaces){
        this.right();
      } else {
        this.wrong();
      }
    } 
  }

  right() {
    this.points = this.points ++;
    this.matchedCards = this.getFlipped(this.cards);
    this.isFinished();
    console.log('right answer points:', this.points);
    const event = new CustomEvent('score-update', {
      detail: {
        points: this.points
      }
    });
    this.dispatchEvent(event);
  }

  isFinished() {
    const flipedCards = this.getFlipped(this.cards);
    if (flipedCards.length == this.cards.length) {
      setTimeout(this.resetCards.bind(this), 1000);
      setTimeout(() => {
        this.score = !this.score ? this.clicks : this.clicks < this.score ? this.clicks : this.score;
        this.clicks = 0;
        this.started = false;
        this.matchedCards = [];
      }, 2000);
    }
  }

  wrong() {
    console.log('wrong answer');
    setTimeout(() => {
      const cards = [...this.cards];
      const wrongCards = this.matchedCards 
        ? this.getNonMatchedFaces()
        : this.getFlipped(cards);
      wrongCards.forEach(wrongCard => {
        cards.find((card, index) => {
          if(card.face == wrongCard.face && card.flipped) {
            cards[index].flipped = false;
          }
        })
      })
      this.cards = cards;
    }, 1000);

  }

  resetCards() {
    this.cards = this.cards.map(({face}) => ({ face, flipped: false }))
  }

  getFlipped(faces) {
    if (!faces) {
      return [];
    }
    
    return faces.filter(({flipped}) => ( flipped ));
  }

  equalFaces(face1, face2) {
    return face1.face === face2.face;
  }

  isDisabled() {
    if (!this.started) {
      return true;
    }
    const nonMatchedFaces = this.getNonMatchedFaces()
    if (nonMatchedFaces && nonMatchedFaces.length == 2) {
      return true;
    }
    return false;
  }

  getFaces() {
    const faces = [...this.possibleCardFaces, ...this.possibleCardFaces]
      .map(d => ({r: Math.random(), d}))
      .sort((a, b) => a.r - b.r)
      .map(d => d.d);
    return faces.map(face => ({ face, flipped: false }));;
  }

  getNonMatchedFaces() {
    const flipped = this.getFlipped(this.cards);
    return this.matchedCards ? flipped.filter(d => !this.matchedCards.includes(d)) : flipped;
  }

}

customElements.define('memory-card-game', MemoryCardGame);
