import * as React from 'react'
import styled from 'styled-components'
import { isFunction } from 'lodash-es'
import { Panel } from '@pickestry/components'
import { ListData } from './ListData'
import { Link } from '../page/Link.jsx'
import { schema } from '@pickestry/defs'
import { usePage } from '../page/usePage.mjs'
import { NotFound } from '../NotFound'
import { appInvoker } from '../../common/appInvoker.mjs'

export const CrudContent = ({
  type,
  title,
  hint,
  dlgNew = `${type}-create`,
  globalActions,
  actions,
  additionalActions,
  dataDisplay,
  customGetCollection,
  withBack = false,
  backText = 'Go Back',
  notFoundEl = <NotFound />,
  onExport
}) => {

  if(!schema.has(type)) throw new Error(`${type} was not found`)

  const { getItem } = usePage()

  const query = getItem('query')

  const gActions = React.useMemo(() => {
    const _arr = []
    if(!globalActions) {
      _arr.push({
        name: 'New',
        action: () => { appInvoker.showDialog(dlgNew) }
      })
    } else {
      for(const ga of globalActions) {
        _arr.push(ga)
      }
    }

    if(isFunction(onExport)) {
      _arr.push({
        name: 'Export CSV',
        action: () => {
          onExport('csv', query)
        }
      })
      _arr.push({
        name: 'Print PDF',
        action: () => {
          onExport('pdf', query)
        }
      })
    }

    return _arr
  }, [globalActions, query])

  const finalHint = React.useMemo(() => {
    return hint ? hint : schema.getDescription(type)
  }, [hint, type])

  return (
    <>
      <Root>
        { withBack && (<Link to="..">{ backText }</Link>) }
        <Panel
          title={title || schema.getPlural(type)}
          hint={finalHint}
          actions={gActions}
        >
          <ListData
            type={type}
            actions={actions}
            additionalActions={additionalActions}
            dataDisplay={dataDisplay}
            notFoundEl={notFoundEl}
            customGetCollection={customGetCollection}
          />
        </Panel>
      </Root>
    </>
  )
}

const Root = styled.div`
  max-height: calc(100vh - 133px);
  overflow: auto;
`
