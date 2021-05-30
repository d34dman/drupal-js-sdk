module.exports = {
  lang: 'en-US',
  title: 'Drupal JavaScript SDK',
  description: 'JavaScript Guide',
  plugins: [
    [
      '@vuepress/plugin-docsearch',
      {
        apiKey: '1cbbf73a9fc979d1bca3111fee871ce8',
        indexName: 'drupal-js-sdk-docs',
      },
    ],
  ],
  algolia: {
    apiKey: '1cbbf73a9fc979d1bca3111fee871ce8',
    indexName: 'drupal-js-sdk-docs',
  },
  themeConfig: {
    logo: '/svg/logo.svg',
    repo: 'd34dman/drupal-js-sdk',
    docsDir: 'guide',
    sidebar: {
      '/guide': [
        {
          isGroup: true,
          text: 'Guide',
          children: [
            '/guide/README.md',
            '/guide/getting-started.md',
            '/guide/cors.md',
            '/guide/authentication.md',
            '/guide/menu.md'
          ],
        },
        {
          text: 'Showcase',
          link: '/showcase'
        },
        {
          text: 'Examples',
          link: '/examples'
        }
      ],
      '/showcase': [
        {
          text: 'Guide',
          link: '/guide'
        },
        {
          isGroup: true,
          text: 'Showcase',
          children: [
            '/showcase/README.md',
          ],
        },
        {
          text: 'Examples',
          link: '/examples'
        }
      ],
      '/examples': [
        {
          text: 'Guide',
          link: '/guide'
        },
        {
          text: 'Showcase',
          link: '/showcase'
        },
        {
          isGroup: true,
          text: 'Examples',
          children: [
            '/examples/README.md',
          ],
        }
      ]
    },
    navbar: [
      {
        text: 'Guide',
        link: '/guide'
      },
      {
        text: 'Examples',
        link: '/examples'
      },
      {
        text: 'Showcase',
        link: '/showcase'
      },
      {
        text: 'API',
        link: 'https://d34dman.github.io/drupal-js-sdk'
      }
    ]
  }
}