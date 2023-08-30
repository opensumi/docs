require('dotenv').config();
module.exports = {
  plugins: [
    {
      resolve: '@opensumi/gatsby-theme',
      options: {
        GATrackingId: 'G-63DR4G0WD7',
        theme: {
          'primary-color': '#9f5fdb'
        },
        pwa: true,
        cname: false,
        codeSplit: true
      }
    }
  ],
  siteMetadata: {
    title: 'OpenSumi',
    description:
      '一款帮助你快速搭建本地和云端 IDE 的框架 - A framework helps you quickly build Cloud or Desktop IDE products.',
    siteUrl: 'https://opensumi.com',
    logo: {
      img:
        'https://img.alicdn.com/imgextra/i2/O1CN01dqjQei1tpbj9z9VPH_!!6000000005951-55-tps-87-78.svg',
      link: 'https://opensumi.com'
    },
    logoUrl:
      'https://img.alicdn.com/imgextra/i2/O1CN01dqjQei1tpbj9z9VPH_!!6000000005951-55-tps-87-78.svg',
    githubUrl: 'https://github.com/opensumi/core',
    docsUrl: 'https://github.com/opensumi/docs',
    navs: [
      {
        slug: 'docs/integrate/overview',
        title: {
          en: 'Documentation',
          zh: '集成文档'
        }
      },
      {
        slug: 'docs/develop/how-to-contribute',
        title: {
          en: 'Development',
          zh: '开发文档'
        }
      },
      {
        slug: 'docs/extension/overview',
        title: {
          en: 'Extension API',
          zh: '插件研发'
        }
      },
      {
        slug: 'https://marketplace.opentrs.cn/square',
        title: {
          en: 'Marketplace',
          zh: '插件市场'
        }
      }
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
        slug: 'integrate/module-usage',
        title: {
          zh: '模块使用',
          en: 'Module Usage'
        },
        order: 3
      },
      {
        slug: 'integrate/extensions-usage',
        title: {
          zh: '插件使用',
          en: 'Extensions Usage'
        },
        order: 4
      },
      {
        slug: 'integrate/browser-extension',
        title: {
          zh: '浏览器插件',
          en: 'Browser Extension'
        },
        order: 5
      },
      {
        slug: 'develop/basic-design',
        title: {
          zh: '基础设计',
          en: 'Basic Design'
        },
        order: 4
      },
      {
        slug: 'develop/module-apis',
        title: {
          zh: '模块 API',
          en: 'Modules API'
        },
        order: 5
      },
      {
        slug: 'develop/sample',
        title: {
          zh: '经典案例',
          en: 'Sample'
        },
        order: 6
      },
      {
        slug: 'extension/develop',
        title: {
          zh: 'OpenSumi 插件开发',
          en: 'Extension Develop'
        },
        order: 2
      },
      {
        slug: 'extension/interface',
        title: {
          zh: 'OpenSumi API',
          en: 'OpenSumi API'
        },
        order: 3
      },
      {
        slug: 'extension/contributes',
        title: {
          zh: 'OpenSumi 贡献点',
          en: 'OpenSumi Contribute Points'
        },
        order: 4
      }
    ],
    showDingTalkQRCode: true,
    showWeChatQRCode: true,
    weChatQRCode:
      'https://img.alicdn.com/imgextra/i2/O1CN01s9Ob1C1et4cU5tEfr_!!6000000003928-0-tps-1376-1373.jpg',
    dingTalkQRCode:
      'https://img.alicdn.com/imgextra/i2/O1CN01Fcw6RC1T8qozkQBFG_!!6000000002338-2-tps-200-239.png',
    showSearch: true, // 是否展示搜索框
    showChinaMirror: false, // 是否展示国内镜像链接
    showLanguageSwitcher: true, // 用于定义是否展示语言切换
    showGithubCorner: true, // 是否展示角落的 GitHub 图标
    docsearchOptions: {
      appId: 'TJ9L5P0JEZ',
      apiKey: 'ea572740263d426554e711fca503c754',
      indexName: 'opensumi'
    },
    redirects: []
  }
};
