const { getSidebar, getNav } = require('./utils');
module.exports = {
    theme: 'reco',
    title: 'Ruios',
    description: 'here is the blog of Ruios.',
    dest: 'dist/',
    head: [
      ['link', { rel: 'icon', href: '/favicon.ico' }]
    ],
    plugins: ['@vuepress/back-to-top'],
    chainWebpack: (config) => {
      // 关闭webpack的压缩，谷歌服务器压缩太慢了
      config.optimization.minimize(false);
    },
    themeConfig: {
      type: 'blog',
      authorAvatar: '/logo.jpg',
      logo: '/logo.jpg',
      lastUpdated: 'Last Updated',
      nav: getNav(),
      sidebar: getSidebar(),
      // sidebar: false,
      sidebarDepth: 5,
      blogConfig: {
        category: {
          location: -2,    
          text: '目录' 
        },
        tag: {
          location: -1,     
          text: '标签'  
        }
      },
  }
}