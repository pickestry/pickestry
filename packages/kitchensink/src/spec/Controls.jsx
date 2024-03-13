// Part of Pickestry. See LICENSE file for full copyright and licensing details.

/* eslint-disable no-console, no-unused-vars */

import * as React from 'react'
import { Switch } from '../../../components/src/controls/Switch'
import { Tags } from '../../../components/src/controls/Tags'
import { noop } from 'lodash-es'
import { set } from 'lodash-es'
import { produce } from 'immer'
import { DateInput } from '../../../components/src/controls/DateInput'
import { Select } from '../../../components/src/controls/Select'
import { Metadata } from '../../../components/src/controls/Metadata'
import { ValidInput } from '../../../components/src/controls/ValidInput'
import { Items } from '../../../components/src/controls/items'
import { Money } from '../../../components/src/controls/Money'
import { MultiSelect } from '../../../components/src/controls/MultiSelect'
import { Tax } from '../../../components/src/controls/Tax'
import { display as displayTax } from '../../../components/src/controls/Tax'
import { NumberInput } from '../../../components/src/controls/NumberInput'
import { Percent } from '../../../components/src/controls/Percent'
import { TextInput } from '../../../components/src/controls/TextInput'
import { TextArea } from '../../../components/src/controls/TextArea'
import { Entity } from '../../../components/src/controls/entity'
import { EntityMultiSelect } from '../../../components/src/controls/EntityMultiSelect'
import { MoneyTax } from '../../../components/src/controls/MoneyTax'
import { ImageInput } from '../../../components/src/controls/ImageInput'
import { EntitySearch } from '../../../components/src/entity-search'
import { Radio } from '../../../components/src/controls/Radio.jsx'


const MOODS = [
  'happy',
  'jolly',
  {
    value: 'happy',
    name: 'Merry'
  },
  'sad',
  {
    value: 'pissed',
    name: 'Angry'
  },
]

