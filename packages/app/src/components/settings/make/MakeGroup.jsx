import * as React from 'react'
import styled from 'styled-components'
import { H } from '@pickestry/components'
import { Render } from '../../page/Render.jsx'
import { Link } from '../../page/index.mjs'
import { MakeForm } from './MakeForm.jsx'
import { JobsForm } from './JobsForm.jsx'
import { DeviceForm } from './DeviceForm.jsx'


export const MakeGroup = () => {
  return (
    <>
      <Nav>
        <NavItem><Link to='make.jobs' markActive>Jobs</Link></NavItem>
        <NavItem><Link to='make.inventory' markActive loose>Inventory</Link></NavItem>
        <NavItem><Link to='make.devices' markActive loose>Devices</Link></NavItem>
      </Nav>
      <Render on='make.jobs' redirectFrom='make' element={<JobsForm />} />
      <Render on='make.inventory' element={<MakeForm />} />
      <Render on='make.devices' element={<DeviceForm />} />
    </>
  )
}


const Nav = styled(H)`
  margin-top: 14px;
  border-bottom: 1px solid #ccc;
  justify-content: start;
  gap: 14px;
`

const NavItem = styled(H.Item)`
  font-size: 16px;
`
