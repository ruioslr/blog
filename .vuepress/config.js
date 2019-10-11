module.exports = {
    title: 'Ruios',
    description: 'Blog of Ruios.',
    dest: 'dist/',
    themeConfig: {
      lastUpdated: 'Last Updated',
      nav: [
        { text: 'JS基础', link: '/js-basic/' },
      ],
      sidebar: {
        '/js-basic/': [
          {
            title: 'JS基础',
            collapsable: false,
            children: [
                'generator函数的使用',
                'javascript装饰器的使用'
            ],
          },
        ],
      },
    },
  };
  