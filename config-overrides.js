const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  //按需加载（需要用的样式就加载，不会加载全部样式，浪费资源）
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  //自定义主题（一般改按钮的颜色）
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { '@primary-color': '#1DA57A' },
  }),
);
