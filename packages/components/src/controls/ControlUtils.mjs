// Part of Pickestry. See LICENSE file for full copyright and licensing details.

export class ControlUtils {

  isNavigate(key) {
    switch(key) {
      // case 'Backspace':
      // case 'Delete':
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'Home':
      case 'End':
      case 'Tab':
        return true
      default:
        return false
    }
  }

  isBackspace(key) {
    return key === 'Backspace'
  }

  isDelete(key) {
    return key === 'Delete'
  }

  isNumber(key) {
    if(key.length !== 1) return false

    const code = key.charCodeAt(0)

    return (code > 47 && code < 58) // digit (0-9)
  }

  isNotNumber(key) {
    return !this.isNumber(key)
  }

  isRelevant(key) {
    return !this.isIrrelevant(key)
  }

  isIrrelevant(key) {
    return !this.isNumber(key)
      && !this.isBackspace(key)
      && !this.isDelete(key)
  }

  isSign(key) {
    if(key.length !== 1) return false

    const code = key.charCodeAt(0)

    return (code === 43 || code === 45) // +, -
  }

  isMinus(key) {
    if(key.length !== 1) return false

    const code = key.charCodeAt(0)

    return code === 45 // +, -
  }
}

export const controlUtils = new ControlUtils()
