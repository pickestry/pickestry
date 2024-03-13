// Part of Pickestry. See LICENSE file for full copyright and licensing details.

// TODO: finish this using Intl
export const currencyData = {
  collection: [
    {
      code: 'USD',
      num: 840,
      d: 2,
      name: 'United States dollar',
      locations: ['US', 'AS', 'IO', 'VG', 'BQ', 'EC', 'SV', 'GU', 'MH', 'FM', 'MP', 'PW', 'PA', 'PR', 'TL', 'TC', 'VI', 'UM'],
      symbol: '$'
    }, {
      code: 'CAD',
      num: 124,
      d: 2,
      name: 'Canadian dollar',
      locations: ['CA'],
      symbol: '$'
    }, {
      code: 'EUR',
      num: 978,
      d: 2,
      name: 'Euro',
      locations: ['AX', 'EU', 'AD', 'AT', 'BE', 'HR', 'CY', 'EE', 'FI', 'FR', 'GF', 'TF', 'DE', 'GR', 'GP', 'IE', 'IT', 'XK', 'LV', 'LT', 'LU', 'MT', 'MQ', 'YT', 'MC', 'ME', 'NL', 'PT', 'RE', 'BL', 'MF', 'PM', 'SM','SK', 'SI', 'ES', 'VA'],
      sumbol: '€'
    }
  ]
}

export class Currency {

  static AVAILABLE_AMOUNT_FORMATS = [
    'dot_comma',
    'comma_dot'
  ]

  static AVAILABLE_SYMBOLES = [
    '$'
  ]

   static AVAILABLE_LOCALES = [
    'en-US',
    'en-CA'
  ]

  #locale

  #symbol

  #decimal

  #separator

  #formatter

  constructor() {
    this.reset()
  }

  reset() {
    this.#locale = Currency.AVAILABLE_LOCALES[0]

    // amount format
    const amountFmt = Currency.AVAILABLE_AMOUNT_FORMATS[0]
    switch(amountFmt) {
      case 'dot_comma':
        this.#decimal = ','
        this.#separator = '.'
        break
      case 'comma_dot':
        this.#decimal = '.'
        this.#separator = ','
    }

    // symbol
    this.#symbol = Currency.AVAILABLE_SYMBOLES[0]

    this.#afterConfig()
  }

  #afterConfig() {
    // this.#fromatter = Intl.
  }

}

export const displayAmount = (intValue, iso) => {
  // normalize value
  let v = 0
  if(intValue !== 0) {
    v = intValue / 100
  }

  let currency
  switch(iso.toLowerCase()) {
    case 'cad':
      currency = CurrencyISO.CAD
      break
      case 'usd':
        currency = CurrencyISO.USD
        break
    default:
      throw new Error(`${iso} not found`)
  }

  const locale = getLocaleFromCurrency(currency)

  return new Intl.NumberFormat(locale, { style: 'currency', currency: String(currency)}).format(v)
}

export const Locale = {
  enUS: 'en-US',
  enCA: 'en-CA'
}

export const CurrencyISO = {
  USD: 'USD',
  CAD: 'CAD'
}

export const localeToCurrency = new Map()

localeToCurrency.set(Locale.enUS, CurrencyISO.USD)
localeToCurrency.set(Locale.enCA, CurrencyISO.CAD)

/**
 * @throws {Error} When currency not found
 *
 */
export const getLocaleFromCurrency = (currency) => {
  for(const [key, value] of localeToCurrency.entries()) {
    if(value === currency) return key
  }

  throw new Error(`${currency} not found`)
}


export const currency = new Currency()
