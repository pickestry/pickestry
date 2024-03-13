import * as React from 'react'
import styled from 'styled-components'
import { Frame } from '@pickestry/components'
import { cssHover } from '@pickestry/components'
import { cssNoSelect } from '@pickestry/components'
import { ContextMenu } from '@pickestry/components'
import { Muted } from '@pickestry/components'
import { useDrag } from 'react-dnd'
import { get } from 'lodash-es'
import { utils } from '@pickestry/utils'
import { dates } from '@pickestry/utils'
import IncidentSVG from 'assets/incident.svg'
import CreatedSVG from 'assets/created.svg'
import StartedSVG from 'assets/started.svg'
import WorkingSVG from 'assets/working.svg'
import DoneSVG from 'assets/done.svg'
import { appInvoker } from '../../common/appInvoker.mjs'
import { ctrlInvoker } from '../../common/ctrlInvoker.mjs'
import { usePage } from '../page/usePage.mjs'
import * as c from '../../c.mjs'

export const JobLine = ({ job }) => {

  const { navigate } = usePage()

  const statusDisplay = React.useCallback((status) => {
    switch(status) {
    case 'created': {
      return <JobIcon title="Job created" ><CreatedIcon /></JobIcon>
    }
    case 'incident': {
      return <JobIcon title={`${job.incidentDate} - ${job.incidentNote}`}><IncidentSVG /></JobIcon>
    }
    case 'started': {
      return <JobIcon title={`Job assigned to ${get(job, 'PipelineStage.Pipeline.name', 'pipeline')} and is ready to go`} ><StartedIcon /></JobIcon>
    }
    case 'done': {
      return <JobIcon title="Job is finished" ><DoneIcon /></JobIcon>
    }
    default:
      return <JobIcon title="In progress..."><WorkingIcon /></JobIcon>
    }
  }, [])

  const showView = React.useCallback(() => {
    const pipelineId = get(job, 'PipelineStage.PipelineId', get(job, 'PipelineId'))
    if(pipelineId)
      navigate('make.pipelines.view', {id: pipelineId})
  }, [job])

  const showViewOrAssign = React.useCallback(() => {
    const pipelineId = get(job, 'PipelineStage.PipelineId', get(job, 'PipelineId'))
    if(pipelineId)
      navigate('make.pipelines.view', {id: pipelineId})
    else
      appInvoker.showDialog(c.DLG_JOB_ASSIGN, { id: job.id })
  }, [job])

  const doPrimary = React.useCallback((e) => {
    if(e.target.classList.contains('lem')) {
      showViewOrAssign()
    } else {
      e.stopPropagation()
    }
  }, [showView])

  const menuItems = React.useMemo(() => {
    const arr = []

    if(!job.PipelineId && !job.PipelineStage) {
      arr.push({
        name: 'Assign to Pipeline',
        action: () => {
          appInvoker.showDialog(c.DLG_JOB_ASSIGN, { id: job.id })
        }
      })
    } else {
      arr.push({
        name: 'View',
        action: showView
      })
    }

    arr.push({
      name: 'Remove',
      action: () => {
        if(window.confirm(`Remove job ${job.refNum}?`))
          ctrlInvoker.removeJob({ id: job.id })
      }
    })

    if(job.barcode) {
      arr.push({
        name: 'Barcodes',
        action: () => {
          appInvoker.showDialog(c.DLG_EXPORT_BARCODES, {
            barcode: job.barcode,
            barcodeCount: job.barcodeCount
          })
        }
      })
    }

    return arr
  }, [appInvoker, navigate, job])

  const showingRemoved = React.useMemo(() => {
    return job.rank === null
  }, [job])

  // dnd
  const [dragProps,, dragPreviewRef] = useDrag(() => {
    return {
      type: 'job',
      item: {
        id: job.id,
        status: job.status
      },
      collect: (monitor) => {
        // console.log('[mon] ------------------------- [mon]')
        // console.log('[mon]       item: ', monitor.getItem())
        // console.log('[mon]  item type: ', monitor.getItemType())
        // console.log('[mon] isDragging: ', monitor.isDragging())
        // console.log('[mon]    didDrop: ', monitor.didDrop())
        // -- OR ---
        // console.table([{
        //   item: monitor.getItem(),
        //   itemType: monitor.getItemType(),
        //   isDragging: monitor.isDragging(),
        //   didDrop: monitor.didDrop()
        // }])
        return {
          isDragging: monitor.isDragging(),
          canDrag: monitor.canDrag()
        }
      },
      options: {
        dropEffect: 'move'
      }
    }
  })

  const jobReady = React.useMemo(() => {
    return (job.status === 'created') || (job.status === 'started')
  }, [])

  return (
    <Root onClick={showingRemoved ? () => {} : doPrimary} title={utils.devOnly(job)} $showingRemoved={showingRemoved}>
      <RootDragPreview $isDragging={dragProps.isDragging} ref={dragPreviewRef}>
{/*       <DragPoint ref={dragRef}>
          <GripVerticalIcon />
        </DragPoint>*/}

        <Ref>{job.refNum}</Ref>
        <Name>{job.name}</Name>
        <Progress>
        {
          jobReady && job.start && <>Start: {dates.display(job.start)} <span> • </span></>
        }
        {
          (job.status === 'created') ? `Planned Qty: ${job.plannedQty} items` : `Finished ${job.progressCounter} out of ${job.plannedQty} items`
        }
        </Progress>
        <Status>{statusDisplay(job.status)}</Status>
        <Actions>
          { !showingRemoved && <ContextMenu entries={menuItems} /> }
        </Actions>
      </RootDragPreview>
    </Root>
  )
}

