const styles: string[] = []

export function addStyle(css: string) {
  styles.push(css.trim())
}

export function consolidateStyles() {
  const style = document.createElement('style')
  style.textContent = styles.join('\n')
  document.head.appendChild(style)
  styles.length = 0
}

export async function waitForPageReady(): Promise<void> {
  await new Promise<void>((resolve) => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      resolve()
    } else {
      listenOnce('DOMContentLoaded', () => resolve())
    }
  })
  // Additionally, wait for npm to hydrate
  await new Promise((resolve) => setTimeout(resolve, 0))
}

export function listenOnce<K extends keyof DocumentEventMap>(
  type: K,
  listener: (this: Document, ev: DocumentEventMap[K]) => any,
) {
  document.addEventListener(type, listener, { once: true })
}

export function getPackageName(): string | undefined {
  if (!location.pathname.startsWith('/package/')) return undefined

  const str = location.pathname.slice('/package/'.length)
  const parts = str.split('/')
  if (str[0] === '@') {
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : undefined
  } else {
    return parts[0] || undefined
  }
}
