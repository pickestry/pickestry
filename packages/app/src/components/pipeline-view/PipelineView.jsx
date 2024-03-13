import * as React from 'react'
import { Panel } from '@pickestry/components'
import { Stages } from './stages/Stages'
import { usePage } from '../page/usePage.mjs'
import { Link } from '../page/index.mjs'
import { ctrlInvoker } from '../../common/ctrlInvoker.mjs'

export const PipelineView = () => {

  const { meta } = usePage()

  const [fetched, setFetched] = React.useState()

  const [refresh, setRefresh] = React.useState()

  const id = React.useMemo(()=> meta('id'), [])

  React.useEffect(() => {
    if(id) {
      ctrlInvoker.getEntity({
        model: 'Pipeline',
        id,
        include: {
          association: 'stages',
          include: { association: 'jobs' }
        },
        order: [['stages', 'jobs', 'rank', 'ASC']]
      })
      .then((pipeline) => {
        pipeline.stages.sort((a, b) => (a.position - b.position))
        setFetched(pipeline)
      })
    }
  }, [id, refresh])

  const onChangeJobPos = React.useCallback(({
    job,
    stage,
    rank
  }) => {
    ctrlInvoker.moveJob({
      job,
      stage,
      rank
    })
  }, [])

  React.useEffect(() => {
    function onEvent() {
      setRefresh(+new Date())
    }

    window.ipc.on('event', onEvent)

    return function cleanup() {
      window.ipc.off('event', onEvent)
    }
  }, [])

  if(!fetched) return <div>Loading...</div>

  return (
    <>
      <Link to="..">Back to Pipelines</Link>
      <Panel title={fetched.name}>

        {/*{ finalPipelineDeleteError && <Alert type="danger" message={finalPipelineDeleteError} /> }*/}
        {
          fetched.stages && (
            <Stages
              stages={fetched.stages}
              onChangeJobPos={onChangeJobPos}
            />
          )
        }
        {/*{ showAddTask && <StageForm onSubmit={(o) => {onStageAdd(o)}} onClose={() =>  setShowAddTask(false)} /> }*/}
        {/*<Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <Dialog.Header>Delete Pipeline</Dialog.Header>
          <Dialog.Body>
            <V>
              <V.Item>Delete pipeline {data.name}?</V.Item>
              <V.Item>
              <button onClick={() => {
                deletePipeline(id)
                setShowConfirm(false)
              }}>Delete</button>
              </V.Item>
            </V>
          </Dialog.Body>
        </Dialog>*/}
      </Panel>
    </>
  )
}
