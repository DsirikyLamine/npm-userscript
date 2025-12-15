// The code tab has been in beta for like 3 years now, it works fine without labelling as beta

import { addStyle } from '../utils'

export function runPre() {
  addStyle(`
    #package-tab-code > span > span:last-child {
      display: none;
    }
  `)
}
