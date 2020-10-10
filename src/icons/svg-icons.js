const req = require.context('./svg/pub', false, /\.svg$/)
const req2 = require.context('./svg/backsystem', false, /\.svg$/)
const req3 = require.context('./svg/app', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys()

const re = /\.\/(.*)\.svg/

const svgIcons = requireAll(req).map(i => {
  return i.match(re)[1]
})

const svgBsIcons = requireAll(req2).map(i => {
  return i.match(re)[1]
})

const svgAppIcons = requireAll(req3).map(i => {
  return i.match(re)[1]
})

export default {svgIcons,svgBsIcons,svgAppIcons}
