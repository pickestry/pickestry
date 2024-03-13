// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { FilterPanel } from '../../../components/src/filter'
import sample from './filter-items.json'
import { set } from 'lodash-es'

const ITEMS = sample.items

const QUERY2_DEFAULT = {
  name: { includes: 'Geor' },
  price: { gt: 12500 },
  cost: { has: true },
  created: { between: [ 1704067200000, 1706331600000 ] },
  status: { nin: [ 'pending', 'complete', 'canceled' ] },
  customer: { nin: [ { id: '1', name: 'Customer A' } ] }
}

set(ITEMS, '[7].entitySearch', function() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([{
        id: '1',
        name: 'Customer A'
      }, {
        id: '2',
        name: 'Customer B'
      }])
    }, 2000)
  })
})

export const FilterExample = () => {

  const [query, setQuery] = React.useState({})

  const [query2, setQuery2] = React.useState(QUERY2_DEFAULT)

  return (
    <>
      <h1>Filters</h1>
      <FilterPanel
        testid='filter-default'
        defs={ITEMS}
        config={{
          moneyIso: 'cad',
          moneySymbol: '$',
          moneyDecimal: ',',
          moneySeparator: '.'
        }}
        onQuery={setQuery}
      />
      <br /><br />
      <span data-testid="filter-query">{JSON.stringify(query, null, 2)}</span>

      <h1>Filters with existing query</h1>
      <FilterPanel
        testid='filter-predefined'
        defs={ITEMS}
        config={{
          moneyIso: 'eur',
          moneySymbol: '€',
          moneyDecimal: '.',
          moneySeparator: ','
        }}
        onQuery={setQuery2}
        defaultQuery={QUERY2_DEFAULT}
        displayDate={(d) => {
          const time = new Date(d)
          const dt = time.getDate()
          const month = time.getMonth() + 1
          const year = time.getFullYear()

          let temp = (dt < 10 ? '0' : '') + dt
          temp += (month < 10 ? '/0' : '/') + month
          return temp + '/' + year
        }}
      />
      <hr />
      <br /><br />
      <span data-testid="filter-query-2">{JSON.stringify(query2, null, 2)}</span>

      <h1>Filters with only one op, between</h1>
      <FilterPanel
        testid='filter-between-only'
        defs={[{
          name: 'created',
          label: 'Created',
          path: 'created',
          type: 'date',
          hint: 'Filter by creation date',
          ops: ['between']
        }]}
        onQuery={setQuery}
        config={{
          timezone: 'America/Vancouver'
        }}
        displayDate={(d) => {
          const time = new Date(d)
          const dt = time.getDate()
          const month = time.getMonth() + 1
          const year = time.getFullYear()

          let temp = (dt < 10 ? '0' : '') + dt
          temp += (month < 10 ? '/0' : '/') + month
          return temp + '/' + year
        }}
      />
      <br /><br />
      <br /><br />
      <br /><br />
      <br /><br />
    </>
  )
}
