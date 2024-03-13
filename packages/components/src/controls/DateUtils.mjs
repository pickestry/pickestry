// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { isFinite } from 'lodash-es'
import { isNaN } from 'lodash-es'

export class DateUtils {

  // private monthFirst: boolean

  // constructor({monthFirst = false} = {}) {
  //   this.monthFirst = monthFirst
  // }

  // validate(v: string, key: string, idx: number): boolean {

  //   // Special cases
  //   if(key === '/' && (idx === 5 || idx === 2)) return true

  //   // Should be a number
  //   const maybeNum = +key
  //   if(!isFinite(maybeNum)) {
  //     return false
  //   }

  //   if(this.monthFirst) {

  //   }

  //   return true
  // }

  isNavigate(key) {
    switch(key) {
      case 'Backspace':
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'Home':
      case 'End':
      case 'Delete':
      case 'Tab':
        return true
      default:
        return false
    }
  }

  isMutate(key) {
    switch(key) {
      case 'Backspace':
      case 'Delete':
        return true
      default:
        return false
    }
  }

  normalize(v) {
    const arr = Array.from(v.replaceAll('/', ''))
    const len = arr.length

    for(let i = 0; i < len; i++) {
      const ch = arr.at(i) || ''

      if(!isFinite(+ch)) {
        continue
      }

      switch(i) {
        case 2:
          if(ch !== '/' && i < len) {
            arr.splice(i, 0, '/')
          }
          break
        case 4:
          if(ch !== '/' && i < len) {
            arr.splice(++i, 0, '/')
          }
          break
        default:
      }
    }

    return arr.join('')
  }

  isValueInput(key) {
    if(key.length !== 1) return false

    const code = key.charCodeAt(0)
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false
    }

    return true
  }

  moveForward(current, value) {
    const {
      start,
      end
    } = current

    const len = value?.length || 0

    let newStart = start
    let newEnd = end

    if(start < len) {
      newStart = start + 1
      newEnd = start + 1
    }

    switch(newStart) {
      case 3:
      case 5:
        newStart++
        newEnd++
    }

    return {
      start: newStart,
      end: newEnd
    }
  }

  parse(v, {
    offset = 'Z',
    monthFirst = false
  } = {}) {
    const parts = v.split('/')

    if(parts.length !== 3) throw new Error('invalid input')

    const year = parts[2]
    const mo = monthFirst ? parts[0] : parts[1]
    const day = monthFirst ? parts[1] : parts[0]

    const _dStr = `${year}-${mo}-${day}T00:00:00.000${offset}`

    const d = Date.parse(_dStr)

    if(isNaN(d)) throw new Error('invalid input')

    return d
  }

  /* Adjust time value for provided timezone
  ** @param {Date} d - date object
  ** @param {string} tz - UTC offset as +/-HH:MM or +/-HHMM
  ** @returns {Date}
  */
  adjustForTimezone(d, tz = '+00:00') {
    const sign = /^-/.test(tz)? -1 : 1

    const b = tz.match(/\d\d/g) // should do some validation here

    if(!b) throw new Error('invalid timezone')

    const offset = (+b[0]*60 + +b[1]) * sign

    d.setUTCMinutes(d.getUTCMinutes() + offset)

    return d
  }

  now(zeroHours = false) {
    const d = new Date()
    if(zeroHours)  {
      d.setHours(0, 0, 0, 0)
    }

    return d
  }

}

export const dateUtils = new DateUtils()
