// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Persist } from './Persist.mjs'
import { queries } from './queries/index.mjs'
import { models } from './models/index.mjs'
import { deltas } from './deltas/index.mjs'
import { seed } from './seed/index.mjs'

export const createPersistCustom = async ({
  models = [],
  queries = [],
  deltas = [],
  seed = [],
  dataDir,
  dataLogging
}) => {
  const persist = new Persist()

  await persist.init({
    models,
    queries,
    deltas,
    seed,
    dataDir,
    dataLogging
  })

  await persist.up()

  return persist
}

export const createPersist = async ({
  dataDir,
  dataLogging }) => {

  return await createPersistCustom({
    models,
    queries,
    deltas,
    seed,
    dataDir,
    dataLogging
  })
}

export {
  Persist,
  queries,
  models,
  deltas,
  seed
}
