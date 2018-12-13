class Tooltip extends HTMLElement {
  static get observedAttributes() {
    return ['text'];
  }

  constructor() {
    super();

    this._tooltipContainer = null;
    this._tooltipIcon = null;
    this._tooltipVisible = false;
    this._tooltipText = 'dummy text';
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
        div {
          font-weight: normal;
          background-color: #000;
          color: #fff;
          position: absolute;
          top: 1.5rem;
          left: 0.75rem;
          z-index: 10;
          padding: 0.15rem;
          border-radius: 3px;
          box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.26);
        }

        .highlight {
          background-color: red;
        }

        ::slotted(.highlight) {
          border-bottom: 1px dotted red;
        }

        :host {
          position: relative;
        }

        :host(.important) {
          background: var(--color--primary, #ccc);
          padding: 0.15rem;
        }

        :host-context(p) {
          font-weight: bold;
        }
        
        .icon {
          background-color: #000;
          color: #fff;
          padding: 0.25rem;
          text-align: center;
          border-radius: 50%;
        }
      </style>

      <slot>Some default</slot>
      <span class="icon"> (?)</span>
    `;
  }

  connectedCallback() {
    if (this.hasAttribute('text')) {
      this._tooltipText = this.getAttribute('text');
    }

    this._tooltipIcon = this.shadowRoot.querySelector('span');
    this._tooltipIcon.addEventListener('mouseenter', this._render.bind(this));
    this._tooltipIcon.addEventListener('mouseout', this._render.bind(this));
    this.shadowRoot.appendChild(this._tooltipIcon);
  }

  disconnectedCallback() {
    if (this._tooltipIcon) {
      this._tooltipIcon.removeEventListener(
        'mouseenter',
        this._render.bind(this)
      );
      this._tooltipIcon.removeEventListener(
        'mouseout',
        this._render.bind(this)
      );
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }
    if (name === 'text') {
      this._tooltipText = newValue;
    }
  }

  _render() {
    let element = null;
    if (this._tooltipVisible) {
      element = this.shadowRoot.querySelector('div');
      this._hideTooltip(element);
    } else {
      element = document.createElement('div');
      this._showTooltip(element);
    }
  }

  _showTooltip(element) {
    element.textContent = this._tooltipText;
    this.shadowRoot.appendChild(element);
    this._tooltipVisible = true;
  }

  _hideTooltip(element) {
    this.shadowRoot.removeChild(element);
    this._tooltipVisible = false;
  }
}

customElements.define('uc-tooltip', Tooltip);