export function Controls() {

  const [switchA, setSwitchA] = React.useState(false)

  const [date2, setDate2] = React.useState(1683504000000)

  const [dateUnix, setDateUnix] = React.useState()

  const [mood, setMood] = React.useState()

  const [race, setRace] = React.useState('martian')

  const [idA, setIdA] = React.useState('cus_dsajkflhds')

  const [money2, setMoney2] = React.useState(4587799)

  const [money3, setMoney3] = React.useState(0)

  const [moneyTax, setMoneyTax] = React.useState({
    value: 0,
    tax: []
  })

  const [num3, setNum3] = React.useState(-458967)
  const [num4, setNum4] = React.useState(378231)
  const [num5, setNum5] = React.useState()
  const [num6, setNum6] = React.useState()
  const [num7, setNum7] = React.useState(5666)

  const [txt3, setTxt3] = React.useState()
  const [txt4, setTxt4] = React.useState('As he crossed toward the pharmacy at the corner he involuntarily turned his head jump')

  const [tax1, setTax1] = React.useState()
  const [tax2, setTax2] = React.useState({value: 4515, name: 'GTX'})

  const [img1, setImg1] = React.useState()

  const [meta1, setMeta1] = React.useState({})

  // Entity
  const onSearch = React.useCallback((v) => {
    if (v === 'no') {
      return Promise.resolve([])
    } else if (v === 'many') {
      return Promise.resolve([
        { id: '1', name: 'Entity 1' },
        { id: '2', name: 'Entity 2' },
        { id: '3', name: 'Entity 3' },
        { id: '4', name: 'Entity 4' },
        { id: '5', name: 'Entity 5' },
        { id: '6', name: 'Entity 6' },
        { id: '7', name: 'Entity 7' },
        { id: '8', name: 'Entity 8' }
      ])
    } else {
      return Promise.resolve([
        { id: '1', name: 'Entity 1' },
        { id: '2', name: 'Entity 2' }
      ])
    }
  }, [])

  const onSearch2 = React.useCallback(() => {
    return Promise.resolve([{
      id: 'cus_sjaklfhj348ds',
      name: 'Customer A'
    }])
  }, [])

  const onInit = React.useCallback(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'rec_1', name: 'Recommended 1' },
          { id: 'rec_2', name: 'Recommended 2' },
        ])
      }, 1000)
    })
  }, [])

  // Valid input
  const [barcode, setBarcode] = React.useState()

  const onCheckValid = React.useCallback((v) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if(v === 'fail') {
          resolve({
            valid: false,
            message: 'Invalid input...'
          })
        } else {
          resolve({ valid: true })
        }
      }, 1000)
    })
  }, [])

  // Items
  const [items, setItems] = React.useState([{
    id: '17',
    name: 'My Product',
    amount: 1099,
    qty: 10,
    total: 10990,
    unit: 'ea'
  }, {
    id: '18',
    name: 'My Other Product',
    amount: 22034,
    qty: 30,
    total: 2220990,
    unit: 'ea'
  }])

  // Radio
  const [radio, setRadio] = React.useState('value2')


  // Percent
  const [ratio, setRatio] = React.useState()
  const [ratio2, setRatio2] = React.useState(3298)

  return (
    <>
      <h1>Controls</h1>

      <h3>Switch</h3>
      <Switch testId='switch-a' name='switchA' onChange={(v) => { setSwitchA(v) }} />
      {switchA ? <span>Switch A is On</span> : <span>Switch A is Off</span>}

      <h3>Switch with default value</h3>
      <Switch testId='switch-with-default' name='switchB' checked={true} />

      <h3>Tags</h3>
      <Tags name='tag-a' onChange={noop} />

      <h3>Tags with default values</h3>
      <Tags name='tag-b' onChange={noop} defaultTags={['foo', 'bar']} />

      <h3>Date</h3>
      <DateInput key="date1" name="date1" />
      <DateInput key="date2" name="date2" value={date2} onChange={setDate2} />
      <DateInput name="date3" timezone='Australia/Sydney' monthFirst={true} onChange={setDateUnix} value={dateUnix} />
      {dateUnix && <><span data-testid='date-tz-monthfirst-unix'>{dateUnix}</span><span data-testid='date-tz-monthfirst'>{new Date(dateUnix).toUTCString()}</span></>}

      <h3>Select</h3>
      <Select name="mood" options={MOODS} onChange={setMood} />
      {mood && <p>Why are you <em>{mood}</em>?</p>}

      <Select name="race" options={['earthling', 'martian', 'venusian']} withEmptyOption={false} defaultValue={race} onChange={setRace} />
      {
        race && (
          <>
            <p>Hi there <em>{race}</em>!</p>
            <button onClick={() => { setRace('martian') }}>Change to default</button>
          </>
        )
      }

      <h3>Money</h3>

      <h5>Money 1</h5>
      <p>Money control with no default value, displaying usd.</p>
      <Money testid='money1' name='money1' iso='usd' onChange={(v) => { console.log(v)  }} onFocus={(e) => {console.log(e)}} />

      <h5>Money 2</h5>
      <p>Money control with default value</p>
      <Money testid='money2' name="money2" iso='usd' onChange={setMoney2} value={money2} />

      <h5>Money 3</h5>
      <p>Money control with no default value, but with a button to change it dynamically.</p>
      <div data-testid="money3">
        <Money testid='money3' name="money3" iso='cad' onChange={setMoney3} value={money3} />
        <button onClick={() => { setMoney3(12345601) }}>Change to 123,456.01</button>
        <p>Current value: {money3.value}</p>
      </div>

      <h5>Money Tax</h5>
      <p>Money control with tax</p>
      <div data-testid='money-tax-1'>
        <MoneyTax
          name='moneyTax'
          iso='usd'
          defaultValue={moneyTax.value}
          defaultTax={moneyTax.tax}
          onPriceChange={(v) => {
            setMoneyTax(produce((draft = {}) => {
              set(draft, 'value', v)
            }))
          }}
          onTaxChange={(v) => {
            setMoneyTax(produce((draft) => {
              set(draft, 'tax', v)
            }))
          }}
        />
        <span data-testid='money-tax-1-display'>{JSON.stringify(moneyTax)}</span>
      </div>

      <h3>Number</h3>
      <label htmlFor='number1'>Number 1
        <NumberInput name="number1" onChange={(v) => { console.log(v) }} />
      </label>
      <label htmlFor="number2">Number 2
        <NumberInput name="number2" onChange={console.log} min={0} />
      </label>
      <label htmlFor='number3'>Default negative value
        <NumberInput name="number3" onChange={setNum3} value={num3} />
      </label>
      <label htmlFor='number4'>Default value
        <NumberInput name="number4" onChange={setNum4} value={num4} />
      </label>
      <div data-testid="number-change-val">
        <label htmlFor='number5'>Number 5
          <NumberInput name="number5" onChange={setNum5} value={num5} />
        </label>
        <button onClick={() => { setNum5(6578891) }}>Change to 6578891</button>
        <p>Number 5: {num5}</p>
      </div>
      <div data-testid="number6">
        <label htmlFor='number6'>Min/Max</label>
        <NumberInput name="number6" onChange={setNum6} value={num6} min={100} max={5000} />
        <p>Number 6: {num6}</p>
      </div>

      <div data-testid="number7">
        <label htmlFor='number7'>Centered</label>
        <NumberInput name="number7" onChange={setNum7} value={num7} center />
        <p>Number 7: {num7}</p>
      </div>

      <h3>Percent</h3>
      <Percent testid='test-percent' name="ratio" onChange={setRatio} value={ratio} />
      <Percent testid='test-percent2' name="ratio2" onChange={setRatio2} value={ratio2} />

      <h3>Text</h3>
      <label htmlFor='text1'>Text 1
        <TextInput name='text1' />
      </label>
      <label htmlFor='text2'>Text 2
        <TextInput width='250px' name='text2' max={20} />
      </label>
      <label htmlFor='text3'>Text 3
        <TextInput width='350px' name='text3' max={50} value={txt3} onChange={setTxt3} />
        <p>Text 3 : <em>{txt3}</em></p>
      </label>
      <label htmlFor='text4'>Text 4
        <TextInput width='350px' name='text4' max={80} value={txt4} onChange={setTxt4} />
        <p>Text 4 : <em data-testid="txt4">{txt4}</em></p>
      </label>
      <label htmlFor='text5'>Text 5
        <TextInput width='350px' name='text5' max={80} error="Invalid Input" />
      </label>
      <label htmlFor='textDisabled'>Text Disabled
        <TextInput disabled name='textDisabled' />
      </label>

      <h3 id="entity">Entity</h3>
      <label>Entity Search</label>
      <EntitySearch
        testid='entity-search-default'
        name='entity-search-1'
        onSearch={onSearch}
        onSelect={(v) => { console.log('EntitySearch: ', v) }}
      />
      <EntitySearch
        testid='entity-search-busy'
        name='entity-search-busy'
        forceBusy={true}
        onSearch={onSearch}
        onSelect={(v) => { console.log('EntitySearch: ', v) }}
      />

      <label>No predefined value
        <Entity
          testid='entity-nodefault'
          name='entity1'
          onSearch={onSearch}
          onClear={() => Promise.resolve()}
          onFetch={() => Promise.resolve('Entity A')}
          onChange={(v) => { console.log('Value changed to: ', v) }}
        />
      </label>

      <label>With predefined value</label>
      <Entity
        testid='entity-withdefault'
        name='entity2'
        value={idA}
        onSearch={onSearch2}
        onClear={() => {
          setIdA(undefined)
          return Promise.resolve()
        }}
        onFetch={(id) => {
          return new Promise((resolve) => {
            setTimeout(() => { resolve('Customer A ' + id) }, 10)
          })
        }}
        onChange={(v) => { setIdA(v) }}
      />

      <label>With initial or recommended results</label>
      <Entity
        testid='entity-init'
        name='entity-init'
        onSearch={onSearch}
        onInit={onInit}
        onClear={() => Promise.resolve()}
        onFetch={() => Promise.resolve('Entity A')}
        onChange={(v) => { console.log('Value changed to: ', v) }}
      />

      <label>Read only</label>
      <Entity
        testid='entity-ro'
        name='entity-ro'
        value={idA}
        readOnly
        onFetch={(id) => Promise.resolve('Customer A ' + id)}
      />

      <h3>Tax</h3>
      <label>No default value</label>
      <Tax name='tax1' testid='tax1' value={tax1} onChange={setTax1} />
      <div data-testid='tax1-out'>{displayTax(tax1)}</div>

      <label>With default value</label>
      <Tax name='tax2' testid='tax2' value={tax2} onChange={setTax2} />
      <div data-testid='tax2-out'>{displayTax(tax2)}</div>

      <h3>Multi Select</h3>
      <label>No default selected</label>
      <MultiSelect
        name='mselect1'
        testid='mselect1'
        options={['one', 'two', 'three', 'asfhdlsafhjksdlakl']}
      />
      <label>With some defaults</label>
      <MultiSelect
        name='mselect2'
        testid='mselect2'
        defaultSelected={['two', 'three']}
        options={['one', 'two', 'three', 'asfhdlsafhjksdlakl']}
        onChange={(v) => { /* console.log(v) */ }}
      />

      <label>Multi-line Area</label>
      <TextArea
        name='mtext'
        testid='mtext'
        onChange={(v) => { /* console.log(v) */ }}
      />

      <label>Multi-line Area (with limit)</label>
      <TextArea
        max={200}
        name='mtext2'
        testid='mtext2'
        onChange={(v) => { /* console.log(v) */ }}
      />

      <label>Custom rows/cols</label>
      <TextArea
        max={40}
        cols={15}
        rows={3}
        name='mtext3'
        testid='mtext3'
        error="Invalid Input"
        onChange={(v) => { /* console.log(v) */ }}
      />

      <label>Image</label>
      <ImageInput name="image1" value={img1} onChange={(o) => { setImg1(o.data) }} onClear={() => { setImg1(undefined) }} />

      <label>Multi-Entity Select</label>
      <EntityMultiSelect
        name='multi-select-entity'
        onSearch={onSearch}
        onChange={(v) => { console.log('Value changed to: ', v) }}
      />

      <br /><br />
      <h3>Metadata</h3>

      <Metadata name="meta1" onChange={setMeta1} value={meta1} />

      <br /><br />
      <h3>ValidInput</h3>

      <br />
      <label>no value</label>
      <ValidInput
        testid='v1'
        name='valid-no-value'
        onCheck={onCheckValid}
        value={barcode}
        onAccept={(v) => { setBarcode(v); return Promise.resolve({valid: true}) }}
        onRemove={() => { setBarcode(); return Promise.resolve({valid: true}) } }
      />

      <br /><br />
      <label>with value</label>
      <ValidInput testid='v2' name='valid-with-value' value='Selected value' />

      <br />
      <label>disabled</label>
      <ValidInput testid='v3' name='valid-disabled' disabled />

      <h3>Items</h3>

      <Items
        name='items'
        items={items}
        onSearch={onSearch}
        onChange={setItems}
        linesDef={[{
          name: 'Product',
          width: '36%'
        }, {
          name: 'Price',
          width: '20%',
          align: 'right'
        }, {
          name: 'Qty',
          width: '10%',
          align: 'center'
        }, {
          name: 'Total',
          width: '28%',
          align: 'right'
        }]}
        currency='usd'
        symbol='$'
      />

      <Items
        testid='order-items-disabled'
        items={items}
        onSearch={onSearch}
        onChange={setItems}
        currency='usd'
        symbol='$'
        disabled
      />

      <h3>Radios</h3>

      <Radio
        name="myradio"
        defs={[{
          name: 'Value 1',
          value: 'value1',
          hint: 'Description of value 1'
        }, {
          name: 'Value 2',
          value: 'value2',
          hint: 'Description of value 2'
        }]}
        value={radio}
        onChange={(v) => { setRadio(v) }}
      />
      <span>{radio}</span>
    </>
  )
}

