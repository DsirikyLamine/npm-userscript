import { addStyle } from '../utils.ts'

export function runPre() {
  if (location.pathname.startsWith('/package/')) {
    // Remove extraneous padding and margin in sidebar
    addStyle(`
      #repository + p,
      #homePage + p {
        padding: 0 !important;
        margin: 0 !important;
        text-decoration: none;
      }
    `)

    // Fix icon alignment in sidebar links
    addStyle(`
      [aria-labelledby*=repository-link],
      [aria-labelledby*=homePage-link] {
        display: flex;
        align-items: center;
      }

      [aria-labelledby*=repository-link] > span {
        margin-right: 6px;
      }

      [aria-labelledby*=repository-link] > span > svg {
        display: block;
      }
    `)

    // Fix icon alignment in sidebar buttons
    addStyle(`
      [aria-label="Package sidebar"] a.button > svg {
        margin-right: 8px;
      }
    `)
  }
}
