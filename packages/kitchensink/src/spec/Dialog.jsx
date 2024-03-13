// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { Dialog as DialogComponent } from '../../../components/src/dialog'
import { DialogBody } from '../../../components/src/dialog'
import { DialogHeader } from '../../../components/src/dialog'

export function Dialog() {

  const [dlgA, setDlgA] = React.useState(false)

  const [mdl, setMdl] = React.useState(false)

  return (
    <>
      <h1>Dialog</h1>

      <h3>Default Dialog</h3>
      {
        dlgA && (
          <DialogComponent open={dlgA} onOpenChange={setDlgA}>
            <DialogHeader>
              Header 1 A Realy Long Header Here. So long that is should be truncated
            </DialogHeader>
            <DialogBody>
              Not a modal by default. Keep tapping tab and see what happens.
              <br />
              One: <input name="one" autoFocus />
              <br />
              TWo: <input name="two" />
            </DialogBody>
          </DialogComponent>
        )
      }

      <button onClick={() => { setDlgA(true) }}>Open Dialog</button>

      <h3>Modal Dialog</h3>
      {
        mdl && (
          <DialogComponent modal={true} open={mdl} onOpenChange={setMdl}>
            <DialogHeader>A Modal Dialog</DialogHeader>
            <DialogBody>
              <p style={{width: 450}}>
                Unlike a regular dialog, this dialog should not close when tapping tab.
                <br />
              One: <input name="one" autoFocus />
              <br />
              TWo: <input name="two" />
              </p>
            </DialogBody>
          </DialogComponent>
        )
      }

      <button onClick={() => { setMdl(true) }}>Open Modal Dialog</button>
    </>
  )
}
