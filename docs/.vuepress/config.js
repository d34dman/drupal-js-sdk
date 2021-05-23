module.exports = {
    lang: 'en-US',
    title: 'Drupal Javascript SDK',
    description: 'Javascript Guide',
    themeConfig: {
      logo: '/svg/logo.svg',
      // If you set it in the form of `organization/repository`
      // we will take it as a GitHub repo
      repo: 'd34dman/drupal-js-sdk',
      docsDir: 'guide',
      sidebar: {
        '/guide': [
          {
            isGroup: true,
            text: 'Guide',
            children: [
              '/guide/README.md', 
              '/guide/getting-started.md'
            ],
          },
          {
            text: 'References',
            link: '/references'
          },
          {
            text: 'Examples',
            link: '/examples'
          },
          {
            text: 'API',
            link: '/api'
          },
        ],
        '/references': [
          {
            text: 'Guide',
            link: '/guide'
          },
          {
            isGroup: true,
            text: 'References',
            children: [
              '/references/README.md',
            ],
          },
          {
            text: 'Examples',
            link: '/examples'
          },
          {
            text: 'API',
            link: '/api'
          },
        ],
        '/examples': [
          {
            text: 'Guide',
            link: '/guide'
          },
          {
            text: 'References',
            link: '/references'
          },
          {
            isGroup: true,
            text: 'Examples',
            children: [
              '/examples/README.md',
            ],
          },
          {
            text: 'API',
            link: '/api'
          },
        ],
        '/api': [
          {
            text: 'Guide',
            link: '/guide'
          },
          {
            text: 'References',
            link: '/references'
          },
          {
            text: 'Examples',
            link: '/examples'
          },
          {
            text: 'API',
            link: '/api'
          },
        ],
      },
      navbar: [
        // nested group - max depth is 2
        {
          text: 'Guide',
          link: '/guide'
        },
        {
          text: 'References',
          link: '/references'
        },
        {
          text: 'Examples',
          link: '/examples'
        },
        {
          text: 'API',
          link: '/api'
        }
      ]
    }
  }