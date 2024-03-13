import * as React from 'react'
import { get } from 'lodash-es'
import { FormProvider } from '@pickestry/components'
import { Dialog as DialogComponent } from '@pickestry/components'
import { DialogBody } from '@pickestry/components'
import { DialogHeader } from '@pickestry/components'
import { ProductForm } from '../forms/ProductForm.jsx'
import { PackageForm } from '../forms/index.mjs'
import { CustomerForm } from '../forms/index.mjs'
import { LocationForm } from '../forms/index.mjs'
import { SupplierForm } from '../forms/index.mjs'
import { PipelineForm } from '../forms/index.mjs'
import { JobCreateForm } from '../forms/index.mjs'
import { JobAssignPipelineForm } from '../forms/index.mjs'
import { AddPartForm } from '../forms/AddPartForm.jsx'
import { ChangePartQtyForm } from '../forms/ChangePartQtyForm.jsx'
import { NewVariantForm } from '../forms/NewVariantForm.jsx'
import { IncidentForm } from '../forms/IncidentForm.jsx'
import { JobNotesForm } from '../forms/JobNotesForm.jsx'
import { ActivateDevice } from '../forms/ActivateDevice.jsx'
import { InventoryTxForm } from '../forms/InventoryTxForm.jsx'
import { AddLicense } from '../forms/AddLicense.jsx'
import { ExportBarcodes } from '../forms/ExportBarcodes.jsx'
import * as c from '../../c.mjs'

