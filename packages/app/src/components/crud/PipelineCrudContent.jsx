import * as React from 'react'
import { CrudContent } from './index.mjs'
import { appInvoker } from '../../common/appInvoker.mjs'
import { ctrlInvoker } from '../../common/ctrlInvoker.mjs'
import { usePage } from '../page/usePage.mjs'
import { schema } from '@pickestry/defs'

export const PipelineCrudContent = () => {

  const { navigate } = usePage()

  React.useEffect(() => {
  // init defs
    schema.setEntitySearch('Pipeline', 'location', (v) => {
      return new Promise((resolve, reject) => {
        ctrlInvoker.getCollection({
          model: 'Location',
          offset: 0,
          limit: 5,
          query: {
            name: { includes: v },
            type: { eq: 'shop-floor' }
          }
        }).then(({ data }) => {
          resolve(data)
        }).catch(reject)
      })
    })
  }, [])

  return (
    <CrudContent
      type='pipeline'
      hint="Production lines, shop floors"
      actions={[
        {
          name: 'Edit',
          action: ({ id }) => { appInvoker.showDialog('pipeline-update', {id}) }
        }, {
          name: 'Delete',
          action: ({ id }) => {
            if(window.confirm('Realy delete?'))
              ctrlInvoker.destroyPipeline({ id })
          }
        }, {
          name: 'View',
          action: ({ id }) => { navigate('make.pipelines.view', {id}) },
          primary: true
        }]
      }
    />
  )
}
