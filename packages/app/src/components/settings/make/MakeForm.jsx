import * as React from 'react'
import styled from 'styled-components'
import { Form } from '@pickestry/components'
import { SwitchField } from '@pickestry/components'
import { Busy } from '@pickestry/components'
import { Dialog } from '@pickestry/components'
import { DialogBody } from '@pickestry/components'
import { DialogHeader } from '@pickestry/components'
import { Hr } from '@pickestry/components'
import { List } from '@pickestry/components'
import { Label } from '@pickestry/components'
import { Muted } from '@pickestry/components'
import { Button } from '@pickestry/components'
import { appInvoker } from '../../../common/appInvoker.mjs'
import { ctrlInvoker } from '../../../common/ctrlInvoker.mjs'
import { DevOnly } from '../../DevOnly.jsx'
import { get } from 'lodash-es'
import { produce } from 'immer'
import { Alert } from '@pickestry/components'
import { LocationMappingForm } from '../../../components/forms/LocationMappingForm.jsx'

export const MakeForm = () => {

  const [settings, setSettings] = React.useState()

  const [message, setMessage] = React.useState()

  const [open, setOpen] = React.useState(false)

  const clearMessage = React.useCallback(() => {
    setMessage(undefined)
  }, [])

  React.useEffect(() => {
    appInvoker.settingsWithOptions()
      .then((o) => { setSettings(o) })
      .catch(console.log) // eslint-disable-line no-console
  }, [])

  const actualSettings = React.useMemo(() => get(settings, 'settings', {}), [settings])

  const {
    make_finished_job_inventory,
    make_finished_job_inventory_pairs = []
  } = actualSettings

  const onSubmit = React.useCallback((o) => {
    return appInvoker.updateSettings(o)
      .then((st) => {
        setSettings(produce((draft) => {
          draft.settings = st
        }))
      })
  }, [])

  const onLocationMapping = React.useCallback(({
    locationTo,
    locationFrom
  }) => {
    const locationIds = []
    if(locationFrom) locationIds.push(locationFrom)
    if(locationTo) locationIds.push(locationTo)

    return new Promise((resolve, reject) => {
      if(locationIds.length < 2) {
        return reject(new Error('both locations required'))
      }

      // check for duplicates
      let hasDuplicate = false
      for(const o of make_finished_job_inventory_pairs) {
        if(o.toId == locationTo && o.fromId == locationFrom) {
          hasDuplicate = true
          break
        }
      }
      if(hasDuplicate) {
        return reject(new Error('mapping exists'))
      }

      ctrlInvoker.getCollection({
        model: 'Location',
        query: { id: { in: locationIds } }
      })
      .then(({ data }) => {
        const item = {}
        for(const o of data) {
          if(o.id == locationTo) {
            item.toId = o.id
            item.toName = o.name
          } else {
            item.fromId = o.id
            item.fromName = o.name
          }

          item.id = `${locationFrom}-${locationTo}`
          item.name = `Jobs from ${item.fromName} will be transferred to ${item.toName}`
        }
        const arr = [...make_finished_job_inventory_pairs]
        arr.push(item)
        appInvoker.updateSettings({ make_finished_job_inventory_pairs: arr })
          .then((st) => {
            setSettings(produce((draft) => { draft.settings = st }))
            resolve()
          })
      })
    })
  }, [make_finished_job_inventory_pairs])

  const onRemoveMapping = React.useCallback((itemId) => {
    const idx = make_finished_job_inventory_pairs.findIndex(({ id }) => id == itemId)
    if(idx > -1) {
      const arr = [...make_finished_job_inventory_pairs]
      arr.splice(idx, 1)
      return appInvoker.updateSettings({ make_finished_job_inventory_pairs: arr })
        .then((st) => { setSettings(produce((draft) => { draft.settings = st })) })
    }
  }, [make_finished_job_inventory_pairs])

  const form = React.useMemo(() => {
    return (
      <Form entity={{ make_finished_job_inventory }} onSubmit={onSubmit} onSuccess={() => { setMessage('Settings saved') }}>
        <SwitchField
          name='make_finished_job_inventory'
          label='Move finished jobs to inventory'
          hint='When removing a job its progress will be transferred to the location specified' />
      </Form>
    )
  }, [make_finished_job_inventory, onSubmit])

  return settings ? (
      <>
        { message && <Alert type='success' message={message} onClose={clearMessage} /> }
        { form }
        <DevOnly entity={settings} />
        <Hr />
        <AddMappingButton onClick={() => { setOpen(true) }}>Add Location Mapping</AddMappingButton>
        <br />
        <Label>Active Mapping</Label>
        <br />
        <Muted>Removed jobs will transfer progress to mapped inventory</Muted>
        <br />
        <br />
        <List
          data={make_finished_job_inventory_pairs}
          onRemove={({ id }) => { onRemoveMapping(id) }}
        />
        {
          open && (
            <Dialog open={open} onOpenChange={setOpen} modal onClose={() => {}}>
              <DialogHeader>Transfer finished jobs from/to location</DialogHeader>
              <DialogBody>
                <LocationMappingForm onSubmit={onLocationMapping} onSuccess={() => { setOpen(false) }} />
              </DialogBody>
            </Dialog>
          )
        }
      </>
    ) : <Busy busy={true} />
}

const AddMappingButton = styled(Button)`
  display: block;
  margin-top: 15px;
`
