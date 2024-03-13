import { defaultTheme as defaultOriginalTheme } from '@pickestry/components'
import { produce } from 'immer'

export const defaultTheme = produce(defaultOriginalTheme, (draft) => {
  draft.palette.primary.main = '#2F275A'
  draft.palette.primary.light = '#9793AD'
  draft.palette.primary.lighter = '#EAE9EF'

  // Table
  draft.components.table = Object.assign(draft.components.table, {
    border: 'none',
    borderRadius: '4px',
    backgroundColor: 'white',
    padding: '8px 8px 4px 4px'
  })

  // Frame
  draft.components.frame.margin = '0'
  draft.components.frame.borderShadow = 'none'
  draft.components.frame.border = '1px solid #ccc'
  draft.components.frame.minHeight = 'inherit'

  // Paginator
  draft.components.paginator.margin = '8px 4px'

  // Panel
  draft.components.panel.padding = '0 8px'

  // List
  draft.components.list.itemPadding = '16px 4px'

  // Items
  draft.components.items.border = 'none'

  return draft
})
