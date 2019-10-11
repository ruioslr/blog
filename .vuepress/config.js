module.exports = {
    title: 'Ruios',
    description: 'React and redux based, lightweight and elm-style framework.',
    dest: 'dist/',
    rootDir: 'docs/',
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
                'generator'
            ],
          },
        ],
      },
    },
  };
  