const Root = styled(Frame).attrs({
    as: 'li',
    className: 'lem'
  })`
  position: relative;
  padding: 8px 4px;
  height: 50px;
  ${({$showingRemoved }) => !$showingRemoved && cssHover}
  margin: 12px 0px;

  & .actions {
    visibility: hidden;
  }

  &:hover .actions {
    visibility: visible;
  }
`

const JobIcon = styled.div`
  border-radius: 4px;
  height: 32px;

  & > svg {
    width: 32px;
    height: 32px;
  }
`

export const CreatedIcon = styled(CreatedSVG)`
  fill: #eee;
  stroke: ${({theme: { palette: {primary}}}) => primary.main};
`

export const StartedIcon = styled(StartedSVG)`
  fill: #eee;
  stroke: ${({theme: { palette: {primary}}}) => primary.main};
`

export const WorkingIcon = styled(WorkingSVG)`
  fill: #eee;
  stroke: ${({theme: { palette: {primary}}}) => primary.main};
`

export const DoneIcon = styled(DoneSVG)`
  fill: #eee;
  stroke: ${({theme: { palette: {primary}}}) => primary.main};
`

export const IncidentIcon = styled(IncidentSVG)`
  fill: yellow;
  stroke: ${({theme: { palette: {danger}}}) => danger.main};
`

const RootDragPreview = styled.div`
  margin-right: 8px;
  opacity: ${({$isDragging}) => $isDragging ? 0.5 : 1};

  & + & {
    margin-top: 4px;
  }
`

const Ref = styled.div.attrs({ className: 'lem' })`
  position: absolute;
  left: 8px;
  top: 7px;
`

const Name = styled.div.attrs({ className: 'lem' })`
  position: absolute;
  left: 8px;
  top: 27px;
`

const Progress = styled(Muted).attrs({ className: 'lem' })`
  position: absolute;
  right: 82px;
  top: 19px;

  ${cssNoSelect}
`

const Status = styled.div.attrs({ className: 'lem' })`
  position: absolute;
  right: 40px;
  top: 8px;
`

const Actions = styled.div.attrs({ className: 'actions' })`
  position: absolute;
  right: 7px;
  top: 12px;
`
