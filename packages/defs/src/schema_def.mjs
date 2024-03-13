// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { displayAmount } from '@pickestry/utils'
import { dates } from '@pickestry/utils'
import { get } from 'lodash-es'
import { enums } from './enums.mjs'

export const schemaDef = {
  customer: {
    model: 'Customer',
    plural: 'Customers',
    page: 'sales.customers',
    colDef: [
    {
      name: 'name',
      displayName: 'Name',
      type: 'text'
    }, {
      name: 'email',
      displayName: 'Email',
      type: 'text'
    }],
    filter: {
      items: [
        {
          name: 'name',
          label: 'Name',
          path: 'name',
          type: 'string',
          hint: 'Filter by product\'s name',
          ops: ['includes']
        }, {
          name: 'email',
          label: 'Email',
          path: 'email',
          type: 'string',
          hint: 'Filter by email',
          ops: ['eq'],
          place_after: 'name'
        }
      ]
    },
    pdf: {
      'a4p': {
        defs: [{
          name: 'name',
          label: 'Name',
          width: '200'
        }, {
          name: 'email',
          label: 'Email',
          width: '140'
        }]
      }
    }
  },
  product: {
    model: 'Product',
    plural: 'Products',
    page: 'products.products',
    colDef: [{
      name: 'name',
      displayName: 'Name',
      type: 'text'
    }, {
      name: 'sku',
      displayName: 'SKU',
      type: 'text',
      width: '140px'
    }, {
      name: 'Barcode.value',
      displayName: 'Barcode',
      type: 'text',
      width: '140px'
    }, {
      name: 'price',
      displayName: 'Price',
      type: 'currency',
      width: '80px'
    }, {
      name: 'cost',
      displayName: 'Cost',
      type: 'currency',
      width: '80px'
    }],
    tableDataDisplay: (o, colDef) => {
      if(colDef.name === 'price') {
        return o.price ? displayAmount(o.price, o.currency) : ''
      } else if(colDef.name === 'cost') {
        return o.cost ? displayAmount(o.cost, o.currency) : ''
      }
    },
    include: [{ association: 'Barcode' }],
    filter: {
      items: [
        {
          name: 'name',
          label: 'Name',
          path: 'name',
          type: 'string',
          hint: 'Filter by product\'s name',
          ops: ['includes']
        }, {
          name: 'sku',
          label: 'SKU',
          path: 'sku',
          type: 'string',
          hint: 'Filter product\'s SKU',
          ops: ['eq'],
          place_after: 'name'
        }, {
          name: 'price',
          label: 'Price',
          path: 'price',
          type: 'money',
          hint: 'Product price',
          ops: ['lt', 'lte', 'gt', 'gte', 'eq', 'between', 'has', 'hasnot']
        }, {
          name: 'cost',
          label: 'Cost',
          path: 'cost',
          type: 'money',
          hint: 'Product cost',
          ops: ['lt', 'lte', 'gt', 'gte', 'eq', 'between', 'has', 'hasnot']
        }, {
          name: 'canBeSold',
          label: 'Can Sell',
          path: 'can_be_sold',
          type: 'string',
          hint: 'Show items that can be sold',
          ops: ['has']
        }, {
          name: 'canBeBought',
          label: 'Can Buy',
          path: 'can_be_bought',
          type: 'string',
          hint: 'Show items that can be bought',
          ops: ['has']
        }
      ]
    }
  },
  package: {
    model: 'Package',
    plural: 'Packages',
    page: 'products.package',
    colDef: [
    {
      name: 'name',
      displayName: 'Name',
      type: 'text'
    }, {
      name: 'product_name',
      displayName: 'Product Name',
      type: 'text'
    }, {
      name: 'Barcode.value',
      displayName: 'Barcode',
      type: 'text',
      width: '140px'
    }, {
      name: 'product_count',
      displayName: 'Product count',
      type: 'number'
    }],
    tableDataDisplay: (o, colDef) => {
      if(colDef.name === 'product_name') {
        return get(o, 'products[0].name')
      } else if(colDef.name === 'product_count') {
        return get(o, 'products[0].PackageProduct.count')
      }
    },
    filter: {
      items: [
        {
          name: 'name',
          label: 'Name',
          path: 'name',
          type: 'string',
          hint: 'Filter by product\'s name',
          ops: ['includes']
        }
      ]
    },
    include: [
      {association: 'products'},
      {association: 'Barcode'}
    ]
  },
  salesOrder: {
    model: 'SalesOrder',
    plural: 'Sales Orders',
    target: 'sales.orders',
    include: [
      { association: 'Customer' },
      { association: 'items' }
    ],
    colDef: [
      {
        name: 'created',
        displayName: 'Created',
        type: 'date',
        width: '90px'
      }, {
        name: 'refNum',
        displayName: 'Ref Num',
        type: 'text',
        width: '40px'
      }, {
        name: 'status',
        displayName: 'Status',
        type: 'text',
        width: '50px'
      }, {
        name: 'Customer.name',
        displayName: 'Customer',
        type: 'text',
        width: '130px'
      }, {
        name: 'items',
        displayName: 'Items',
        type: 'number',
        width: '30px'
      }, {
        name: 'net',
        displayName: 'Net',
        type: 'currency',
        width: '50px'
      }, {
        name: 'tax',
        displayName: 'Tax',
        type: 'currency',
        width: '50px'
      }, {
        name: 'gross',
        displayName: 'Gross',
        type: 'currency',
        width: '50px'
      }
    ],
    tableDataDisplay: (o, colDef) => {
      if(colDef.name === 'items') {
        return get(o, 'items.length', '-')
      } else if(colDef.name === 'created') {
        return dates.displayWithTime(get(o, 'createdAt'))
      } else if(colDef.name === 'net') {
        return o.net ? displayAmount(o.net, o.currency) : ''
      } else if(colDef.name === 'tax') {
        return o.tax ? displayAmount(o.tax, o.currency) : ''
      } else if(colDef.name === 'gross') {
        return o.gross ? displayAmount(o.gross, o.currency) : ''
      }
    },
    filter: {
      items: [
        {
          name: 'created',
          label: 'Created',
          path: 'created_at',
          type: 'date',
          hint: 'Date the order was created',
          ops: ['gte', 'lte', 'between']
        }, {
          name: 'customer',
          label: 'Customer',
          path: 'customer_id',
          type: 'entity-enum',
          hint: 'Find sales orders by customers',
          ops: ['in', 'nin']
        }, {
          name: 'refNum',
          label: 'Ref Num',
          path: 'ref_num',
          type: 'string',
          hint: 'Sales order reference number',
          ops: ['includes', 'eq']
        }, {
          name: 'status',
          label: 'Status',
          path: 'status',
          type: 'enum',
          enumItems: enums.salesOrderStatus,
          hint: 'Sales order status',
          ops: ['in']
        }
      ]
    }
  },
  purchaseOrder: {
    model: 'PurchaseOrder',
    plural: 'Purchase Orders',
    include: [
      { association: 'Supplier' },
      { association: 'items' }
    ],
    target: 'make.buy',
    colDef: [
      {
        name: 'created',
        displayName: 'Created',
        type: 'date',
        width: '80px'
      }, {
        name: 'refNum',
        displayName: 'Ref Num',
        type: 'text',
        width: '40px'
      }, {
        name: 'status',
        displayName: 'Status',
        type: 'text',
        width: '50px'
      }, {
        name: 'Supplier.name',
        displayName: 'Supplier',
        type: 'text',
        width: '130px'
      }, {
        name: 'items',
        displayName: 'Items',
        type: 'number',
        width: '30px'
      }
    ],
    tableDataDisplay: (o, colDef) => {
      if(colDef.name === 'items') {
        return get(o, 'items.length', '-')
      } else if(colDef.name === 'created') {
        return dates.displayWithTime(get(o, 'createdAt'))
      }
    },
    filter: {
      items: [
        {
          name: 'created',
          label: 'Created',
          path: 'created_at',
          type: 'date',
          hint: 'Date the order was created',
          ops: ['gte', 'lte', 'between']
        }, {
          name: 'supplier',
          label: 'Supplier',
          path: 'supplier_id',
          type: 'entity-enum',
          hint: 'Find sales orders by customers',
          ops: ['in']
        },
        {
          name: 'refNum',
          label: 'Ref Num',
          path: 'ref_num',
          type: 'string',
          hint: 'Sales order reference number',
          ops: ['includes', 'eq']
        },
        {
          name: 'status',
          label: 'Status',
          path: 'status',
          type: 'enum',
          enumItems: enums.purchaseOrderStatus,
          hint: 'Sales order status',
          ops: ['in']
        }
      ]
    }
  },
  job: {
    model: 'PipelineJob',
    plural: 'Jobs',
    target: 'make.orders',
    colDef: [
      {
        name: 'refNum',
        displayName: 'Ref Num',
        type: 'text',
        width: '90px'
      },
      {
        name: 'name',
        displayName: 'Name',
        type: 'text'
      },
      {
        name: 'plannedQty',
        displayName: 'Planned Qty',
        type: 'number'
      },
      {
        name: 'status',
        displayName: 'Status',
        type: 'number',
        width: '160px'
      }
    ],
    include: [{association: 'PipelineStage'}],
    filter: {
      items: [
        {
          name: 'name',
          label: 'Name',
          type: 'string',
          hint: 'Job\'s name',
          ops: ['includes']
        },
        {
          name: 'refNum',
          label: 'Ref Num',
          path: 'ref_num',
          type: 'string',
          hint: 'Job\'s reference number',
          ops: ['includes']
        }, {
          name: 'status',
          label: 'Status',
          path: 'status',
          type: 'enum',
          enumItems: enums.jobStatus,
          hint: 'Filter by status',
          ops: ['in']
        }
      ]
    }
  },
  location: {
    model: 'Location',
    plural: 'Locations',
    target: 'more.locations',
    colDef: [
      {
        name: 'name',
        displayName: 'Name',
        type: 'text'
      },
      {
        name: 'type',
        displayName: 'Type',
        type: 'text'
      }
    ]
  },
  supplier: {
    model: 'Supplier',
    plural: 'Suppliers',
    page: 'make.suppliers',
    colDef: [
    {
        name: 'name',
        displayName: 'Name',
        type: 'text'
    }, {
        name: 'email',
        displayName: 'Email',
        type: 'text'
    }],
    filter: {
      items: [
        {
          name: 'name',
          label: 'Name',
          path: 'name',
          type: 'string',
          hint: 'Filter by supplier\'s name',
          ops: ['includes']
        }, {
          name: 'email',
          label: 'Email',
          path: 'email',
          type: 'string',
          hint: 'Filter by email',
          ops: ['eq'],
          place_after: 'name'
        }
      ]
    }
  },
  pipeline: {
    model: 'Pipeline',
    plural: 'Pipelines',
    target: 'make.pipelines',
    colDef: [
      {
        name: 'name',
        displayName: 'Name',
        type: 'text'
      },
      {
        name: 'Location.name',
        displayName: 'Location',
        type: 'text'
      },
      {
        name: 'pending',
        displayName: 'Pending',
        type: 'number'
      },
      {
        name: 'producing',
        displayName: 'Producing',
        type: 'number'
      },
      {
        name: 'finished',
        displayName: 'Finished',
        type: 'number'
      }
    ],
    tableDataDisplay: (o, colDef) => {
      if(colDef.name === 'pending') {
        return get(o, 'stages[0].jobs.length')
      } else if(colDef.name === 'producing') {
        return get(o, 'stages[1].jobs.length')
      } else if(colDef.name === 'finished') {
        return get(o, 'stages[2].jobs.length')
      }
    },
    include: [{
      association: 'stages',
      include: {association: 'jobs'}
    }, { association: 'Location' }],
    filter: {
      items: [
        {
          name: 'name',
          label: 'Name',
          type: 'string',
          hint: 'Pipeline name',
          ops: ['includes']
        }, {
          name: 'location',
          label: 'Location',
          path: 'location_id',
          type: 'entity-enum',
          hint: 'Show remaining in locations',
          ops: ['in']
        } , {
          name: 'location-exists',
          label: 'Location Existence',
          path: 'location_id',
          type: 'integer',
          hint: 'Pipelines that have a location or not',
          ops: ['has', 'hasnot']
        }
      ]
    }
  },
  inventoryTx: {
    model: 'InventoryTx',
    plural: 'Inventory Trasnactions',
    colDef: [
      {
        name: 'created',
        displayName: 'Created',
        type: 'date'
      },
      {
        name: 'Product.name',
        displayName: 'Name',
        type: 'text'
      },
      {
        name: 'Location.name',
        displayName: 'Location',
        type: 'text'
      },
      {
        name: 'type',
        displayName: 'Type',
        type: 'text'
      },
      {
        name: 'count',
        displayName: 'Count',
        type: 'number'
      }
    ],
    tableDataDisplay: (o, colDef) => {
      if(colDef.name === 'created') {
        return dates.displayWithTime(get(o, 'createdAt'))
      }
    },
    include: [
      { association: 'Product' },
      { association: 'Location' }
    ]
  },
  inventoryItem: {
    model: 'InventoryItem',
    plural: 'Inventory Items',
    target: 'products.inventory',
    colDef: [
      {
        name: 'Product.name',
        displayName: 'Name',
        type: 'text'
      },
      {
        name: 'Location.name',
        displayName: 'Location',
        type: 'text'
      },
      {
        name: 'count',
        displayName: 'On Hand',
        type: 'number'
      }
    ],
    include: [
      { association: 'Product' },
      { association: 'Location' }
    ],
    filter: {
      items: [
        {
          name: 'product',
          label: 'Product',
          path: 'Product.name',
          type: 'string',
          hint: 'Filter by product\'s name',
          ops: ['includes']
        }, {
          name: 'location',
          label: 'Location',
          path: 'location_id',
          type: 'entity-enum',
          hint: 'Show remaining in locations',
          ops: ['in']
        }
      ]
    }
  },
  salesTaxReport: {
    filter: {
      items: [
        {
          name: 'created_at',
          label: 'Filling Period',
          path: 'created_at',
          type: 'date',
          hint: 'Date range to find tax from sales orders',
          ops: ['between']
        } , {
          name: 'status',
          label: 'Status',
          path: 'status',
          type: 'enum',
          enumItems: enums.salesOrderStatus,
          hint: 'Sales order status',
          ops: ['in']
        }
      ]
    }
  },
  taxReport: {
    model: 'TaxReport',
    plural: 'Tax Reports',
    colDef: [
      {
        name: 'created',
        displayName: 'Created',
        type: 'date',
        width: '250px'
      },
      {
        name: 'name',
        displayName: 'Name',
        type: 'text'
      }
    ],
    tableDataDisplay: (o, colDef) => {
      if(colDef.name === 'created') {
        return dates.displayWithTime(get(o, 'createdAt'))
      }
    },
    pdf: {
      'a4p': {
        defs: [{
          name: 'created',
          label: 'Created',
          width: '145',
          align: 'center'
        }, {
          name: 'refNum',
          label: 'Ref Num',
          width: '160'
        }, {
          name: 'tax',
          label: 'Tax',
          width: '130',
          align: 'right'
        }, {
          name: 'running',
          label: 'Running',
          width: '150',
          align: 'right'
        }]
      }
    }
  },
  reportSalesTax: {
    model: 'ReportSalesTax',
    plural: 'Sales Tax Report',
    description: 'Tax withheld from sales orders',
    include: [{ association: 'Report' }, { association: 'SalesOrder' }],
    colDef: [
      {
        name: 'created',
        displayName: 'Created',
        path: 'createdAt',
        type: 'date',
        width: '90px'
      }, {
        name: 'refNum',
        displayName: 'Ref Num',
        path: 'SalesOrder.refNum',
        type: 'text',
        width: '70px'
      },
      {
        name: 'tax',
        displayName: 'Tax',
        type: 'currency',
        width: '50px'
      }, {
        name: 'running',
        displayName: 'Running',
        type: 'currency',
        width: '50px'
      }
    ],
    tableDataDisplay: (o, colDef) => {
      if(colDef.name === 'created') {
        return dates.displayWithTime(get(o, 'createdAt'))
      } else if(colDef.name === 'tax') {
        return o.tax ? displayAmount(o.tax, o.currency) : ''
      } else if(colDef.name === 'running') {
        return o.running ? displayAmount(o.running, o.currency) : ''
      } else if(colDef.name === 'refNum') {
        return get(o, 'SalesOrder.refNum')
      }
    }
  },
  totals: {
    model: 'TotalsOverview',
    plural: 'Overview',
    description: 'Items in stock, in sales orders, waiting from vendors, in production',
    filter: {
      items: [
        {
          name: 'name',
          label: 'Product',
          path: 'name',
          type: 'string',
          hint: 'Filter by product\'s name',
          ops: ['includes']
        }, {
          name: 'on_hand',
          label: 'On Hand',
          path: 'on_hand',
          type: 'integer',
          hint: 'Products in stock',
          ops: ['lt', 'between', 'gt', 'has']
        }, {
          name: 'planned',
          label: 'Planned',
          type: 'integer',
          hint: 'Number of items routed through pipelines',
          ops: ['lt', 'between', 'gt', 'has']
        }, {
          name: 'ready',
          label: 'Ready',
          type: 'integer',
          hint: 'Produced items',
          ops: ['lt', 'between', 'gt', 'has']
        }, {
          name: 'receiving',
          label: 'Receiving',
          type: 'integer',
          hint: 'Items we wait from Purchase Orders',
          ops: ['lt', 'between', 'gt', 'has']
        }, {
          name: 'selling',
          label: 'Selling',
          type: 'integer',
          hint: 'Items used in pending sales orders',
          ops: ['lt', 'between', 'gt', 'has']
        }
      ]
    },
    colDef: [
      {
        name: 'name',
        displayName: 'Product',
        type: 'text',
        width: '40%'
      },
      {
        name: 'onHand',
        displayName: 'On Hand',
        type: 'number'
      },
      {
        name: 'planned',
        displayName: 'Planned',
        type: 'number'
      },
      {
        name: 'ready',
        displayName: 'Ready',
        type: 'number'
      },
      {
        name: 'receiving',
        displayName: 'Receiving',
        type: 'number'
      },
      {
        name: 'selling',
        displayName: 'Selling',
        type: 'number'
      }
    ],
    tableDataDisplay: (o, colDef) => {
      const v = o[colDef.name]
      if(colDef.type === 'number' && v) {
        return `${v} ${o.unit !== null ? o.unit : ''}`
      }
    }
  }
}
