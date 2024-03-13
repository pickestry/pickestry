import * as React from 'react'
import styled from 'styled-components'
import { isEmpty } from 'lodash-es'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { schema } from '@pickestry/defs'
import { H } from '@pickestry/components'
import { Panel } from '@pickestry/components'
import { Label } from '@pickestry/components'
import { FilterPanel } from '@pickestry/components'
import { Switch } from '@pickestry/components'
import { appInvoker } from '../../common/appInvoker.mjs'
import { ctrlInvoker } from '../../common/ctrlInvoker.mjs'
import { usePage } from '../page/usePage.mjs'
import { JobLine } from './JobLine.jsx'
import { NotFound } from '../NotFound'
import { produce } from 'immer'
import * as c from '../../c.mjs'
import CreatedSVG from 'assets/created.svg'
import StartedSVG from 'assets/started.svg'
import WorkingSVG from 'assets/working.svg'
import DoneSVG from 'assets/done.svg'

export const JobsView = () => {

  const { getItem, setItem } = usePage()

  const [data, setData] = React.useState([])

  const [query, setQueryState] = React.useState(getItem('query') || {})

  const [refresh, setRefresh] = React.useState(0)

  const [shouldShowRemoved, showRemoved] = React.useState(false)

  const [state, setState] = React.useState('init') // init, fetching, done

  const getCollection = React.useCallback(() => {
    setState('fetching')

    const finalQuery = produce(query, (draft) => {
      if(shouldShowRemoved) {
        delete draft.rank
        draft.rank = { eq: null }
      }
    })

    ctrlInvoker.getJobs({ query: finalQuery })
      .then(({data}) => {
        // order by status
        // created = 0
        // started = 1
        // working = 2
        // incident = 3
        // done = 4
        function mapToRank(status) {
          switch(status) {
            case 'created': return 0
            case 'started': return 1
            case 'working': return 2
            case 'incident': return 3
            default: return 4
          }
        }
        data.sort(({ status: statusB }, { status: statusA } ) => {
          return (mapToRank(statusB) - mapToRank(statusA))
        })

        setData(data)
      })
      .finally(() => { setState('done') })
  }, [query, shouldShowRemoved])

  React.useEffect(() => {
    getCollection()
  }, [getCollection, refresh, query])

  React.useEffect(() => {
    function onEvent() {
      setRefresh(+new Date())
    }

    window.ipc.on('event', onEvent)

    return function cleanup() {
      window.ipc.off('event', onEvent)
    }
  }, [])

  const setQuery = React.useCallback((v) => {
    setItem('query', v)
    setQueryState(v)
  }, [setItem, setQueryState])

  const queryChanged = React.useCallback((q = {}) => {
    setQuery(q)
  }, [])

  return (
    <Panel title="Jobs" actions={[{name: 'Create Job', action: () => { appInvoker.showDialog(c.DLG_JOB_CREATE) } }]}>
      <FilterPanel
        defs={schema.getFilterItems('job')}
        onQuery={queryChanged}
        defaultQuery={query} />
      <Root>
        <SupportFilter>
          <H.Item>
            <Label>Show Removed</Label>
          </H.Item>
          <H.Item>
            <Switch name="shouldshowRemoved" onChange={showRemoved} checked={shouldShowRemoved} />
          </H.Item>
        </SupportFilter>
        <DndProvider backend={HTML5Backend}>
        {
          (state === 'init' || !isEmpty(data)) ?
          (
            <>
              <List>
                {
                  data.map((job) => {
                    return <JobLine key={job.refNum} job={job} />
                  })
                }
              </List>
            </>
          ) : (<NotFound />)
        }
        </DndProvider>
      </Root>
    </Panel>
  )
}

const Root = styled.div`
`

const List = styled.ul`
`

const SupportFilter = styled(H)`
  padding: 7px 10px 0px 10px;
  justify-content: end;
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
