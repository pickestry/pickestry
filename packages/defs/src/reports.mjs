// Part of Pickestry. See LICENSE file for full copyright and licensing details.

export const reports = [{
  name: 'sales-tax',
  title: 'Sales Tax Report',
  description: 'Tax withheld from sales orders'
}]

export const reportTypes = reports.map(({name}) => name)
