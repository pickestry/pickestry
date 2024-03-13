import * as React from 'react'
import styled from 'styled-components'
import { H } from '@pickestry/components'
import { V } from '@pickestry/components'
import { Select } from '@pickestry/components'
import { Tags } from '@pickestry/components'
import { useForm } from '@pickestry/components'
import { FormLabel } from '@pickestry/components'
import { FormGroup } from '@pickestry/components'
import { FormHint } from '@pickestry/components'
import { differenceLeft } from '@pickestry/utils'
import { produce } from 'immer'
import { isNil } from 'lodash-es'
import { map } from 'lodash-es'
import { isEmpty } from 'lodash-es'

export const ProductOptionsField = () => {

  const { getValue, updateModel } = useForm()

  const definedOptions = getValue({
    name: 'options',
    defaultValue: []
  })

  const [availableOptions] = React.useState([ 'Color', 'Size', 'Material', 'Feature', 'Finish', 'Misc' ])

  const [selectedOption, setSelectedOption] = React.useState()

  const ref = React.useRef()

  const optionsName = React.useMemo(() => {
    return differenceLeft(availableOptions, map(definedOptions, 'name'))
  }, [availableOptions, definedOptions])

  const onSelect = React.useCallback((value) => {
    setSelectedOption(value)
  }, [])

  const createOption = React.useCallback((e) => {
    if(isNil(selectedOption)) return

    e.preventDefault()
    const nextState = produce(definedOptions ?? [], (draft) => {
      if(!isNil(selectedOption))
        draft.push({name: selectedOption, values: []})
    })

    updateModel({ name: 'options',  value: nextState })
    setSelectedOption()
  }, [selectedOption, availableOptions])

  const removeOption = React.useCallback((option) => {
    const nextState = produce(definedOptions, (draft) => {
      const found = definedOptions.findIndex((o) => o.name === option)
      draft.splice(found, 1)
    })

    updateModel({ name: 'options',  value: nextState })
  }, [definedOptions])

  const onOptionUpdate = React.useCallback((option, values) => {
    if(values && values.length !== 0) {
      const updatedOption = {
        name: option,
        values: values.map((v) => ({ name: v }))
      }
      const nextState = produce(definedOptions, (draft) => {
        const found = definedOptions.findIndex((o) => o.name === option)
        const shouldDelete = found !== -1 ? 1 : 0
        draft.splice(found, shouldDelete, updatedOption)
      })

      updateModel({ name: 'options',  value: nextState })
    }
  }, [definedOptions])

  return (
    <FormGroup>
      <FormLabel htmlFor='product-options'>Options</FormLabel>
      <FormHint>Options for product variants</FormHint>

      {
        !isEmpty(optionsName) && (
          <H $justifyContent="flex-start">
            <H.Item>
              <AvailableOptionsLabel>Available Options:</AvailableOptionsLabel>
            </H.Item>
            <H.Item>
              <Select
                key={`product-option-${selectedOption}`}
                name="product-options"
                ref={ref}
                onChange={onSelect}
                options={optionsName.map((value) => ({value, name: value}) )} defaultValue={selectedOption ? selectedOption : ''} />
            </H.Item>
            <H.Item><button style={{marginTop: '2px'}} onClick={createOption}>Add Option</button></H.Item>
          </H>)
      }
      <br />
      <V>
        {
          (definedOptions ?? []).map((v) => (
            <V.Item key={v.name}>
              <H>
                <H.Item>
                <span>
                  {v.name}: <Tags testId={`tags-${v.name}`} defaultTags={v.values.map(({ name }) => name)} onChange={(tags) => {onOptionUpdate(v.name, tags)}} />
                </span>
                </H.Item>
                <H.Item>
                  <Remove style={{ marginTop: '18px', marginRight: '8px'}} onClick={() => { removeOption(v.name) }}>Remove</Remove>
                </H.Item>
              </H>
            </V.Item>))
        }
      </V>
    </FormGroup>
  )
}

const AvailableOptionsLabel = styled.label`
  margin-top: 5px;
  display: block;
`

const Remove = styled.button`
  marginTop: 18px;
  marginRight: 8px;
`
