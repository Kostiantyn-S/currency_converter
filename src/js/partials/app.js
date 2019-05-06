class SelectRequest {
    constructor (elementsSelectors) {
        this.chooseBar = document.querySelector(elementsSelectors.chooseBar);
        this.current = document.querySelector(elementsSelectors.current);
        this.currentText = document.querySelector(elementsSelectors.currentText);
        this.select = document.querySelector(elementsSelectors.select);
        this.requestResult = false;
    };

    showHideChooseBar () {
        if (event.target === this.currentText) {
            this.chooseBar.classList.toggle('header__title-select-choose-bar_show');
            this.current.classList.toggle('header__title-select-current_rotate');
        }
    };

    choose () {
        let item = '';

        for (let i = 0; i < this.chooseBar.childNodes.length; i++) {
            if (event.target === this.chooseBar.childNodes[i]) {
                item = event.target.innerHTML;
                event.target.innerHTML = this.currentText.innerHTML;
                this.currentText.innerHTML = item;
                this.chooseBar.classList.remove('header__title-select-choose-bar_show');
                this.current.classList.remove('header__title-select-current_rotate');
            } else if (event.target !== this.currentText) {
                this.chooseBar.classList.remove('header__title-select-choose-bar_show');
            }
        }
    };

    turnOn () {
        this.showHideChooseBar.call(this);
        this.choose.call(this);
    };

    addListener () {
        document.addEventListener('click', this.turnOn.bind(this));
    };
}

(function () {
    let select = new SelectRequest({
        chooseBar: '.header__title-select-choose-bar',
        current: '.header__title-select-current',
        currentText: '.header__title-select-current-text',
        select: '.header__title-select'
    });
    select.addListener();
})();

class CurrencyRequest {
    constructor () {
        this.requestBodyes = {
            ethereum: {
                USD: 'ETHUSD',
                EUR: 'ETHEUR',
                RUB: 'ETHRUB',
                GBP: 'ETHGBP'
            },

            litecoin: {
                USD: 'LTCUSD',
                EUR: 'LTCEUR',
                RUB: 'LTCRUB',
                GBP: 'LTCGBP'
            },

            bitcoin: {
                USD: 'BTCUSD',
                EUR: 'BTCEUR',
                RUB: 'BTCRUB',
                GBP: 'BTCGBP'
            }
        };

        this.currencySymbols = {
            USD: '&#36;',
            EUR: '&euro;',
            RUB: '&#x20bd;',
            GBP: '&pound;'
        };

        this.cryptNames = {
            ethereum: 'ethereum',
            litecoin: 'litecoin',
            bitcoin: 'bitcoin'
        };
    };

    request (body, cryptName, currencySymbol) {
        let  link = `https://apiv2.bitcoinaverage.com/indices/global/ticker/${body}`;

        fetch(link)
            .then(
                response => {
                    return response.json();
                }
            )
            .then(
                value => {
                    let crypt = document.querySelector(`#${cryptName}-data-values`);
                    this.percentChange (cryptName);

                    crypt.childNodes[0].innerHTML =`${currencySymbol} ${String(value.ask.toFixed(2)).replace(/(\\d)(?=(\\d\\d\\d)+([^\\d]|$))/g, '$1 ')}`;
                    crypt.childNodes[2].innerHTML = `${this.addClass(String(value.changes.price.hour.toFixed(2)), crypt.childNodes[2])} ${currencySymbol}`;
                    crypt.childNodes[3].innerHTML = `${this.addClass(String(value.changes.percent.hour.toFixed(2)), crypt.childNodes[3])} %`;
                    crypt.childNodes[4].innerHTML = `${this.addClass(String(value.changes.price.day.toFixed(2)), crypt.childNodes[4])} ${currencySymbol}`;
                    crypt.childNodes[5].innerHTML = `${this.addClass(String(value.changes.percent.day.toFixed(2)), crypt.childNodes[5])} %`;
                    crypt.childNodes[6].innerHTML = `${this.addClass(String(value.changes.price.week.toFixed(2)), crypt.childNodes[6])} ${currencySymbol}`;
                    crypt.childNodes[7].innerHTML = `${this.addClass(String(value.changes.percent.week.toFixed(2)), crypt.childNodes[7])} %`;
                    crypt.childNodes[8].innerHTML = `${this.addClass(String(value.changes.price.month.toFixed(2)), crypt.childNodes[8])} ${currencySymbol}`;
                    crypt.childNodes[9].innerHTML = `${this.addClass(String(value.changes.percent.month.toFixed(2)), crypt.childNodes[9])} %`;
                }
            )
            .catch(
                (error) => {
                    console.error(error);
                }
            );
    };

    addClass (string, element) {
        if (string > 0) {
            element.classList.add('positive');
            return `+${string}`;
        } else if (string < 0) {
            element.classList.add('negative');
            return string;
        } else {
            return string;
        }
    };

    percentChange (cryptName) {
        let input = document.querySelector(`#${cryptName}-percent-input`);
        let crypt = document.querySelector(`#${cryptName}-data-values`);

        if (input.checked === true) {
            crypt.childNodes[2].classList.add('hide');
            crypt.childNodes[3].classList.remove('hide');
            crypt.childNodes[4].classList.add('hide');
            crypt.childNodes[5].classList.remove('hide');
            crypt.childNodes[6].classList.add('hide');
            crypt.childNodes[7].classList.remove('hide');
            crypt.childNodes[8].classList.add('hide');
            crypt.childNodes[9].classList.remove('hide');
        } else {
            crypt.childNodes[2].classList.remove('hide');
            crypt.childNodes[3].classList.add('hide');
            crypt.childNodes[4].classList.remove('hide');
            crypt.childNodes[5].classList.add('hide');
            crypt.childNodes[6].classList.remove('hide');
            crypt.childNodes[7].classList.add('hide');
            crypt.childNodes[8].classList.remove('hide');
            crypt.childNodes[9].classList.add('hide');
        }
    };

    listenInputs () {
        document.querySelector('.results').addEventListener('change', function () {
            switch (event.target) {
                case document.querySelector('#ethereum-percent-input'):
                    this.percentChange('ethereum');
                    break;

                case document.querySelector('#litecoin-percent-input'):
                    this.percentChange('litecoin');
                    break;

                case document.querySelector('#bitcoin-percent-input'):
                    this.percentChange('bitcoin');
                    break;
            }
        }.bind(this));
    };

    requestCurrency (currency) {
        this.request(this.requestBodyes.ethereum[currency], this.cryptNames.ethereum, this.currencySymbols[currency]);
        this.request(this.requestBodyes.litecoin[currency], this.cryptNames.litecoin, this.currencySymbols[currency]);
        this.request(this.requestBodyes.bitcoin[currency], this.cryptNames.bitcoin, this.currencySymbols[currency]);
    };

    selectListen () {
        document.querySelector('.header__title-select-choose-bar').addEventListener('click', function () {
            switch (event.target.innerHTML) {
                case 'USD':
                    this.requestCurrency.call(this, 'USD');
                    break;

                case 'EUR':
                    this.requestCurrency.call(this, 'EUR');
                    break;

                case 'RUB':
                    this.requestCurrency.call(this, 'RUB');
                    break;

                case 'GBP':
                    this.requestCurrency.call(this, 'GBP');
                    break;
            }
        }.bind(this));
    };

    turnOn () {
        this.requestCurrency('USD');
        this.selectListen();
        this.listenInputs();
    };
}

(function () {
    let request = new CurrencyRequest;
    request.turnOn();
})();