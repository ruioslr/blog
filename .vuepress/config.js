const { getSidebar, getNav } = require('./utils');
module.exports = {
    title: 'Ruios',
    description: 'Blog of Ruios.',
    dest: 'dist/',
    plugins: ['@vuepress/back-to-top'],
    themeConfig: {
      lastUpdated: 'Last Updated',
      nav: getNav(),
      sidebar: getSidebar()
  },
}