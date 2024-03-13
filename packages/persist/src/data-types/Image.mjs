// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import util from 'node:util'
import { DataTypes } from 'sequelize'
import { Utils } from 'sequelize'

export default function createImageDataType() {

  class IMAGE extends DataTypes.ABSTRACT {

    static key = 'IMAGE'

    toSql() {
      return 'TEXT'
    }

    _stringify(value, options) { // eslint-disable-line no-unused-vars
      return this.#dataURItoBlob(value)
    }

    static parse(value) {
      return (async () => await this.#blobToDataURI(value))()
    }

    #dataURItoBlob(data) {
      const byteString = atob(data.split(',')[1])

      const mimeString = data.split(',')[0].split(':')[1].split(';')[0]

      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }

      return new Blob([ab], {type: mimeString})
    }

    #blobToDataURI(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.error = (err) => reject(err)
        reader.reasAsDataURL(blob)
      })
    }
  }

  IMAGE.prototype.key = IMAGE.key

  DataTypes.IMAGE = Utils.classToInvokable(IMAGE)

  // map to sqlite
  const SQLiteTypes = DataTypes.sqlite

  DataTypes.IMAGE.types.sqlite = ['IMAGE']

  SQLiteTypes.IMAGE = function IMAGE() {
    if (!(this instanceof SQLiteTypes.IMAGE)) {
      return new SQLiteTypes.IMAGE()
    }

    DataTypes.IMAGE.apply(this, arguments)
  }

  util.inherits(SQLiteTypes.IMAGE, DataTypes.IMAGE)

  SQLiteTypes.IMAGE.parse = DataTypes.IMAGE.parse
}
