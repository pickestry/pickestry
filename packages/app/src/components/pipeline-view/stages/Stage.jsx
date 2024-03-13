import * as React from 'react'
import styled from 'styled-components'
import { get } from 'lodash-es'
import { Job } from './Job.jsx'
import { JobDropTarget } from './JobDropTarget.jsx'
import { utils } from '@pickestry/utils'

export const Stage = ({
    stage,
    onChangeJobPos
  }) => {

  const lastId = React.useRef()

  const jobs = React.useMemo(() => {
    const arr = get(stage, 'jobs', [])

    return utils.sortJobs(arr)
  }, [stage])

  return (
    <Root data-testid="pipeline-stage" id="stage">
      <span title={`${utils.devOnly(stage)}`}>{get(stage, 'name')}</span>
      {
        (jobs.length !== 0) ? (
          <JobContainer>
            {
              jobs.map((o, idx) => {
                const arr = []
                arr.push(<JobDropTarget key="first" stage={stage.id} rank={o.rank} onChangeJobPos={onChangeJobPos} />)
                arr.push(<Job key={idx} job={o} />)

                lastId.current = o.id

                return arr
              })
            }
            <JobDropTarget key="last" stage={stage.id} onChangeJobPos={onChangeJobPos} />
          </JobContainer>
        ) : (
          <JobDropTarget key="init" stage={stage.id} onChangeJobPos={onChangeJobPos} />
        )
      }
    </Root>
  )
}

const Root = styled.div`
  border-radius: 4px;
  width: 350px;
  background: #efefef;
  padding: 4px;
  min-height: 250px;
  min-width: 150px;
  overflow-x: auto;

  & + & {
    margin-left: 8px;
  }
`

const JobContainer = styled.div`
  display: flex;
  flex-flow: column;
  margin: 8px 4px;
`