export const Dialogs = () => {

  const [open, setOpen] = React.useState()

  const openChange = React.useCallback((v) => {
    if(v === false) closeNow()
  }, [open])

  const closeNow = React.useCallback(() => { setOpen() }, [])

  React.useEffect(() => {
    function onShowDialog(_e, [name, meta]) {
      setOpen({name, meta})
    }

    window.ipc.on(c.DIALOG_SHOW, onShowDialog)

    return function cleanup() {
      window.ipc.off(c.DIALOG_SHOW, onShowDialog)
    }
  }, [])

  const onSuccess = React.useCallback(() => {
    closeNow()
  }, [closeNow])

  const id = React.useMemo(() => get(open, 'meta.id'), [open])
  const name = React.useMemo(() => get(open, 'name'), [open])

  return (
    <FormProvider>
      { /*Create Product*/ }
      <DialogComponent open={name === c.DLG_PRODUCT_CREATE} onOpenChange={(v) => { openChange(v)}} modal onClose={() => {}}>
        <DialogHeader>Create Product</DialogHeader>
        <DialogBody>
          <ProductForm onSuccess={onSuccess} />
        </DialogBody>
      </DialogComponent>
      { /*Edit Product*/ }
      <DialogComponent open={name === c.DLG_PRODUCT_UPDATE} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Edit Product</DialogHeader>
        <DialogBody>
          <ProductForm onSuccess={onSuccess} id={id} />
        </DialogBody>
      </DialogComponent>
      { /*Create Customer*/ }
      <DialogComponent open={name === c.DLG_CUSTOMER_CREATE} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Create Customer</DialogHeader>
        <DialogBody>
          <CustomerForm onSuccess={onSuccess} />
        </DialogBody>
      </DialogComponent>
      { /*Edit Customer*/ }
      <DialogComponent open={name === c.DLG_CUSTOMER_UPDATE} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Update Customer</DialogHeader>
        <DialogBody>
          <CustomerForm onSuccess={onSuccess}  id={id}  />
        </DialogBody>
      </DialogComponent>
      {/* Create Package */}
      <DialogComponent open={name === c.DLG_PKG_CREATE} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Create Package</DialogHeader>
        <DialogBody>
          <PackageForm onSuccess={onSuccess} />
        </DialogBody>
      </DialogComponent>
      { /* Edit Package*/ }
      <DialogComponent open={name === c.DLG_PKG_UPDATE} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Edit Package</DialogHeader>
        <DialogBody>
          <PackageForm onSuccess={onSuccess} id={id} />
        </DialogBody>
      </DialogComponent>
      {/* Create Location */}
      <DialogComponent open={name === c.DLG_LOCATION_CREATE} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Create Location</DialogHeader>
        <DialogBody>
          <LocationForm onSuccess={onSuccess} />
        </DialogBody>
      </DialogComponent>
      { /* Edit Location*/ }
      <DialogComponent open={name === c.DLG_LOCATION_UPDATE} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Edit Location</DialogHeader>
        <DialogBody>
          <LocationForm onSuccess={onSuccess} id={id} />
        </DialogBody>
      </DialogComponent>
      {/* Create Supplier */}
      <DialogComponent open={name === c.DLG_SUPPLIER_CREATE} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Create Supplier</DialogHeader>
        <DialogBody>
          <SupplierForm onSuccess={onSuccess} />
        </DialogBody>
      </DialogComponent>
      { /* Edit Supplier*/ }
      <DialogComponent open={name === c.DLG_SUPPLIER_UPDATE} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Edit Supplier</DialogHeader>
        <DialogBody>
          <SupplierForm onSuccess={onSuccess} id={id} />
        </DialogBody>
      </DialogComponent>
      {/* Create Pipeline */}
      <DialogComponent open={name === c.DLG_PIPELINE_CREATE} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Create Pipeline</DialogHeader>
        <DialogBody>
          <PipelineForm onSuccess={onSuccess} />
        </DialogBody>
      </DialogComponent>
      { /* Edit Pipeline*/ }
      <DialogComponent open={name === c.DLG_PIPELINE_UPDATE} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Edit Pipeline</DialogHeader>
        <DialogBody>
          <PipelineForm onSuccess={onSuccess} id={id} />
        </DialogBody>
      </DialogComponent>
      { /* Create Pipeline Job */ }
      <DialogComponent open={name === c.DLG_JOB_CREATE} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Create Job</DialogHeader>
        <DialogBody>
          <JobCreateForm onSuccess={onSuccess} />
        </DialogBody>
      </DialogComponent>
      { /* Create Pipeline Job */ }
      <DialogComponent open={name === c.DLG_JOB_ASSIGN} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Assign to Pipeline</DialogHeader>
        <DialogBody>
          <JobAssignPipelineForm onSuccess={onSuccess} id={id} />
        </DialogBody>
      </DialogComponent>
      { /* */ }
      <DialogComponent open={name === c.DLG_NEW_VARIANT} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Create Variant</DialogHeader>
        <DialogBody>
          <NewVariantForm onSuccess={onSuccess} id={id} />
        </DialogBody>
      </DialogComponent>
      <DialogComponent open={name === c.DLG_ADD_PART} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Add Part</DialogHeader>
        <DialogBody>
          <AddPartForm onSuccess={onSuccess} id={id} />
        </DialogBody>
      </DialogComponent>
      <DialogComponent open={name === c.DLG_CHANGE_PART_QTY} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Change Part Qty</DialogHeader>
        <DialogBody>
          <ChangePartQtyForm onSuccess={onSuccess} id={id} partId={get(open, 'meta.partId')} />
        </DialogBody>
      </DialogComponent>
      { /* Incident on a Job */ }
      <DialogComponent open={name === c.DLG_SET_INCIDENT} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Set Incident</DialogHeader>
        <DialogBody>
          <IncidentForm onSuccess={onSuccess} id={id} />
        </DialogBody>
      </DialogComponent>
      { /* Job Notes */ }
      <DialogComponent open={name === c.DLG_ADD_JOB_NOTE} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Add Job Note</DialogHeader>
        <DialogBody>
          <JobNotesForm onSuccess={onSuccess} id={id} />
        </DialogBody>
      </DialogComponent>
      { /* Activate Device */ }
      <DialogComponent open={name === c.DLG_ACTIVATE_DEVICE} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Activate Device</DialogHeader>
        <DialogBody>
          <ActivateDevice onSuccess={onSuccess} id={id} name={get(open, 'meta.name')} />
        </DialogBody>
      </DialogComponent>
      { /* Create Inventory Tx */ }
      <DialogComponent open={name === c.DLG_NEW_TX} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Create New Inventory Transaction</DialogHeader>
        <DialogBody>
          <InventoryTxForm onSuccess={onSuccess} id={id} />
        </DialogBody>
      </DialogComponent>
      { /* Add License */ }
      <DialogComponent open={name === c.DLG_ADD_LCN} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Add License</DialogHeader>
        <DialogBody>
          <AddLicense onSuccess={onSuccess} />
        </DialogBody>
      </DialogComponent>
      { /* Export Barcodes */ }
      <DialogComponent open={name === c.DLG_EXPORT_BARCODES} onOpenChange={(v) => { openChange(v)}} modal>
        <DialogHeader>Export Barcodes</DialogHeader>
        <DialogBody>
          <ExportBarcodes onSuccess={onSuccess} barcode={get(open, 'meta.barcode')} barcodeCount={get(open, 'meta.barcodeCount')} />
        </DialogBody>
      </DialogComponent>
    </FormProvider>
  )
}
