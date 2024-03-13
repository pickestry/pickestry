// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { head } from 'lodash-es'
import { get } from 'lodash-es'

export class Dates {

  static AVAILABLE_DATE_FORMATS = [
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'DD-MM-YYYY',
    'MM-DD-YYYY',
    'YYYY-MM-DD'
  ]

  static AVAILABLE_HOUR_CYCLES = [
    'h24',
    'h12'
  ]

  static AVAILABLE_LOCALES = [
    'en-US',
    'en-CA'
  ]

  #locale

  #hourCycle

  #dateFormat

  #timeFormat

  #timeZone

  #formatter

  constructor() {
    this.reset()
  }

  reset() {
    this.#locale = Dates.AVAILABLE_LOCALES[0]
    this.#hourCycle = Dates.AVAILABLE_HOUR_CYCLES[0]
    this.#dateFormat = Dates.AVAILABLE_DATE_FORMATS[0]

    this.#setTimeFormat()

    this.#afterConfig()
  }

  #afterConfig() {
    this.#formatter = Intl.DateTimeFormat(this.#locale, {
      hourCycle: this.#hourCycle,
      timeZone: this.#timeZone,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })
  }

  #setTimeFormat() {
    if(this.#hourCycle === 'h24') {
      this.#timeFormat = 'HH:mm'
    } else {
      this.#timeFormat = 'HH:mm:ss a'
    }
  }

  /**
   * @param {object}   config
   * @param {string}   config.locale
   * @param [string]   config.dateFormat (default: 'DD/MM/YYYY')
   * @param [string]   config.hourCycle Possible values: h24, h12 (default: h24)
   * @param [timeZone] config.timeZone (default: UTC)
   */
  configure(config) {
    if(config.locale) {
      this.#locale = config.locale
    }

    if(config.dateFormat) {
      if(!Dates.AVAILABLE_DATE_FORMATS.includes(config.dateFormat)) throw new Error('date format not supported')
      this.#dateFormat = config.dateFormat
    }

    if(config.timeZone) {
      this.#timeZone = config.timeZone
    } else {
      this.#timeZone = head(this.timezones)
    }

    if(config.hourCycle) {
      this.#hourCycle = config.hourCycle
    }

    this.#afterConfig()
  }

  format(date, format, options = {
    locale: this.#locale,
    timezone: this.#timeZone
  }) {
    return Intl.default(date, format, options)
  }

  display(date) {
    return this.#fromParts(this.#formatter.formatToParts(date))
  }

  displayWithTime(date) {
    const parts = this.#formatter.formatToParts(date)

    let v = this.#fromParts(parts)

    const hourPart = parts.find(({type}) => type === 'hour')
    const minutePart = parts.find(({type}) => type === 'minute')
    const tzPart = parts.find(({type}) => type === 'timeZoneName')
    const dayPeriodPart =parts.find(({type}) => type === 'dayPeriod')

    v += `, ${hourPart.value}:${minutePart.value} ${get(dayPeriodPart, 'value', '')}${tzPart.value}`

    return v
  }

  #fromParts(parts) {
    const dayPart = parts.find(({type}) => type === 'day')
    const monthPart = parts.find(({type}) => type === 'month')
    const yearPart = parts.find(({type}) => type === 'year')

    switch(this.#dateFormat) {
    case 'DD/MM/YYYY': return `${dayPart.value}/${monthPart.value}/${yearPart.value}`
    case 'DD-MM-YYYY': return `${dayPart.value}-${monthPart.value}-${yearPart.value}`
    case 'MM/DD/YYYY': return `${monthPart.value}/${dayPart.value}/${yearPart.value}`
    case 'MM-DD-YYYY': return `${monthPart.value}-${dayPart.value}-${yearPart.value}`
    case 'YYYY-MM-DD': return `${yearPart.value}-${monthPart.value}-${dayPart.value}`
    }
  }

  get timezones() {
    const l = new Intl.Locale(this.#locale)
    return l.timeZones
  }
}

export const dates = new Dates()
