// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { concat } from 'lodash-es'
import { cloneDeep } from 'lodash-es'
import { cloneDeepWith } from 'lodash-es'
import { isPlainObject } from 'lodash-es'
import { isArrayLike } from 'lodash-es'
import { isString } from 'lodash-es'
import { pickBy } from 'lodash-es'
import { get } from 'lodash-es'
import { isBlank } from './string.mjs'

const EXCLUDE_KEYS = [
  'password',
  'DB_PASS'
]

/**
 * Pass on an object or an array that might contain sensitive information and this
 * function will strip it out.
 *
 * @param {object|Array} value The object to process.
 * @param {string[]} [excludeKeys] The keys to strip out
 * @returns {object} The object or array of objects without the exclude keys.
 */
export const safeDisplay = (value, excludeKeys = []) => {
  const exldKeys = concat(EXCLUDE_KEYS, excludeKeys)
  const clonedValue = cloneDeep(value)
  let ret
  if(isPlainObject(clonedValue)) {
    ret = omitDeep([clonedValue], exldKeys)
  } else if(isArrayLike(clonedValue)) {
    ret = omitDeep(clonedValue, exldKeys)
  } else {
    ret = clonedValue
  }

  return ret
}

/**
 * Iterate over a collection recursivelly and remove the provided keys.
 *
 * @param {Array} collection The collection to process.
 * @param {string[]} [excludeKeys] The keys to strip out
 * @returns {Array} A new array with the provided keys stripped out.
 */
export const omitDeep = (collection, excludeKeys) => {
  function omitFn(value) {
    if (value && typeof value === 'object') {
      excludeKeys.forEach((key) => {
        delete value[key]
      })
    }
  }

  return cloneDeepWith(collection, omitFn)
}

/**
 * Stringify an object in a pretty way.
 */
export function str(o) {
  return JSON.stringify(o, null, 2)
}

export function noop() {}

export function hexToRgba(hex, opacity = 1) {
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
    let cArr = hex.substring(1).split('')
    if(cArr.length === 3){
      cArr= [cArr[0], cArr[0], cArr[1], cArr[1], cArr[2], cArr[2]]
    }
    const c = '0x' + cArr.join('')

    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')}, ${opacity})`
   }

   throw new Error('Bad Hex')
}

export function toDateString(date) {
  return ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + date.getFullYear()
}

export function pickCommon(object) {
  return pickBy(object, function(_value, key) {
    return key.startsWith('data-') || key === 'id'
  })
}

/**
 * A string representation of an object.
 * @param {object} object The object
 * @param {string[]} fields The fields to concatenate
 */
export function display(o, fields = ['name'], defaultIfBlank = '-') {
  let v = ''
  for(const path of fields) {
    v += get(o, path, '') + ' '
  }

  const trimmedValue = v.trimEnd()

  return isBlank(trimmedValue) ? defaultIfBlank : trimmedValue
}

/**
 * Break down ms to hours minues seconds and milliseconds
 */
export function msTotime(duration) {
  let milliseconds = Math.floor((duration % 1000) / 100)
  let seconds = Math.floor((duration / 1000) % 60)
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  const hoursStr = (hours < 10) ? '0' + hours : hours
  const minutesStr = (minutes < 10) ? '0' + minutes : minutes
  const secondsStr = (seconds < 10) ? '0' + seconds : seconds

  return hoursStr + ':' + minutesStr + ':' + secondsStr + '.' + milliseconds
}


/**
 * Example: A = [1, 3, 5] B = [3, 10, 11]
 * intersection(A, B) => [3]
 */
export function intersection(arrA, arrB) {
  return arrA.filter((x) => arrB.includes(x))
}

/**
 * Example: A = [1, 3, 5] B = [3, 10, 11]
 * differenceLeft(A, B) => [1, 5]
 */
export function differenceLeft(arrA, arrB) {
  return arrA.filter((x) => !arrB.includes(x))
}

export function symetricDifference(arrA, arrB) {
  return arrA.filter((x) => !arrB.includes(x))
    .concat(arrB.filter((x) => !arrA.includes(x)))
}

export function union(arrA, arrB) {
  return [...new Set([...arrA, ...arrB])]
}

/**
 * Uri
 */
export function containsEncodedComponents(v) {
  return (decodeURI(v) !== decodeURIComponent(v))
}

export function deURI(v) {
  if(isString(v)) {
    return decodeURIComponent(v)
  } else {
    return v
  }
}


// Print caller
// const source = (new Error()).stack.split('\n')[2].trim().split(' ')[1]
