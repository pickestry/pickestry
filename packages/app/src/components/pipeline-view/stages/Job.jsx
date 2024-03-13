import * as React from 'react'
import styled from 'styled-components'
import { cssHover } from '@pickestry/components'
import { cssPointer } from '@pickestry/components'
import { cssNoSelect } from '@pickestry/components'
import { ContextMenu } from '@pickestry/components'
import { CircleMark } from '@pickestry/components'
import { useDrag } from 'react-dnd'
import { get } from 'lodash-es'
import { dragTypes } from './dragTypes.mjs'
import GripVerticalIcon from 'assets/grip-vertical.svg'
import { utils } from '@pickestry/utils'
import { ctrlInvoker } from '../../../common/ctrlInvoker.mjs'
import MoreSvg from 'assets/more-vertical.svg'
import FileTextSvg from 'assets/file-text.svg'
import { appInvoker } from '../../../common/appInvoker.mjs'
import * as c from '../../../c.mjs'

export const Job = ({ job }) => {

  const [{ isDragging }, dragRef, dragPreviewRef] = useDrag(() => {
    return {
      type: dragTypes.JOB,
      item: {
        id: job.id,
        rank: job.rank,
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
          isDragging: monitor.isDragging()
        }
      },
      options: {
        dropEffect: 'move'
      }
    }
  })

  const progress = React.useMemo(() => `${get(job, 'progressCounter', '-')} /  ${get(job, 'plannedQty', '-')}`, [job])

  return (
    <RootDragPreview $isDragging={isDragging} ref={dragPreviewRef}>
      <Root title={utils.devOnly(job)}>
        <DragPoint ref={dragRef}>
          <GripIcon />
          <CircleMark $code={job.id}/>
        </DragPoint>
        <JobContainer>
          <Label>{ get(job, 'refNum') }</Label>
            { job.notes && <StyledFileTextSvg onClick={ () => { appInvoker.showDialog(c.DLG_ADD_JOB_NOTE, { id: job.id }) } } /> }
          <Details title={get(job, 'name', '-')}>
            { get(job, 'name', '-') }
          </Details>
          <ProgressDisplay title={`Progress: ${progress}`} onClick={() => {
            ctrlInvoker.bumpJobCounter({
              id: job.id,
              multi: job.barcodeMulti
            }) }} >
            { progress }
          </ProgressDisplay>
          <Actions>
            <ContextMenu
              element={<StyledMoreIcon />}
              entries={[{
                name: 'Notes',
                action: () => { appInvoker.showDialog(c.DLG_ADD_JOB_NOTE, { id: job.id }) }
              }, {
                name: 'Incident',
                action: () => { appInvoker.showDialog(c.DLG_SET_INCIDENT, { id: job.id }) }
              }]} />
          </Actions>
        </JobContainer>
      </Root>
    </RootDragPreview>
  )
}

const Root = styled.div`
  display: flex;
  width: 100%;
  background: white;
  border-radius: 4px;
  padding: 4px 24px 4px 4px;
`

const RootDragPreview = styled.div`
  margin-right: 8px;
  opacity: ${({$isDragging}) => $isDragging ? 0.5 : 1};

  & + & {
    margin-top: 4px;
  }
`

const DragPoint = styled.div`
  margin: 2px 8px 2px 2px;

  > svg {
    color: grey;
    height: 1em;
  }
`

const JobContainer = styled.div`
  width: 100%;
  height: 40px;
  position: relative;
  justify-content: space-between;
  padding: 2px;
  align-content: center;
  align-items: center;
`

const Label = styled.div`
  position: absolute;
  left: 0;
  top: 3px;
  user-select: none;
`

const Details = styled.div`
  position: absolute;
  top: 24px;
  left: 0;
  right: 40px;
  bottom: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${cssNoSelect}
`

const Actions = styled.div`
  position: absolute;
  top: 9px;
  right: -24px;
`

const ProgressDisplay = styled.div`
  position: absolute;
  top: 10px;
  right: 0;
  user-select: none;
  padding: 4px;
  border-radius: 4px;
  ${cssHover}
`

const GripIcon = styled(GripVerticalIcon)`
  fill: #eee;
  stroke: ${({theme: { palette: {primary}}}) => primary.main};
`
const StyledMoreIcon = styled(MoreSvg)`
  fill: #eee;
  stroke: ${({theme: { palette: {primary}}}) => primary.main};
`

const StyledFileTextSvg = styled(FileTextSvg)`
  fill: #eee;
  stroke: ${({theme: { palette: {primary}}}) => primary.main};
  position: absolute;
  left: 75px;
  width: 15px;
  height: auto;

  ${cssPointer}
`
