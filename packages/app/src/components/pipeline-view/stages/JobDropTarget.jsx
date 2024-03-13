import * as React from 'react'
import styled from 'styled-components'
import { useDrop } from 'react-dnd'
import { dragTypes } from './dragTypes.mjs'
import { clsx } from 'clsx'

export const JobDropTarget = ({ stage, rank, onChangeJobPos }) => {

  const [dropProps, ref] = useDrop(() => {
    return {
      accept: [dragTypes.JOB],
      collect: (monitor) => ({
        highlight: monitor.isOver(),
        dropped: monitor.canDrop(),
        stage,
        rank
      }),
      drop: (item, monitor) => { //eslint-disable-line no-unused-vars
        // console.log('->', item, `${monitor.getItemType()}, ${monitor.didDrop()}, isOver: ${monitor.isOver()}`, monitor.getDropResult())
        onChangeJobPos({
          job: item.id,
          stage,
          rank
        })
      },
      canDrop: (item) => { //eslint-disable-line no-unused-vars
        return true
      }
    }
  }, [onChangeJobPos, stage])

  const highlight = React.useMemo(() => {
    return dropProps.highlight && dropProps.dropped
  }, [dropProps.highlight, dropProps.dropped])

  const dropped = React.useMemo(() => {
    if(highlight) return false

    return dropProps.dropped
  }, [highlight, dropProps.dropped])

  return (
    <DropDiv className={clsx({highlight, dropped})} ref={ref}></DropDiv>
  )
}

const DropDiv = styled.div`
  margin: 4px 0;
  background: inherit;
  border-radius: 4px;
  height: 4px;

  &.highlight {
    background: ${({theme: { palette: { highlight }}}) => highlight};
    height: 24px;
  }

  //  &.dropped {
  //   background: ${({theme: { palette: { primary }}}) => primary.light};
  //   height: 24px;
  // }
`
