// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { Menu } from '@pickestry/components'
import { MenuItem } from '@pickestry/components'
import { H } from '@pickestry/components'
import { appInvoker } from '../common/appInvoker.mjs'
import logoImg from 'assets/logo.png'
import logoTestImg from 'assets/logo_text_inverse.png'
import UserIcon from 'assets/user.svg'


export const Header = () => {

	return (
		<StyledHeader>
      <div>
        <StyledLogoImg src={logoImg} />
        <LogoText src={logoTestImg} />
      </div>
      <ActionItems>
        <H.Item>
          <Menu element={<StyledUserIcon />}>
            <MenuItem label="Settings" onClick={() => { appInvoker.showSettings() }} />
          </Menu>
        </H.Item>
      </ActionItems>
		</StyledHeader>
	)
}

const StyledHeader = styled.header`
  height: 44px;
  color: ${({theme: { palette: { primary } }}) => primary.invert};
  background: ${({theme: { palette: { primary } }}) => primary.main};
`

const StyledUserIcon = styled(UserIcon)`
	fill: ${({theme: { palette: {primary}}}) => primary.main};
  stroke: white;
  margin: 6px;
  margin-right: 8px;
`

const StyledLogoImg = styled.img`
  position: absolute;
  top: 6px;
  left: 4px;
  height: 32px;
`

const LogoText = styled.img`
  height: 25px;
  position: absolute;
  top: 11px;
  left: 41px;
`

const ActionItems = styled(H)`
  justify-content: flex-end;
  align-items: end;
  width: 150px;
  position: absolute;
  top: 4px;
  right: 0;
`
