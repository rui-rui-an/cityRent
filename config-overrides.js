const { override, fixBabelImports } = require('customize-cra')
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd-mobile-v2',
    style: 'css'
  })
)
