import * as React from 'react'
import styled from 'styled-components'
import { get } from 'lodash-es'
import { Panel } from '@pickestry/components'
import { Frame } from '@pickestry/components'
import { BlankLink } from '@pickestry/components'
import { Button } from '@pickestry/components'
import { cssHover } from '@pickestry/components'
import { H } from '@pickestry/components'
import { V } from '@pickestry/components'
import { usePage } from '@pickestry/components'
import { useControl } from '@pickestry/components'
import { GoBack } from '../GoBack.jsx'
import * as c from '../../c.mjs'

export const PartsView = () => {

  const [fetched, setFetched] = React.useState()

  const [refresh, setRefresh] = React.useState()

  const { meta } = usePage()

  const appInvoker = useControl('app')

  const ctrlInvoker = useControl()

  const id = React.useMemo(()=> meta('id'), [])

  React.useEffect(() => {
    ctrlInvoker.getEntity({
        model: 'Product',
        id,
        include:[{association: 'parts'}]
      })
      .then((entity) => {
        setFetched(entity)
      })
  }, [refresh])

  React.useEffect(() => {
    function onEvent() {
      setRefresh(+new Date())
    }

    window.ipc.on('event', onEvent)

    return function cleanup() {
      window.ipc.off('event', onEvent)
    }
  }, [])

  return (
    <>
      <GoBack title='Back to Products' />
      <Panel title="Parts" hint="Parts or material required to make this product">
      {
        fetched && (
          <>
            <DisplayProduct>
              <p>Parts needed to make <em>1</em> {fetched.unit} of {fetched.name}:</p>
              <AddPart onClick={() => {appInvoker.showDialog(c.DLG_ADD_PART, {id})}}>Add Part</AddPart>
            </DisplayProduct>
            <PartList>
            {
              fetched.parts.map((part) => {
                return (
                  <PartLine key={part.id}>
                    <PartName>
                      <H>
                        <H.Item>
                          <PartQty>{get(part, 'ProductPart.qty', '-')}</PartQty>
                          <PartUnit>{get(part, 'unit')}  of</PartUnit>
                          {get(part, 'name')}
                        </H.Item>
                        <H.Item>
                          <BlankLink onClick={() => { appInvoker.showDialog(c.DLG_CHANGE_PART_QTY, {id, partId: part.id})}}>Change Qty</BlankLink>
                          <span style={{marginLeft: '15px'}} />
                          <BlankLink onClick={() => {
                            if(window.confirm('Realy remove?'))
                              ctrlInvoker.removePart({id, partId: part.id})
                            }}
                          >Remove</BlankLink>
                        </H.Item>
                      </H>
                    </PartName>
                  </PartLine>
                )
              })
            }
            </PartList>
          </>
        )
      }
      </Panel>
    </>
  )
}

const DisplayProduct = styled.div`
  position: relative;
  margin-top: 24px;
  padding-left: 8px;
`

const AddPart = styled(Button)`
  position: absolute;
  top: -7px;
  right: 6px;
`

const PartList = styled(V)`
  gap: 6px;
  margin-top: 12px;
`

const PartLine = styled(Frame)`
  padding: 16px;
  ${cssHover}
`

const PartQty = styled.span`
  display: inline-block;
  min-width: 24px;
  text-align: right;
  margin-right: 4px;
`

const PartUnit = styled.span`
  display: inline-block;
  width: 50px
  text-align: right;
  margin-right: 4px;
`

const PartName = styled.div`

`

