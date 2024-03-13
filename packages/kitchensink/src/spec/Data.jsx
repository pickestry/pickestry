// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { Paginator } from '../../../components/src/Paginator'

export function Data() {

  const [page, setPage] = React.useState(1)

  return (
    <>
      <h1>Paginator</h1>

      <h5>Default Paginator</h5>
      <Paginator />

      <h5>With pages and items found</h5>
      <Paginator
        page={1}
        totalPages={10}
        totalItems={118}
      />

      <h5>Middle of navigation</h5>
      <Paginator
        page={2}
        totalPages={10}
        totalItems={118}
      />

      <h5>At the end</h5>
      <Paginator
        page={10}
        totalPages={10}
        totalItems={118}
      />

      <h5>Interactive</h5>
      <Paginator
        page={page}
        totalPages={10}
        totalItems={118}
        onRetrieveRequest={(v) => { setPage(v)}}
      />
    </>
  )
}
