// Because it was too hard to implement

import { addStyle } from '../utils'

const bannerQuery = 'section[aria-label="Site notifications"]'
const getBannerKey = (banner: Element) => {
  const text = banner.textContent.trim()
  const hash = btoa(encodeURIComponent(text)).slice(0, 16) + text.length
  return `npm-userscript-remember-banner:${hash}`
}

export function runPre() {
  const banner = document.querySelector(bannerQuery)
  if (!banner) return

  const key = getBannerKey(banner)

  // If we've previously closed this banner, hide it via CSS
  if (localStorage.getItem(key) === 'hide') {
    addStyle(`
      section[aria-label="Site notifications"] {
        display: none;
      }
    `)
  }
}

export function run() {
  const banner = document.querySelector('section[aria-label="Site notifications"]')
  if (!banner) return

  const key = getBannerKey(banner)

  if (localStorage.getItem(key) === 'hide') {
    banner.remove()
  } else {
    const closeButton = banner.querySelector('button')
    closeButton?.addEventListener('click', () => {
      localStorage.setItem(key, 'hide')
    })
  }
}
