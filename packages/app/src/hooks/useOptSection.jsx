import * as React from 'react'
import { cssPointer } from '@pickestry/components'
import styled from 'styled-components'
import PlusCircleIcon from 'assets/plus-circle.svg'

export const useOptSection = (element, name, always = false) => {

  const [show, setShow] = React.useState(false)

  return (show || always) ? element : (
    <SectionShow onClick={() => { setShow(true) }}>
      <PlusCircle />
      <SectionBody>{ name }</SectionBody>
    </SectionShow>
  )
}

const SectionShow = styled.button`
  display: block;
  margin: 4px 0;
  padding-top: 6px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #efefef;
  color: #3e3e3e;
  ${ cssPointer }
`

const SectionBody = styled.p`
  display: block;
  padding: 4px;
  float: right;
`

const PlusCircle = styled(PlusCircleIcon)`
  fill: #eee;
  stroke: #3e3e3e;
`
