import { allFeatures } from './all-features.ts'
import { consolidateStyles, waitForPageReady } from './utils.ts'

runFeatures()

async function runFeatures() {
  // Run pre
  for (const feature in allFeatures) {
    const mod = allFeatures[feature]
    await allFeatures[feature].runPre?.()
  }
  consolidateStyles()

  // Let npm's JS run a bit before we run our main features
  await waitForPageReady()
  await new Promise((resolve) => setTimeout(resolve, 0))

  // Run normal
  for (const feature in allFeatures) {
    const mod = allFeatures[feature]
    await allFeatures[feature].run?.()
  }
  consolidateStyles()
}
