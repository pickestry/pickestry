// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import styled from 'styled-components'
import { H } from '@pickestry/components'
import PlayIcon from 'assets/play.svg'
import BoxIcon from 'assets/box.svg'
import FFIcon from 'assets/fast-forward.svg'
import DollarIcon from 'assets/dollar-sign.svg'
import CircleIcon from 'assets/circle.svg'
import { Link } from './page/index.mjs'

export const Nav = () => {

  return (
    <Root>
      <H.Item><Link to='/' markActive><StyledPlayIcon viewBox='0 0 24 24' width={20} height={20} /><Text>Start</Text></Link></H.Item>
      <H.Item><Link to='make' markActive loose><StyledFFIcon viewBox='0 0 24 24' width={20} height={20} /><Text>Make</Text></Link></H.Item>
      <H.Item><Link to='sales' markActive loose><StyledDollarIcon viewBox='0 0 24 24' width={20} height={20} /><Text>Sell</Text></Link></H.Item>
      <H.Item><Link to='products' markActive loose><StyledBoxIcon viewBox='0 0 24 24' width={20} height={20} /><Text>Products</Text></Link></H.Item>
      <H.Item><Link to='more' markActive loose><StyledCircleIcon viewBox='0 0 24 24' width={20} height={20} /><Text>More</Text></Link></H.Item>
    </Root>
  )
}

const Root = styled(H)`
  max-width: 400px;
  margin: 22px auto 0;
`

const StyledPlayIcon = styled(PlayIcon)`
  fill: #eee;
  stroke: ${({theme: { palette: {primary}}}) => primary.main};
`

const StyledBoxIcon = styled(BoxIcon)`
  stroke:  ${({theme: { palette: {primary}}}) => primary.main};
  fill: #eee;
`

const StyledFFIcon = styled(FFIcon)`
  fill: #eee;
  stroke: ${({theme: { palette: {primary}}}) => primary.main};
`

const StyledDollarIcon = styled(DollarIcon)`
  fill: #eee;
  stroke: ${({theme: { palette: {primary}}}) => primary.main};
`

const StyledCircleIcon = styled(CircleIcon)`
  fill: #eee;
  stroke: ${({theme: { palette: {primary}}}) => primary.main};
`

const Text = styled.span`
  margin-top: 2px;
  margin-left: 4px;
  display: block;
  float: right;
`
