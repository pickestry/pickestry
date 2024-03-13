// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { appInvoker } from '../common/appInvoker.mjs'

export const SystemInfo = () => {

	const [info, setInfo] = React.useState({})

	React.useEffect(() => {
		appInvoker.systemInfo()
      .then(setInfo)
      .catch(console.log) // eslint-disable-line no-console
	}, [])

	return (
		<div title="System Information">
			<button onClick={() => {window.close()}}>Close</button>

			<pre>{ JSON.stringify(info, null, 2) }</pre>
		</div>
	)
}
