const { getSidebar, getNav } = require('./utils');
module.exports = {
    theme: 'reco',
    title: 'Blog of Ruios',
    description: 'Blog of Ruios.',
    dest: 'dist/',
    plugins: ['@vuepress/back-to-top', require('./hideHomeSide.js')],
    themeConfig: {
      type: 'blog',
      lastUpdated: 'Last Updated',
      nav: getNav(),
      sidebar: getSidebar(),
      blogConfig: {
        category: {
          location: -2,     // 在导航栏菜单中所占的位置，默认2
          text: '分类' // 默认文案 “分类”
        },
        tag: {
          location: -1,     // 在导航栏菜单中所占的位置，默认3
          text: '标签'      // 默认文案 “标签”
        }
      },
  }
}