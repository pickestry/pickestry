// Part of Pickestry. See LICENSE file for full copyright and licensing details.

/*eslint-disable no-console*/

import * as React from 'react'
import { Table } from '../../../components/src/table'
import planetsJson from './planets.json'

const PLANETS = planetsJson.items

// Simple Table
const COL_DEF = [
  { name: 'id', displayName: 'ID', width: '30px' },
  { name: 'name', displayName: 'Name' },
  { name: 'age', displayName: 'Age', type: 'number', width: '40px' },
  { name: 'birthday', displayName: 'Birthday', type: 'date' },
  { name: 'salary', displayName: 'Salary', type: 'currency' }
]

const DATA = [
  { id: '1', name: 'my name A' },
  { id: '2', name: 'my name B', salary: '20,000.00 $' },
  { id: '3', name: 'my name C', age: 40, birthday: '1980-10-25' }
]

// With pagination
const COL_PAG_DEF = [
  { name: 'id', displayName: 'ID', width: '50px' },
  { name: 'display_name', displayName: 'Name', width: '250px' },
  { name: 'st_dist', displayName: 'Distance', type: 'number' },
  { name: 'ranger_system', displayName: 'Range' },
  { name: 'discovery_date', displayName: 'Discovery Date', type: 'date' }
]

const COL_ACT_DEF = [
  { name: 'id', displayName: 'ID', width: '50px' },
  { name: 'display_name', displayName: 'Name', width: '250px' },
  { name: 'st_dist', displayName: 'Distance', type: 'number' },
  { name: 'ranger_system', displayName: 'Range' },
  { name: 'discovery_date', displayName: 'Discovery Date', type: 'date' }
]

export function TableExample() {

  const [data, setData] = React.useState([])

  React.useEffect(() => {
    setData(PLANETS.slice(0, 10).map((o) => Object.assign({}, o, { id: ''+o.id})))
  }, [])

  return (
    <>
      <h1>Tables</h1>

      <h3>Simple Table</h3>

      <Table
        testid='simple-table'
        colDef={COL_DEF}
        data={DATA}
        text=''
        count={0}
      />

      <br />
      <br />

      <h3>With pagination</h3>

      <Table
        testid='paginated-table'
        colDef={COL_PAG_DEF}
        data={data}
      />

      <br />
      <br />

      <h3>With actions</h3>
      <Table
        testid='table-with-actions'
        colDef={COL_ACT_DEF}
        data={data}
        actions={[{name: 'Action One', action: (o) => {console.log(o)}}]}
      />

      <h3>With actions</h3>
      <Table
        testid='table-with-actions'
        colDef={COL_ACT_DEF}
        data={data}
        actions={[{name: 'Action One', action: (o) => {console.log(o)}}]}
      />

      <h3>With dynamic actions and primary</h3>
      <Table
        testid='table-with-dynamic-actions'
        colDef={COL_ACT_DEF}
        data={data}
        actions={(o) => {
          const a = []
          if(o.st_dist > 235) {
            a.push({
              name: 'Big',
              action: (o) => {console.log('Action big: ', o)},
              primary: true
            })
          } else {
            a.push({
              name: 'Small',
              action: (o) => {console.log('Action small: ', o)},
              primary: true
            })
          }

          return a
        }}
      />
    </>
  )
}
