// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { Flex } from '../../../components'
import { FlexItem } from '../../../components'
import { H } from '../../../components'
import { V } from '../../../components'
import { Panel } from '../../../components/src/panel'
import TruckIcon from './truck.svg'

export function Layout() {

  const containerStyle = {
    background: '#FECF6A'
  }

  const itemStyle = {
    background: '#194A8D',
    padding: '8px'
  }

  return (
    <>
      <h1>Flex</h1>
      <Flex style={containerStyle}>
        <FlexItem style={itemStyle}>Item 1</FlexItem>
        <FlexItem style={itemStyle}>Item 2</FlexItem>
      </Flex>

      <h1>Horizontal</h1>
      <H style={containerStyle}>
        <H.Item style={itemStyle}>Horizontal 1</H.Item>
        <H.Item style={itemStyle}>Horizontal 2</H.Item>
        <H.Item style={itemStyle}>Horizontal 3</H.Item>
      </H>

      <h1>Vertical</h1>
      <V style={containerStyle}>
        <V.Item key='11' style={itemStyle}>Vertical 1</V.Item>
        <V.Item key='12' style={itemStyle}>Vertical 2</V.Item>
        <V.Item key='13' style={itemStyle}>Vertical 3</V.Item>
      </V>

      <h3>No gutter</h3>
      <V style={containerStyle}>
        <V.Item key='1' gutter='18px' style={itemStyle}>Vertical 1</V.Item>
        <V.Item key='2' style={itemStyle}>Vertical 2</V.Item>
        <V.Item key='3' style={itemStyle}>Vertical 3</V.Item>
      </V>

      <br /><br /><br />
      <h3>A Simple Panel</h3>
      <Panel title="Hello Panel">
        Hi! This is panel&apos;s content.
      </Panel>

      <br /><br /><br />
      <h3>A Bare Panel</h3>
      <Panel title="Hello Panel" bare>
        Hi! This is panel&apos;s content.
      </Panel>

      <br /><br /><br />
      <h3>Simple Panel with actions</h3>
      <Panel title="Hello Panel" actions={[
          {name: 'Action One', action: () => {}},
          {name: 'Action Two', action: () => {}}
        ]}>
        Here are a couple of actions for you.
      </Panel>

      <br /><br /><br />
      <h3>Panel with custom menu</h3>
      <Panel
        title="Welcome Panel"
        actionsEl={<TruckIcon />}
        actions={[
          {name: 'Action One', action: () => {}},
          {name: 'Action Two', action: () => {}}
        ]}
      >
        ** Hi! **
      </Panel>
    </>
  )
}
