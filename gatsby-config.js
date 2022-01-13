module.exports = {
  plugins: [
    {
      resolve: '@opensumi/gatsby-theme',
      options: {
        GATrackingId: 'G-63DR4G0WD7',
        pathPrefix: '/doc',
        theme: {
          'primary-color': '#9f5fdb'
        },
        pwa: true,
        cname: true,
        codeSplit: true
      }
    }
  ],
  siteMetadata: {
    title: 'OpenSumi',
    description: '一款帮助你快速搭建本地和云端 IDE 的框架 - A framework helps you quickly build Cloud or Desktop IDE products.',
    siteUrl: 'https://opensumi.com',
    logo: {
      img:
        'https://img.alicdn.com/imgextra/i1/O1CN01P04WYq1HV2XD2XhTP_!!6000000000762-2-tps-180-172.png',
      link: 'https://opensumi.com'
    },
    logoUrl:
      'https://img.alicdn.com/imgextra/i4/O1CN01i4NRTW1iw3WW708SI_!!6000000004476-2-tps-101-101.png',
    githubUrl: 'https://github.com/opensumi/core',
    navs: [
      {
        slug: 'docs/integrate/overview',
        title: {
          en: 'User Guide',
          zh: '集成文档'
        }
      },
      {
        slug: 'docs/develop/how-to-contribute',
        title: {
          en: 'Develop Guide',
          zh: '开发文档'
        }
      },
    ],
    docs: [
      {
        slug: 'integrate/quick-start',
        title: {
          zh: '快速开始',
          en: 'Quick Start'
        },
        order: 1
      },
      {
        slug: 'integrate/universal-integrate-case',
        title: {
          zh: '常见集成场景',
          en: 'Integrate Case'
        },
        order: 2
      },
      {
        slug: 'develop/basic-design',
        title: {
          zh: '基础设计',
          en: 'Basic Design'
        },
        order: 2
      },
      {
        slug: 'develop/module-apis',
        title: {
          zh: '模块 API',
          en: 'Modules API'
        },
        order: 3
      },
      {
        slug: 'develop/sample',
        title: {
          zh: '经典案例',
          en: 'Sample'
        },
        order: 5
      },
    ],
    showSearch: false, // 是否展示搜索框
    showChinaMirror: false, // 是否展示国内镜像链接
    showAntVProductsCard: false,
    showWxQrcode: false,
    showLanguageSwitcher: false, // 用于定义是否展示语言切换
    showGithubCorner: true, // 是否展示角落的 GitHub 图标
    showExampleDemoTitle: false,
    playground: {
      extraLib: '',
      container: '<div id="container" />',
      playgroundDidMount: 'console.log("playgroundDidMount");',
      playgroundWillUnmount: 'console.log("playgroundWillUnmount");'
    },
    docsearchOptions: {
      apiKey: '733f00c901bfe392d78ba8c4437f8a32',
      indexName: 'opensumi'
    },
    redirects: []
  }
};
