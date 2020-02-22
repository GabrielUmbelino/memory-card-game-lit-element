import { LitElement, html, css } from 'lit-element';

export class CardElement extends LitElement {
  static get properties() {
    return {
      flipped: { type: Boolean },
      face: { type: String },
      disabled: { type: Boolean}
    };
  }

  firstUpdated() {
    this.shadowRoot.querySelector('.front h2').innerHTML = this.face;
  }

  static get styles() {
    return css`
        h2 {
          font-size: 80px;
          margin: 5px 0 0;
        }
        .card {
          height: 180px;
          width: 180px;
          margin: 5px;
          cursor: pointer;
          position: relative;
          transform-style: preserve-3d;
          transition: transform .65s;
          box-shadow: 0px 2px 4px gray;
        }
        
        .card figure {
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
        }
        
        .front {
          transform: rotateY(180deg);
          background-color: lightpink;
        }

        .back {
          background-color: #b6e6ff;
        }

        .card.flipped {
          transform: rotateY(180deg);
        }

        .card.disabled .back{
          background-color: #dedede;
        }
    `;
  }

  render() {
    return html`
      <div 
        class="card ${this.flipped ? 'flipped' : ''} ${this.disabled ? 'disabled' : ''}" 
        @click="${this.handleFlip}"
      >
        <figure class="front">
          <h2></h2>
        </figure>
        <figure class="back">
        </figure>
      </div>
    `;
  }

  handleFlip() {
    if (this.flipped || this.disabled) {
      return false;
    }

    const event = new CustomEvent('flipped', {
      detail: {
        flipped: !this.flipped
      }
    });
    this.dispatchEvent(event);
  }
}

customElements.define('card-element', CardElement);
