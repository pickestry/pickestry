import * as React from 'react'
import styled from 'styled-components'
import { get } from 'lodash-es'
import { Hr } from '@pickestry/components'
import { Panel } from '@pickestry/components'
import { FilterPanel } from '@pickestry/components'
import { Button } from '@pickestry/components'
import { Label } from '@pickestry/components'
import { TextInput } from '@pickestry/components'
import { reports } from '@pickestry/defs'
import { schema } from '@pickestry/defs'
import { ctrlInvoker } from '../../common/ctrlInvoker.mjs'
import { usePage } from '../page/usePage.mjs'

export const GenerateReport = () => {

  const { meta, navigate } = usePage()

  const type = meta('type')

  const [, setError] = React.useState()

  const [name, setName] = React.useState()

  const [query, setQueryState] = React.useState({})

  const [, setState] = React.useState('init') // init, fetching, done

  const setQuery = React.useCallback((v) => {
    setError(undefined)
    setQueryState(v)
  }, [setQueryState])

  const queryChanged = React.useCallback((q = {}) => {
    setQuery(q)
  }, [setQuery])

  const [title, description] = React.useMemo(() => {
    const found = reports.find(({name}) => name == type)
    return [get(found, 'title'), get(found, 'description')]
  }, [type])

  const onGenerate = React.useCallback(() => {
    setState('init')

    ctrlInvoker.generateReport({
      type,
      name: (name || title),
      query
    }).then((reportId) => {
      navigate('sales.tax.view', { id: reportId })
    })
    .finally(() => { setState('done') })
  }, [query])

  return (
    <>
      <Panel title={title} hint={description}>
        <Label>Name</Label>
        <TextInput width='350px' name='name' onChange={setName} />
        <Hr />
        <FilterPanel
          key={'filter'}
          defs={schema.getFilterItems('salesTaxReport')}
          onQuery={queryChanged}
          defaultQuery={query}
          displayDate={(d) => {
            return new Date(d).toISOString().split('T')[0]
          }}
        />
        <GenerateRoot>
          <p>Choose name and filling period to generate sales tax reports</p>
          <Button onClick={onGenerate}>Generate</Button>
        </GenerateRoot>
      </Panel>
    </>
  )
}

const GenerateRoot = styled.div`
  width: 400px;
  margin: calc(8vh) auto;

  & > p {
    margin-bottom: 32px;
  }

  & > button {
    display: block;
    margin: auto;
  }
`
