const { getSidebar, getNav } = require('./utils');
module.exports = {
    theme: 'reco',
    title: 'Ruios',
    description: 'here is the blog of Ruios.',
    dest: 'dist/',
    plugins: ['@vuepress/back-to-top'],
    themeConfig: {
      type: 'blog',
      lastUpdated: 'Last Updated',
      nav: getNav(),
      sidebar: getSidebar(),
      blogConfig: {
        category: {
          location: -2,    
          text: '分类' 
        },
        tag: {
          location: -1,     
          text: '标签'  
        }
      },
  }
}