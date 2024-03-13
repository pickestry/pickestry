// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import path from 'node:path'
import Debug from 'debug'
import { Sequelize } from 'sequelize'
import { DataTypes } from 'sequelize'
import { Op } from 'sequelize'
import { Umzug } from 'umzug'
import { SequelizeStorage } from 'umzug'
import { MigrationError } from 'umzug'
import { upperCamelCase } from 'case-anything'
import { set } from 'lodash-es'
import { enums } from '@pickestry/defs'
import { QueryAdaptor } from './QueryAdaptor.mjs'
// import { dataTypes as ALL_CUSTOM_DATA_TYPES } from './data-types/index.mjs'
import { lowerCase } from 'case-anything'
import { camelCase } from 'case-anything'

const log = Debug('pickestry:persist')

const MEMORY_STORAGE = ':memory:'

export class Persist {

  #initialized = false

  #models = {}

  #sequelize

  #migrator

  #seeder

  #dataDir

  async init({
    models = [],
    queries = [],
    deltas = [],
    seed = [],
    dataTypes = [],
    dataDir = MEMORY_STORAGE,
    dataLogging = false
  } = {}) {
    if(this.#initialized) return

    let storage
    if(dataDir === MEMORY_STORAGE) {
      this.#dataDir = MEMORY_STORAGE
      storage = MEMORY_STORAGE
    } else {
      this.#dataDir = path.resolve(dataDir, '.data')
      storage = path.join(this.#dataDir, 'all.db3')
    }

    log(`Using \`${storage}\` as db`)

    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage,
      define: {
        rejectOnEmpty: true,
        underscored: true
      },
      logging: dataLogging
    })

    this.#sequelize = sequelize

    // add custom data types
    dataTypes.forEach((v) => v())

    for(const v of models) {
      try {
        const model = v(sequelize, DataTypes, { enums })
        this.#models[model.name] = model

        log(`Model ${model.name} registered`)
      } catch(error) {
        log('Failed to register', error)
      }
    }

    for(const modelName of Object.keys(this.#models)) {
      if(this.#models[modelName].associate) {
        try {
          this.#models[modelName].associate(this.#models)
          log(`Succesfully run ${modelName} associate`)
        } catch(err) {
          log(`Failed to associate ${modelName}: %O`, err)
        }
      }
    }

    for(const modelName of Object.keys(this.#models)) {
      if(this.#models[modelName].setupHooks) {
        this.#models[modelName].setupHooks(this.#models)
        log(`Succesfully set up ${modelName} hooks`)
      }
    }

    // Mangle functions
    for(const modelName of Object.keys(this.#models)) {
      this.mangleProps(this.#models[modelName])
    }

    // Register queries
    log(`Availabe queries: ${queries?.length}`)
    for(const Query of queries) {
      const k = Query.NAME
      if(!k) {
        log('Warning: name required for query') // eslint-disable-line no-console
        continue
      }

      log(`Registering query ${k}`)
      const q = new Query(this.#sequelize)
      this[k] = q.run.bind(q)
    }

    // check connections
    try {
      await sequelize.authenticate()
    } catch(error) {
      log('Failed to initialize: ', error)

      throw new Error('err_data_init')
    }

    // init umzug
    log('setting up migrations...')
    this.#migrator = new Umzug({
      migrations: deltas,
      storage: new SequelizeStorage({ sequelize }),
      context: sequelize.getQueryInterface()
    })

    log('Successfully migrated')

    this.#seeder = new Umzug({
      migrations: seed,
      storage: new SequelizeStorage({
        sequelize,
        modelName: 'SeederMeta'
      }),
      context: sequelize.getQueryInterface()
    })

    this.#initialized = true

    log('Done data initialization')
  }

  mangleProps(model) {
    const { singular, plural } = model.options.name

    for(const prop of Object.getOwnPropertyNames(model.__proto__)) {

      const parts = lowerCase(prop).split(' ')

      let propName

      if(MANGLE_SINGLE.includes(prop)) {
        switch(prop) {
        case 'findByPk':
          propName = camelCase(`find ${lowerCase(singular)} by pk`)
          break
        default:
          lowerCase(singular).split(' ').forEach((v) => parts.push(v))
          propName = camelCase(parts.join(' '))
        }
      } else if(MANGE_PLURAL.includes(prop)) {
        lowerCase(plural).split(' ').forEach((v) => parts.push(v))
        propName = camelCase(parts.join(' '))
      }

      if(propName && !this[propName]) {
        this[propName] = model[prop].bind(model)
      }
    }
  }

  convert(q) {
    return QueryAdaptor.convert(q)
  }

  get initialized() {
    return this.#initialized
  }

  objectifyPaths(o) {
    const newO = {}
    for(const [k, v] of Object.entries(o)) {
      set(newO, k, v)
    }

    return newO
  }

  errorDetails(error) {
    return error.toString()
  }

  async seed() {
    log('Attempt to seed database...')

    try {
      await this.#seeder.up()
    } catch (e) {
      console.log('Seeding failed: ', e) // eslint-disable-line no-console
      if (e instanceof MigrationError) {
        const original = e.cause
        // do something with the original error here
        console.log('Seeding error: ', original) // eslint-disable-line no-console
      }

      throw e
    }
  }

  async withinTx(cb) {
    return await this.#sequelize.transaction(cb)
  }

  getModel(model) {
    return this.#models[upperCamelCase(model)]
  }

  async up() {
    try {
      await this.#migrator.up()
    } catch (e) {
      console.log('Migration failed: ', e) // eslint-disable-line no-console
      if (e instanceof MigrationError) {
        const original = e.cause
        // do something with the original error here
        console.log('Migration error: ', original) // eslint-disable-line no-console
      }

      throw e
    }
  }

  async sync() {
    // check connections
    try {
      await this.#sequelize.sync()
    } catch(error) {
      log('Failed to sync: ', error)

      throw new Error('err_data_init')
    }
  }

  async close() {
    await this.#sequelize.close()

    log('Successfully closed sequelize')

    return Promise.resolve()
  }

  get dataDir() {
    return this.#dataDir
  }

  get models() {
    return this.#models
  }

  get Op() {
    return Op
  }
}

const MANGLE_SINGLE = [
  'findByPk',
  'findOne',
  'findOrCreate',
  'build',
  'create',
  'upsert',
  'restore',
  'update',
  'destroy',
  'increment',
  'decrement'
]

const MANGE_PLURAL = [
  'findAll',
  'count',
  'bulkBuild',
  'bulkCreate',
  'truncate'
]
