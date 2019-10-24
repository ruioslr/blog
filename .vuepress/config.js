module.exports = {
    title: 'Ruios',
    description: 'Blog of Ruios.',
    dest: 'dist/',
    plugins: ['@vuepress/back-to-top'],
    themeConfig: {
      lastUpdated: 'Last Updated',
      nav: [
                { text: 'Javascript', link: '/javascript/generator函数的使用' },
                {text: '前端工具', link: '/前端工具/webpack/webpack插件开发.md'},
                {text: 'React', link: '/React/React高阶组件深入.md'}
      ],
      sidebar: {
        '/javascript/': [
          {
            title: 'Javascript',
            collapsable: false,
            children: [
                'generator函数的使用',
                'javascript装饰器的使用'
            ],
          },
        ],
        '/react/': [
          {
            title: 'React',
            collapsable: false,
            children: [
                'React高阶组件深入'
            ],
          },
        ],
      },
    },
  };
  