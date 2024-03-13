const usb = require('usb')

module.exports = {
  usb: usb.usb,
  Device: usb.Device,
  Interface: usb.Interface,
  InEndpoint: usb.InEndpoint
}
