import * as React from 'react'
import { Table } from '@pickestry/components'
import { FilterPanel } from '@pickestry/components'
import { Paginator } from '@pickestry/components'
import { schema } from '@pickestry/defs'
import { isEmpty } from 'lodash-es'
import { isFunction } from 'lodash-es'
import { useControl } from '../control/index.mjs'
import { usePageStore } from '../page/usePageStore.mjs'
import { useSettings } from '../settings/useSettings.mjs'

export const ListData = ({
    type,
    actions,
    additionalActions,
    dataDisplay,
    customGetCollection,
    notFoundEl = (<div>No results found</div>)
  }) => {

  const [data, setData] = React.useState([])

  const [count, setCount] = React.useState(0)

  const [page, setPage] = usePageStore('page', 1)

  const [totalPages, setTotalPages] = React.useState(0)

  const [query, setQuery] = usePageStore('query', {})

  const [refresh, setRefresh] = React.useState(0)

  const [state, setState] = React.useState('init') // init, fetching, done

  const [order] = usePageStore('order')

  const appInvoker = useControl('app')

  const ctrlInvoker = useControl()

  const {
    amount,
    currency
  } = useSettings()

  const moneyDecimal = React.useMemo(() => {
    if(amount === 'dot_comma') {
      return ','
    } else {
      return '.'
    }
  }, [amount])

  const moneySeparator = React.useMemo(() => {
    if(amount === 'dot_comma') {
      return '.'
    } else {
      return ','
    }
  }, [amount])

  const moneySymbol = React.useMemo(() => {
    switch(currency) {
    case 'cad': return '$'
    case 'usd': return '$'
    default: return '$'
    }
  }, [currency])


  const queryChanged = React.useCallback((q = {}) => {
    setPage(1)
    setQuery(q)
  }, [])

  const getCollection = React.useCallback((page, query, order) => {
    const offset = (page - 1) * 10
    const limit = 10

    return ctrlInvoker.getCollection({
      model: schema.getModel(type),
      offset,
      limit,
      query,
      include: schema.getInclude(type),
      order
    })
  }, [])

  React.useEffect(() => {
    if(page > 0) {
      setState('fetching')

      if(isFunction(customGetCollection)) {
        customGetCollection(page, query, order)
          .then(({ count, data }) => {
            setData(data)
            setCount(count)
            setTotalPages(Math.ceil(count/10))
          })
          .finally(() => { setState('done') })
      } else {
        getCollection(page, query, order)
          .then(({ count, data }) => {
            setData(data)
            setCount(count)
            setTotalPages(Math.ceil(count/10))
          })
          .finally(() => { setState('done') })
      }
    }
  }, [query, page, order, refresh])

  React.useEffect(() => {
    function onEvent() {
      setPage(1)
      setRefresh(+new Date())
    }

    window.ipc.on('event', onEvent)

    return function cleanup() {
      window.ipc.off('event', onEvent)
    }
  }, [])

  const finalActions = React.useMemo(() => {
    let _actions = []
    if(actions) {
      _actions = actions
    } else if(schema.getActions(type)) {
      _actions = schema.getActions(type)
    } else {
      _actions.push({
        name: 'Edit',
        action: ({ id }) => { appInvoker.showDialog(`${type}-update`, {id}) },
        primary: true
      })
      _actions.push({
        name: 'Delete',
        action: ({ id }) => {
          if(window.confirm('Realy delete?'))
            ctrlInvoker.destroyEntity({ model: schema.getModel(type), id })
        }
      })

      if(additionalActions) {
        _actions = _actions.concat(additionalActions)
      }
    }

    return _actions
  }, [actions, additionalActions])

  if(state === 'init') return <div>Loading ...</div>

  return (
    <>
      {
        schema.hasFilter(type) && (
          <>
            <FilterPanel
              defs={schema.getFilterItems(type)}
              onQuery={queryChanged}
              defaultQuery={query}
              config={{
                moneyIso: currency,
                moneyDecimal,
                moneySeparator,
                moneySymbol
              }}
            />
            <br />
          </>
        )
      }
      {
        (state === 'init' || !isEmpty(data)) ? (
          <>
            <Table
              colDef={schema.getColDef(type)}
              data={data}
              actions={finalActions}
              dataDisplay={dataDisplay || schema.getTableDataDisplay(type)}
            />
            {
              <Paginator
                page={page}
                totalPages={totalPages}
                totalItems={count}
                onRetrieveRequest={setPage}
              />
            }
          </>
        ) : notFoundEl
      }

      {/*<pre>{JSON.stringify(data, null, 2)}</pre>*/}
    </>

  )
}
