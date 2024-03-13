// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Document } from 'docx'
import { Packer } from 'docx'
import { Paragraph } from 'docx'
import { TextRun } from 'docx'
import { SectionType } from 'docx'
import { Table } from 'docx'
import { TableRow } from 'docx'
import { TableCell } from 'docx'
import { WidthType } from 'docx'

export class DocBuyOrder {

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
    notes,
    toAddress = [],
    items = []
  } = {}) {

    this.#date = date

    if(title)
      this.#title = title

    // Top page paragraph
    const topPar = new Paragraph({
      children: [
        new TextRun(`${date}`),
        new TextRun(`                       ${title}`)
      ]
    })

    const supplierChildren = []
    supplierChildren.push(new TextRun({
      text: to,
      break: 2,
      bold: true
    }))

    for(const line of toAddress.split('\n')) {
      supplierChildren.push(new TextRun({
        text: line,
        break: 1
      }))
    }

    const supplierPar = new Paragraph({
      children: supplierChildren
    })

    const itemsChildren = []
    itemsChildren.push(new TextRun({
      text: 'Items',
      break: 2
    }))

    const itemsPar = new Paragraph({
      children: itemsChildren
    })

    const rows = [new TableRow({
      children: [
          new TableCell({ children: [new Paragraph({ text: 'Item' })]}),
          new TableCell({ children: [new Paragraph({ text: 'Price' })]}),
          new TableCell({ children: [new Paragraph({ text: 'Qty' })]}),
          new TableCell({ children: [new Paragraph({ text: 'Total' })]})
      ],
      tableHeader: true
    })]
    for(const item of items) {
      rows.push(new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: item.name })]}),
          new TableCell({ children: [new Paragraph({ text: item.amount })]}),
          new TableCell({ children: [new Paragraph({ text: item.qty })]}),
          new TableCell({ children: [new Paragraph({ text: item.total })]})
        ]
      }))
    }

    const table = new Table({
      rows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      }
    })

    const notesPar = new Paragraph({
      children: [
          new TextRun({
            text: 'Notes:',
            break: 2
          }),
          new TextRun(notes ?? '-')
      ]
    })

    const children = [
      topPar,
      supplierPar,
      itemsPar,
      table,
      notesPar
    ]

    this.#doc = new Document({
      sections: [{
        properties: { type: SectionType.CONTINUOUS },
        children
      }]
    })

  }

  finalize() {
    return new Promise((resolve) => {
      Packer.toBuffer(this.doc).then((buffer) => {
        resolve(buffer)
      })
    })
  }

  get doc() {
    return this.#doc
  }
}
