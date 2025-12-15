// RunKit is dead and it's still there. Amazing.

export function run() {
  if (!location.pathname.startsWith('/package/')) return

  const link = document.querySelector('a[href^="https://runkit.com/npm/"]')
  link?.remove()
}
