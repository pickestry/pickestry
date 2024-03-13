// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { Busy } from '../../../components/src/Busy'
import { BlankLink } from '../../../components/src/misc'
import { Muted } from '../../../components/src/misc'
import { TextDanger } from '../../../components/src/misc'
import { StackedProps } from '../../../components/src/misc'
import { List } from '../../../components/src/List'
import planetsJson from './planets.json'

const PLANETS = planetsJson.items

export function Misc() {

  const [busy, setBusy] = React.useState(true)

  const [clickCounter, setClickCounter] = React.useState(0)

  const [selected, setSelected] = React.useState()

  const [data, setData] = React.useState([])

  const [, setDataState] = React.useState({ count: 0, offset: 0, limit: 10 })

  React.useEffect(() => {
    setDataState({ count: 5523, offset: 0, limit: 10 })
    setData(PLANETS.slice(0, 10).map((o) => Object.assign({}, o, { id: ''+o.id, name: o.display_name})))
  }, [])

  return (
    <>
      <h1>Misc</h1>

      <h3>Busy</h3>
      <div style={{position: 'relative', width: 150}}>
      {
          busy
            ? (
              <>
                <p>Showing busy:</p>
                <Busy busy={busy} />
              </>
            )
            : <p>Busy is hidden</p>
          }
        <button onClick={() => { setBusy(!busy) }}>Toggle Busy</button>
      </div>

      <h3>Muted</h3>
      <Muted>This is supposed to be faded.</Muted>

      <h3>Blank Link</h3>
      <BlankLink onClick={(e) => { e;setClickCounter(clickCounter + 1) }}>Link to nowhere</BlankLink>
      <div>Clicked {clickCounter} times.</div>

      <h5>Disabled link</h5>
      <BlankLink disabled>A disabled link</BlankLink>

      <h3>TextDanger</h3>
      <TextDanger>Failed status!</TextDanger>

      <h3>Stacked Properties</h3>
      <StackedProps
        entity={{
          name: 'Gregory',
          age: 300,
          is_manager: true,
          birthday: new Date(1696262988580)
        }}
        defs={[
          {
            label: 'Name',
            path: 'name'
          }, {
            label: 'Age',
            path: 'age'
          }, {
            label: 'Manager',
            path: 'is_manager',
            dataDisplay: (entity, path, defaultValue) => {
              return entity[path] === true ? <em className='custom-data-display'>YES</em> : <span>{defaultValue}</span>
            }
          }, {
            label: 'Birthday',
            path: 'birthday',
            dataDisplay: (entity, path) => {
              return (entity[path]).toISOString()
            }
          }
        ]}
      />

      <h3>List</h3>
      <List
        testid='simple-list'
        data={[
          {id: 'id1', name: 'Item A'},
          {id: 'id2', name: 'Item B'},
          {id: 'id3', name: 'Item C'},
          {id: 'id4', name: 'Item D'}
        ]}
        onSelect={({ name }) => {setSelected(name)}}
      />
      <div data-testid="simple-list-selected">{selected}</div>

      <em>List with remove</em>
      <List
        testid="list-remove"
        data={data}
        onRemove={(item) => {
          const idx = data.findIndex(({id}) => id == item.id)
          data.splice(idx, 1)
          setData([...data])
        }}
      />
    </>
  )
}
