// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import PDFDocument from 'pdfkit'
import blobStream from 'blob-stream'

// 1 point (Postscript) = 0.3527777778 mm = 1/72 inch

export class PDFTables {

  #x = 0

  #y = 0

  #doc

  #page = 1

  #font = 'Helvetica'

  #fontBold = 'Helvetica-Bold'

  #fontSize = 12

  #fontSizeSmall = 12

  #title = 'Sales Tax 2023'

  #date = 'Mon 15th March, 2024 15:33 EST'

  #file

  #stream

  #defs

  constructor({ defs }) {
    if(!defs) throw new Error('pdf definition required')

    this.#defs = defs
  }

  writePageTop() {
    this.doc.fontSize(this.#fontSizeSmall).text(`${this.#date}`, { lineBreak: false })

    const { x, y } = this.doc

    const counterX = this.doc.page.width - this.doc.page.margins.right - 50

    const titleX = x + 1

    const titleWidth = counterX - titleX

    this.doc.text(` ${this.#title} `, titleX, y, {
      lineBreak: false,
      width: titleWidth,
      align: 'center'
    })

    this.doc.text(`${this.#page++}/10`, counterX, y, {
      width: 50,
      align: 'right'
    })
    this.doc.fontSize(this.#fontSize)
    this.doc.x = this.#doc.page.margins.left

    this.doc.moveDown(2)
  }

  create() {
    this.#doc = new PDFDocument({
      displayTitle: true,
      info: {
        Title: 'Testing PDFKit',
        Creator: 'George Suntres',
        Producer: 'Pickestry'
      },
      size: 'A4',
      layout: 'portrait',
      margins: {
        top: 10,
        left: 10,
        bottom: 10,
        right: 10
      }
    })

    this.doc.font(this.#font)
    this.doc.fontSize(this.#fontSize)

    this.doc.on('pageAdded', () => {
      this.pageSetup()

      this.writePageTop()
      this.writePageHeader()
      this.writeTableHeader()
    })

    this.pageSetup()

    this.#stream = this.doc.pipe(blobStream())

    this.writePageTop()
    this.writePageHeader()
    this.writeTableHeader()
  }

  writePageHeader() {
    this.doc.moveTo(this.doc.page.margins.left, this.doc.y)

    this.doc
      .font(this.fontBold)
      .fillColor('#222')
      .text('Filling Period: ', { lineBreak: false })
      .font(this.font)
      .fillColor('black')
      .text(`${new Date().toISOString()} - ${new Date().toISOString()}`)
  }

  pageSetup() {
    this.#doc.strokeOpacity(1)
    this.#doc.strokeColor('#ccc')
    this.#doc.lineWidth(0.1)
  }

  writeTableHeader() {
    this.doc.x = this.#doc.page.margins.left + 2

    this.doc
      .moveDown(2)
      .font(this.#fontBold)

    let idx = this.doc.page.margins.left
    const Y = this.doc.y

    for(const def of this.#defs) {
      const width = +def.width

      this.doc.text(def.label, idx, Y, {
        lineBreak: false,
        width,
        align: 'left'
      })

      this.doc
        .rect(idx - 4, Y - 4, width, 18)
        .stroke()

      idx += width
    }

    this.doc.y = Y + 18
    this.doc.font(this.#font)
  }

  writeData(data) {
    this.create()

    for(const o of data) {
      this.writeDataRow(o)
    }

    return this.end()
  }

  writeDataRow(o) {
    let idx = this.doc.page.margins.left
    const Y = this.doc.y

    for(const def of this.#defs) {
      const width = +def.width

      this.doc.text(o[def.label], idx, Y, {
        lineBreak: false,
        width: width - 8,
        align: def.align
      })

      this.doc
        .lineJoin('round')
        .rect(idx - 4, Y - 4, width, 18)
        .stroke()

      idx += width
    }

    this.doc.y = Y + 18

    if(this.doc.page.height - this.doc.y < 100) {
      this.doc.addPage()
    }
  }

  writeText(v) {
    this.doc.text(v, {lineBreak: true})
  }

  end() {
    this.#doc.end()

    return new Promise((resolve) => {
      this.stream.once('finish', () => resolve(this.stream.toBlob('application/pdf')))
    })
  }

  get fontBold() {
    return this.#fontBold
  }

  get font() {
    return this.#font
  }

  get doc() {
    return this.#doc
  }

  get stream() {
    return this.#stream
  }
}

// const SIZES = {
//   A4: [595.28, 841.89],
//   LETTER: [612.0, 792.0]
// };
