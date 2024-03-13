// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { get } from 'lodash-es'
import { isNil } from 'lodash-es'
import { CrudContent } from './crud/index.mjs'
import { appInvoker } from '../common/appInvoker.mjs'
import { ctrlInvoker } from '../common/ctrlInvoker.mjs'
import statusCreatedImg from 'assets/status_created.png'
import statusDoneImg from 'assets/status_done.png'
import statusIncidentImg from 'assets/status_incident.png'
import statusStartedImg from 'assets/status_started.png'
import statusWorkingImg from 'assets/status_working.png'
import { usePage } from './page/usePage.mjs'
import * as c from '../c.mjs'

export const JobCrudContent = () => {

  const { navigate } = usePage()

  const dataDisplay = React.useCallback((o, colDef) => {
    if(colDef.name === 'status') {
      const maybeIncident = get(o, 'PipelineStage.incident', false)
      const maybeStagePosition = get(o, 'PipelineStage.position')

      if(isNil(o.PipelineStage)) {
        return <Img title="Job recently created" src={statusCreatedImg} />
      } else if(maybeIncident === true) {
        return <Img title="Incident happened" src={statusIncidentImg} />
      } else if(maybeStagePosition === 1) {
        return <Img title="Job started" src={statusStartedImg} />
      } else if(maybeStagePosition === 3) {
        return <Img title="Job is finished" src={statusDoneImg} />
      } else {
        return <Img title="In progress..." src={statusWorkingImg} />
      }
    }
  }, [])

  const actions = React.useCallback((o) => {
    const _actions = []

    if(!o.PipelineId && !o.PipelineStage) {
      _actions.push({
        name: 'Assign to Pipeline',
        primary: true,
        action: ({ id }) => {
          appInvoker.showDialog(c.DLG_JOB_ASSIGN, { id })
        }
      })
    } else {
      _actions.push({
        name: 'View',
        primary: true,
        action: (o) => {
          const pipelineId = get(o, 'PipelineStage.PipelineId', get(o, 'PipelineId'))
          if(pipelineId)
            navigate('make.pipelines.view', {id: pipelineId})
        }
      })
    }

    _actions.push({
      name: 'Delete',
      action: ({ id }) => {
        if(window.confirm('Realy delete?'))
          ctrlInvoker.destroyEntity({ model: 'PipelineJob', id })
      }
    })

    return _actions
  }, [appInvoker, navigate])

  return (
    <CrudContent
      title="Jobs"
      hint="Define production orders as jobs"
      type='job'
      actions={actions}
      dataDisplay={dataDisplay}
    />
  )
}

const Img = styled.img`
  background-color: ${({ theme: { palette: { primary } } }) => primary.lighter};
  border-radius: 4px;
  height: 32px;
`
