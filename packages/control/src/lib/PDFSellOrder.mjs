// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { isNil } from 'lodash-es'
import PDFDocument from 'pdfkit'
import blobStream from 'blob-stream'

export class PDFSellOrder {

  #doc

  #page = 1

  #font = 'Helvetica'

  #fontBold = 'Helvetica-Bold'

  #fontSize = 12

  #fontSizeSmall = 12

  #stream

  #title = 'Sales Order'

  #date

  #counterWidth = 20

  #itemWidth = 300

  #priceWidth = 80

  #qtyWidth = 80

  #totalWidth = 100

  #idx = 0

  #counter = 1

  constructor() {
  }

  create({
    title,
    date,
    to,
    toAddress,
    from,
    fromAddress,
    items = [],
    net,
    tax,
    gross,
    discounts = [],
    shipping,
    final
  } = {}) {

    this.#date = date

    if(title)
      this.#title = title

    this.#doc = new PDFDocument({
      displayTitle: true,
      info: {
        Title: this.#title,
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

      if(this.hasMore(items.length)) {
        this.writeItems(items.slice(this.idx, this.idx + 14))
        this.#idx += 14
      }

      if(this.hasMore(items.length)) {
        this.doc.addPage()
      } else {
        this.writeTotals({
          net,
          tax,
          gross,
          discounts,
          shipping,
          final
        })
      }
    })

    this.pageSetup()

    this.#stream = this.doc.pipe(blobStream())

    // write top
    this.writePageTop()
    this.writeHeader({
      to,
      toAddress,
      from,
      fromAddress
    })

    this.writeItems(items.slice(this.idx, 14))
    this.#idx = 14

