// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Sequelize } from 'sequelize'

export default {

  name: '0000000000-init',

  up: async ({ context: q }) => {

    // Location
    await q.createTable('locations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.STRING,
      address: Sequelize.TEXT,
      type: Sequelize.STRING(10),
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    })

    // Channels
    await q.createTable('channels', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      type: Sequelize.STRING(10),
      intent: Sequelize.STRING(10),
      location_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locations',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    })

    await q.addIndex('channels', ['location_id', 'type', 'intent'], { unique: true })

    await q.sequelize.models.Channel.bulkCreate([{
      type: 'inventory',
      intent: 'in'
    }, {
      type: 'inventory',
      intent: 'out'
    }, {type: 'production'}])

    // Counters
    await q.createTable('counters', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      type: Sequelize.STRING(10),
      counter: Sequelize.INTEGER
    })

    // Customers
    await q.createTable('customers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      phone: Sequelize.STRING,
      address: Sequelize.TEXT,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    })

    // Devices
    await q.createTable('devices', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      mid: Sequelize.STRING,
      channel_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'channels',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'restrict'
      }
    })

    // Barcodes
    await q.createTable('barcodes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      value: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      package_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'packages',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    })

    await q.addIndex('barcodes', ['value'], {unique: true})

    // Products
    await q.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.STRING,
      sku: Sequelize.STRING,
      can_be_sold: Sequelize.BOOLEAN,
      price: Sequelize.INTEGER,
      can_be_bought: Sequelize.BOOLEAN,
      cost: Sequelize.INTEGER,
      currency: Sequelize.TEXT,
      options: Sequelize.JSON,
      variant: Sequelize.JSON,
      product_picture: Sequelize.ABSTRACT,
      unit: Sequelize.TEXT,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      parent_product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'set null'
      }
    })

    await q.addIndex('products', ['variant'], {unique: true})

    await q.createTable('inventory_items', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      count: Sequelize.INTEGER,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      location_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locations',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'restrict'
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'restrict'
      }
    })

    await q.createTable('inventory_txes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      count: Sequelize.INTEGER,
      type: Sequelize.STRING(10),
      created_at: Sequelize.DATE,
      location_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locations',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'restrict'
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'restrict'
      },
      inventory_item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'inventory_items',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'set null'
      }
    })

    await q.createTable('packages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    })

    await q.createTable('package_products', {
      count: Sequelize.INTEGER,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      package_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'packages',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      product_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    })

    await q.createTable('pipelines', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      location_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'locations',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    })

    await q.createTable('pipeline_stages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.STRING,
      position: Sequelize.SMALLINT,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      pipeline_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'pipelines',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    })

    await q.createTable('pipeline_jobs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.STRING,
      rank: Sequelize.INTEGER,
      ref_num: Sequelize.STRING,
      incident: Sequelize.BOOLEAN,
      incident_note: Sequelize.TEXT,
      incident_date: Sequelize.DATE,
      progress_counter: Sequelize.INTEGER,
      planned_qty: Sequelize.INTEGER,
      start: Sequelize.DATE,
      notes: Sequelize.TEXT,
      barcode: Sequelize.TEXT,
      barcode_count: Sequelize.INTEGER,
      barcode_multi: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      status: {
        type: Sequelize.TEXT,
        defaultValue: 'created'
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      pipeline_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'pipelines',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'set null'
      },
      pipeline_stage_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'pipeline_stages',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'restrict'
      },
      package_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'packages',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'set null'
      },
      product_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'set null'
      }
    })

    await q.addIndex('pipeline_jobs', ['ref_num'])

    await q.createTable('product_parts', {
      qty: Sequelize.INTEGER,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      product_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      part_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    })

    await q.createTable('suppliers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      phone: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE
    })

    await q.createTable('purchase_orders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ref_num: Sequelize.STRING,
      shipping_address: Sequelize.TEXT,
      status: {
        type: Sequelize.TEXT,
        defaultValue: 'created'
      },
      notes: Sequelize.TEXT,
      currency: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      supplier_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'suppliers',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'set null'
      }
    })

    await q.createTable('purchase_order_items', {
      qty: Sequelize.INTEGER,
      amount: Sequelize.INTEGER,
      tax: Sequelize.JSON,
      currency: Sequelize.STRING,
      total: Sequelize.INTEGER,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      purchase_order_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'purchase_orders',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      product_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    })

    await q.addIndex('purchase_order_items', ['purchase_order_id', 'product_id'])

    await q.createTable('sales_orders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      ref_num: Sequelize.STRING,
      shipping_address: Sequelize.STRING,
      status: {
        type: Sequelize.TEXT,
        defaultValue: 'created'
      },
      currency: Sequelize.TEXT,
      notes: Sequelize.TEXT,
      discounts: Sequelize.JSON,
      shipping: Sequelize.JSON,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'customers',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'set null'
      }
    })

    await q.createTable('sales_order_items', {
      qty: Sequelize.INTEGER,
      amount: Sequelize.INTEGER,
      total: Sequelize.INTEGER,
      tax: Sequelize.JSON,
      currency: Sequelize.TEXT,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      sales_order_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'sales_orders',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      product_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'products',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    })

    await q.addIndex('sales_order_items', ['sales_order_id', 'product_id'])

    // Report
    await q.createTable('reports', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      type: Sequelize.TEXT,
      name: Sequelize.STRING,
      query: Sequelize.JSON,
      meta: Sequelize.JSON,
      created_at: Sequelize.DATE
    })

    // Report :: Sales Tax
    await q.createTable('report_sales_taxes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tax: Sequelize.JSON,
      running: Sequelize.INTEGER,
      currency: Sequelize.STRING,
      created_at: Sequelize.DATE,
      report_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'reports',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      sales_order_id: {
        type: Sequelize.NUMBER,
        references: {
          model: 'sales_orders',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    })

    // Total inventory items
    await q.sequelize.query(`
      CREATE VIEW IF NOT EXISTS inventory_totals (id, on_hand) AS
        SELECT ii.product_id as product_id, sum(ii.count) as on_hande FROM inventory_items AS ii
          GROUP BY product_id;
    `)

    // Total products in pending sales orders
    await q.sequelize.query(`
      CREATE VIEW IF NOT EXISTS sales_order_totals (id, name, selling) AS
        SELECT p.id as product_id, p.name as product_name, sum(soi.qty) as selling FROM sales_order_items AS soi
          LEFT JOIN products AS p ON soi.product_id = p.id
          LEFT JOIN sales_orders AS so ON soi.sales_order_id = so.id
            WHERE so.status IN ('created', 'preparing', 'prepared')
              GROUP BY product_id;
      `
    )

    // Total products in pending purchase orders
    await q.sequelize.query(`
      CREATE VIEW IF NOT EXISTS purchase_order_totals (id, name, receiving) AS
        SELECT p.id as product_id, p.name as product_name, sum(poi.qty) as receiving FROM purchase_order_items AS poi
          LEFT JOIN products AS p ON poi.product_id = p.id
          LEFT JOIN purchase_orders AS po ON poi.purchase_order_id = po.id
            WHERE po.status IN ('created', 'sent')
              GROUP BY product_id;
      `
    )

    // Total in jobs
    await q.sequelize.query(`
      CREATE VIEW IF NOT EXISTS job_totals (id, name, planned, ready) AS
        SELECT p.id as product_id, p.name as product_name, sum(job.planned_qty) as planned, sum(job.progress_counter) as ready FROM pipeline_jobs as job
          LEFT JOIN products AS p ON job.product_id = p.id
            WHERE job.rank IS NOT NULL AND job.status NOT IN ('incident')
              GROUP BY product_id;
    `)

    // Totals Overview
    await q.sequelize.query(`
      CREATE VIEW IF NOT EXISTS totals_overview (id, name, unit, on_hand, selling, receiving, planned, ready) AS
        SELECT p.id as id, p.name as name, p.unit as unit, invi.on_hand as on_hand, selling, receiving, planned, ready FROM products AS p
          LEFT JOIN inventory_totals AS invi ON invi.id = p.id
          LEFT JOIN purchase_order_totals AS po ON p.id = po.id
          LEFT JOIN sales_order_totals AS so ON p.id = so.id
          LEFT JOIN job_totals AS job ON job.id = p.id
            WHERE on_hand IS NOT NULL
              OR selling IS NOT NULL
              OR receiving IS NOT NULL
              OR planned IS NOT NULL
    `)
  },

  down: async ({ context: q }) => {
    await q.drop()
  }

}
