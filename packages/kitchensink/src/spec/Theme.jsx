// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { isString } from 'lodash-es'

const PALETTE = [{
  name: 'primary',
  variants: ['main', 'light', 'lighter', 'tint']
}, {
  name: 'secondary',
  variants: ['main', 'light']
},
{
  name: 'warn',
  variants: ['main', 'light', 'lighter']
}, {
  name: 'info',
  variants: ['main', 'light', 'lighter']
}, {
  name: 'danger',
  variants: ['main', 'light', 'lighter']
}, {
  name: 'common',
  variants: ['black', {
    name: 'white',
    darkBg: true
  }]
}, {
  name: 'text',
  variants: ['main', {
    name: 'invert',
    darkBg: true
  }]
}, {
  name: 'grey',
  variants: ['main', 'light', 'lighter']
}, {
  name: 'highlight'
}, {
  name: 'textMuted'
}]

export function Theme() {

  return (
    <>
      <h3>Palette</h3>
      {
        PALETTE.map((o) => {
          if(o.variants) {
            return o.variants.map((k) => {
              const key = `${o.name}-${k}`
              const vName = isString(k) ? k : k.name
              const darkBg = isString(k) ? false : k.darkBg
              return <ThemeColor key={key} name={o.name} variant={vName}  darkBg={darkBg} />
            })
          } else {
            return <ThemeColor key={o.name} name={o.name} />
          }
        })
      }
    </>
  )

}

const ThemeColor = styled.div`
  color: ${({theme: { palette }, name, variant}) => variant ? palette[name][variant] : palette[name]};

  background: ${({ darkBg = false }) => darkBg ? '#5c5c5c' : 'auto'};
  border-radius: 4px;

  &:before {
    content: '${({name, variant}) => variant ? `${name}.${variant}`: `${name}` }';
  }
`

