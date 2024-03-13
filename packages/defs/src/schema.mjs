// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { get } from 'lodash-es'
import { has } from 'lodash-es'
import { set } from 'lodash-es'
import { schemaDef } from './schema_def.mjs'
import { produce } from 'immer'

class Schema {

  schema = {}

  constructor() {
    for(const [k, v] of Object.entries(schemaDef)) {
      this.schema[k] = v
    }
  }

  getModel(type) {
    return get(this.schema, [type, 'model'])
  }

  getColDef(type) {
    return get(this.schema, [type, 'colDef'])
  }

  getPlural(type) {
    return get(this.schema, [type, 'plural'])
  }

  getDescription(type) {
    return get(this.schema, [type, 'description'])
  }

  getInclude(type) {
    return get(this.schema, [type, 'include'])
  }

  hasFilter(type) {
    return has(this.schema, [type, 'filter'])
  }

  getFilterItems(type) {
    return get(this.schema, [type, 'filter', 'items'])
  }

  getPage(type) {
    return get(this.schema, [type, 'page'])
  }

  getTableDataDisplay(type) {
    return get(this.schema, [type, 'tableDataDisplay'])
  }

  getActions(type) {
    return get(this.schema, [type, 'actions'])
  }

  getPDFDefs(type, layout = 'a4p') {
    return get(this.schema, [type, 'pdf', layout, 'defs'], [])
  }

  getPath(model, name) {
    const item = Object.values(this.schema).find((def) => def.model == model)

    const items = get(item, 'filter.items', [])

    const found =  items.find((def) => def.name == name)

    return found?.path || name
  }

  has(type) {
    return has(this.schema, type)
  }

  setEntitySearch(model, filterName, cb) {
    const defIdx = Object.values(this.schema).findIndex((def) => def.model == model)
    const defName = Object.keys(this.schema)[defIdx]

    const items = get(this.findByModel(model), 'filter.items', [])

    const filterIdx =  items.findIndex((def) => def.name == filterName)

    if(filterIdx > -1) {
      this.schema = produce(this.schema, (draft) => {
        set(draft, [defName, 'filter', 'items', filterIdx, 'entitySearch'], cb)
      })
    }
  }

  filterIsEntity(model, filterName) {
    const items = get(this.findByModel(model), 'filter.items', [])

    const found = items.find((def) => def.name == filterName)

    if(found) return found.type === 'entity-enum'

    return false
  }

  findByModel(model) {
    return Object.values(this.schema).find((def) => def.model == model)
  }

  findTypeByModel(model) {
    let found

    for(const [k, v] of Object.entries(this.schema)) {
      if(v.model == model) {
        found = k
        break
      }
    }

    return found
  }
}

export const schema = new Schema()
