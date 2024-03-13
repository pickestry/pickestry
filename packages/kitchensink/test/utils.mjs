// Part of Pickestry. See LICENSE file for full copyright and licensing details.

export const scrollTo = async (element) => {
  const isScrollable = await element.evaluate(e => e.clientHeight < e.scrollHeight)

  // scroll to top
  if(isScrollable) {
    await element.evaluate(e => e.scrollTop = 0)
  }
}

export async function screenshotOnFailure({ page }, testInfo) {

  console.log(`Finished ${testInfo.title} in ${testInfo.duration} ms and with status ${testInfo.status}/${testInfo.expectedStatus}`) // eslint-disable-line no-console

  if (testInfo.status !== testInfo.expectedStatus) {
    const screenshotPath = testInfo.outputPath('failure.png')

    testInfo.attachments.push({ name: 'screenshot', path: screenshotPath, contentType: 'image/png' })

    await page.screenshot({ path: screenshotPath, timeout: 5000 })
  }
}
