import { padStart } from 'lodash-es'
import { usb } from './usb-wrapper.js'

export const buildIdFromUSBDevice = (device) => {
  const vid  = padStart(device.vendorId.toString(16), 4, '0')
  const pid = padStart(device.productId.toString(16), 4, '0')

  const sufix = device.serialNumber ? `#${device.serialNumber}` : `#${(device).device.busNumber}#${(device).device.deviceAddress}`

  return `${vid}:${pid}${sufix}`
}

export const buildId = (device) => {
  const busAddress = device.deviceAddress
  const busNumber = device.busNumber
  const vid = padStart(device.deviceDescriptor.idVendor.toString(16), 4, '0')
  const pid = padStart(device.deviceDescriptor.idProduct.toString(16), 4, '0')

  const sufix = `#${busNumber}#${busAddress}`

  return `${vid}:${pid}${sufix}`
}

export const hasIdFromUSBDevice = (device, id) => {
  return buildIdFromUSBDevice(device) === id
}

export const hasId = (device, id) => {
  return buildId(device) === id
}

export const requestDevice = (id) => {
  const allDevices = usb.getDeviceList()

  for(const device of allDevices) {
    if(hasId(device, id)) return device
  }

  throw new Error('device not found')
}
