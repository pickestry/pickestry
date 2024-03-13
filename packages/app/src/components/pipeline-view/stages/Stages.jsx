import * as React from 'react'
import styled from 'styled-components'
import { H } from '@pickestry/components'
import { Stage } from './Stage.jsx'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export const Stages = ({
    stages,
    onChangeJobPos
  }) => {

  return (
    <DndProvider backend={HTML5Backend}>
      <StageContainer $justifyContent="flex-start">
        {
          stages.sort((a, b) => a.position < b.position).map((o) => {
            return <Stage key={o.position}
                      stage={o}
                      onChangeJobPos={onChangeJobPos} />
          })
        }
      </StageContainer>
    </DndProvider>
  )
}

const StageContainer = styled(H)`
  display: flex;
  justify-content: flex-start;
  overflow-x: auto;
  padding-bottom: 8px;
`
