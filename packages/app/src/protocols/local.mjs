import path from 'node:path'
import { createLogger } from '@pickestry/core'

const log = createLogger('pickestry:app')

// const __dirname = import.meta.dirname

export const localFile = async (request, cb) => {

    log('handling requested url: %s', request.url)

    const reqUrl = new URL(request.url)

    const filePath = path.resolve(__dirname, '..', 'renderer', reqUrl.pathname.substring(1))

    log('loading: %s', filePath)

    let mimeType
    switch(path.extname(reqUrl.pathname)) {
    case '.js': mimeType = 'text/javascript'; break
    default: mimeType = 'text/html'
    }

    const res = {
        mimeType,
        path: filePath,
        charset: 'utf-8',
        statusCode: 200
    }

    cb(res)
}

