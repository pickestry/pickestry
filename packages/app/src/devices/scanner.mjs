export class Scanner {

  id = ''

  name = ''

  started = false

  autostart = false

  static create(device) {
    const o = new Scanner()

    o.id = device.id
    o.name = device.name
    o.started = device.started

    return o
  }

}
