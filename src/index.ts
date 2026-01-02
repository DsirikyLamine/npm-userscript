import { allFeatures } from './all-features.ts'
import { cache } from './utils-cache.ts'
import { consolidateStyles, waitForPageReady } from './utils.ts'

declare global {
  const SETTINGS: {
    features: Record<keyof typeof allFeatures, boolean>
  }
}

runFeatures()

async function runFeatures() {
  // Run pre
  for (const feature in allFeatures) {
    if (SETTINGS.features[feature] === false) continue
    allFeatures[feature].runPre?.()?.catch((err) => {
      console.error(`Error running pre for feature "${feature}":`, err)
    })
  }
  consolidateStyles()

  // Let npm's JS run a bit before we run our main features
  await waitForPageReady()

  // Run normal
  for (const feature in allFeatures) {
    if (SETTINGS.features[feature] === false) continue
    allFeatures[feature].run?.()?.catch((err) => {
      console.error(`Error running feature "${feature}":`, err)
    })
  }
  consolidateStyles()

  cache.clearExpired()
}