    if(this.hasMore(items.length)) {
      this.doc.addPage()
    } else {
      this.writeTotals({
        net,
        tax,
        gross,
        discounts,
        shipping,
        final
      })
    }
  }

  hasMore(itemsLength) {
    return this.idx < itemsLength
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

    this.doc.text(`${this.#page++}`, counterX, y, {
      width: 50,
      align: 'right'
    })
    this.doc.fontSize(this.#fontSize)
    this.doc.x = this.#doc.page.margins.left

    this.doc.moveDown(4)
  }

  writeHeader({
    to,
    toAddress,
    from,
    fromAddress
  }) {
    let { y } = this.doc

    const lineGap = 4

    this.doc.font(this.#fontBold)
    this.doc.text(to, { lineGap })

    this.doc.font(this.#font)
    this.doc.text(toAddress, { lineGap })

    this.doc.font(this.#fontBold)
    this.doc.text(from, 400, y, {
      width: 300,
      lineGap
    })
    this.doc.font(this.#font)
    this.doc.text(fromAddress, { lineGap })

    this.doc.x = this.doc.page.margins.left
    this.doc.moveDown(4)
    // this.doc.y = y
  }

  writeItems(items = []) {
    let { y } = this.doc

    this.doc.text('#', this.doc.page.margins.left, y, {
      width: this.#counterWidth,
      align: 'center',
      lineBreak: false,
      ellipsis: true
    })
    this.doc.text('Item', this.doc.x + this.#counterWidth, y, {
      width: this.#itemWidth,
      lineBreak: false
    })
    this.doc.text('Price', this.doc.page.margins.left + this.#itemWidth, y, {
      width: this.#priceWidth,
      align: 'right'
    })
    this.doc.text('Qty', this.doc.x + this.#priceWidth, y, {
      width: this.#qtyWidth,
      align: 'center'
    })
    this.doc.text('Total', this.doc.x + this.#qtyWidth, y, {
      width: this.#totalWidth,
      align: 'right'
    })
    this.doc.moveTo(this.doc.page.margins.left, this.doc.y).lineTo(580, this.doc.y).stroke()

    for(const item of items) {
      this.doc.moveDown()
      y = this.doc.y

      this.doc.text(`${this.#counter++}`, this.doc.page.margins.left, y, {
        width: this.#counterWidth,
        align: 'center',
        lineBreak: false,
        ellipsis: true
      })
      this.doc.text(`${item.name}`, this.doc.x + this.#counterWidth, y, {
        width: this.#itemWidth,
        height: 20,
        ellipsis: true
      })
      this.doc.text(`${item.amount}`, this.doc.page.margins.left + this.#itemWidth, y, {
        width: this.#priceWidth,
        height: 20,
        ellipsis: true,
        align: 'right'
      })
      this.doc.text(`${item.qty}`, this.doc.x + this.#priceWidth, y, {
        width: this.#qtyWidth,
        height: 20,
        ellipsis: true,
        align: 'center'
      })
      this.doc.text(`${item.total}`, this.doc.x + this.#qtyWidth, y, {
        width: this.#totalWidth,
        height: 20,
        ellipsis: true,
        align: 'right'
      })
    }
  }

  writeTotals({
    net,
    tax,
    gross,
    discounts = [],
    shipping,
    final
  }) {
    // --
    const discountHeight = discounts.length * 35
    const hasDiscount = discounts.length !== 0

    const shippingHeigh = isNil(shipping) ? 0 : 45
    const hasShipping = !isNil(shipping)

    // --
    this.doc.y = this.doc.page.height - 100 - discountHeight - shippingHeigh

    const width = 200
    const x = this.doc.page.width - width - this.doc.page.margins.right - 15
    const end = this.doc.page.width - this.doc.page.margins.right - 15

    this.doc.moveTo(x, this.doc.y).lineTo(end, this.doc.y).stroke()
    this.doc.moveDown()

    if(net) {
      this.doc.font(this.#fontBold)
      this.doc.text('Net', x, this.doc.y, { lineBreak: false })
      this.doc.font(this.#font)
      this.doc.text(`${net}`, x, this.doc.y, {
        width,
        align: 'right',
        lineGap:5
      })
    }

    if(tax) {
      this.doc.font(this.#fontBold)
      this.doc.text('Tax', x, this.doc.y, { lineBreak: false })
      this.doc.font(this.#font)
      this.doc.text(`${tax}`, x, this.doc.y, {
        width,
        align: 'right',
        lineGap:5
      })
    }

    if(gross) {
      this.doc.font(this.#fontBold)
      this.doc.text('Gross', x, this.doc.y, { lineBreak: false })
      this.doc.font(this.#font)
      this.doc.text(`${gross}`, x, this.doc.y, {
        width,
        align: 'right',
        lineGap:5
      })
    }

    if(hasDiscount || hasShipping) {
      this.doc.moveTo(x, this.doc.y).lineTo(end, this.doc.y).stroke()
      this.doc.moveDown(0.8)
    }

    for(const { name, value } of discounts) {
      this.doc.text(name || '-', x, this.doc.y, { lineBreak: false })
      this.doc.text(`${value}`, x, this.doc.y, {
        width,
        align: 'right',
        lineGap:5
      })
    }

    if(shipping) {
      this.doc.text(shipping.name || '-', x, this.doc.y, { lineBreak: false })
      this.doc.text(`${shipping.value}`, x, this.doc.y, {
        width,
        align: 'right',
        lineGap:5
      })
    }

    if(hasDiscount || hasShipping) {
      this.doc.moveTo(x, this.doc.y).lineTo(end, this.doc.y).stroke()
      this.doc.moveDown(0.8)
    }

    if(final) {
      this.doc.font(this.#fontBold)
      this.doc.text('Final', x, this.doc.y, { lineBreak: false })
      this.doc.font(this.#font)
      this.doc.text(`${final}`, x, this.doc.y, {
        width,
        align: 'right',
        lineGap:5
      })
    }
  }

  finalize() {
    this.doc.end()

    return new Promise((resolve) => this.stream.on('finish', async () => resolve(this.stream.toBlob('application/pdf'))))
  }

  pageSetup() {
    this.#doc.strokeOpacity(1)
    this.#doc.strokeColor('#ccc')
    this.#doc.lineWidth(0.1)
  }

  get doc() {
    return this.#doc
  }

  get stream() {
    return this.#stream
  }

  get fontBold() {
    return this.#fontBold
  }

  get idx() {
    return this.#idx
  }
}
