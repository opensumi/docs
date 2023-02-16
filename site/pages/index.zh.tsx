import React from 'react';
import SEO from '@opensumi/gatsby-theme/site/components/Seo';
import Banner from '@opensumi/gatsby-theme/site/components/Banner';
import Features from '@opensumi/gatsby-theme/site/components/Features';
import Companies from '@opensumi/gatsby-theme/site/components/Companies';
import Cases from '@opensumi/gatsby-theme/site/components/Cases';
import BannerSVG from '@opensumi/gatsby-theme/site/components/BannerSVG';
import { useStaticQuery, graphql } from 'gatsby';
import { useTranslation } from 'react-i18next';

const IndexPage = () => {
  const query = graphql`
    query SiteHomeQuery {
      site {
        siteMetadata {
          logoUrl
        }
      }
    }
  `;
  const { t, i18n } = useTranslation();
  const { site } = useStaticQuery(query);
  const { logoUrl } = site.siteMetadata;

  const features = [
    {
      icon:
        'https://img.alicdn.com/imgextra/i2/O1CN01tAJG0Q1sy1OZDiqDb_!!6000000005834-2-tps-330-288.png',
      title: t('轻松集成'),
      description: t(
        '提供面向容器场景、Electron 场景和纯前端场景的快速集成解决方案，助力业务快速落地'
      )
    },
    {
      icon:
        'https://img.alicdn.com/imgextra/i3/O1CN01EPd2N523bXjOWj7lw_!!6000000007274-2-tps-330-288.png',
      title: t('高拓展性'),
      description: t(
        '提供从 VS Code 插件、OpenSumi 插件到 OpenSumi 模块三层业务解决方案，完美支持业务定制需求'
      )
    },
    {
      icon:
        'https://img.alicdn.com/imgextra/i4/O1CN01eKBs1G1aYgOqsknWh_!!6000000003342-2-tps-330-288.png',
      title: t('UI 自定义'),
      description: t(
        '提供可任意定制的布局系统，支持从简单的视图配置到布局模板研发的各类场景，支持从插件注入自定义视图'
      )
    }
  ];

  /**
   * 图标尺寸标准：600 * 192
   * 图标需要填充完整图片，无需预留边距，参考图片：https://img.alicdn.com/imgextra/i1/O1CN01fmecBk29AQ0Bj7uN3_!!6000000008027-2-tps-600-192.png
   */
  const companies = [
    {
      name: '阿里云',
      img:
        'https://img.alicdn.com/imgextra/i2/O1CN01RRW8Cb28yy42JRz3c_!!6000000008002-2-tps-369-108.png'
    },
    {
      name: '支付宝',
      img:
        'https://img.alicdn.com/imgextra/i4/O1CN017u9LRz1XAv2Q35ddE_!!6000000002884-2-tps-1373-406.png'
    },
    {
      name: '天猫',
      img:
        'https://img.alicdn.com/imgextra/i1/O1CN01hK7NHY1g7YdThPWng_!!6000000004095-2-tps-206-64.png'
    },
    {
      name: '淘宝',
      img:
        'https://img.alicdn.com/imgextra/i4/O1CN01v5ZFqf1loDbbkZCrV_!!6000000004865-2-tps-291-120.png'
    },
    {
      name: '斑马智行',
      img:
        'https://img.alicdn.com/imgextra/i1/O1CN01Kdo06P1EgXeCg89DD_!!6000000000381-2-tps-206-64.png'
    },
    {
      name: 'Gitlink',
      img:
        'https://img.alicdn.com/imgextra/i3/O1CN01aHVG7G1Cv51cjPujr_!!6000000000142-2-tps-600-192.png'
    },
    {
      name: '钉钉',
      img:
        'https://img.alicdn.com/imgextra/i1/O1CN01fmecBk29AQ0Bj7uN3_!!6000000008027-2-tps-600-192.png'
    },
    {
      name: 'CSDN',
      img:
        'https://img.alicdn.com/imgextra/i3/O1CN01vN9VGT24dCozGwuYo_!!6000000007413-2-tps-600-192.png'
    },
    {
      name: 'ByteDance',
      img:
        'https://img.alicdn.com/imgextra/i1/O1CN01vDP9lv1jaopFYqCGP_!!6000000004565-2-tps-600-192.png'
    },
    {
      name: '行云创新',
      img:
        'https://img.alicdn.com/imgextra/i2/O1CN01iUGF9A1GQdBaKE46F_!!6000000000617-2-tps-1138-392.png'
    }
  ];

  const cases = [
    {
      logo:
        'https://img.alicdn.com/imgextra/i2/O1CN01DVM7ow1njIZNWiUnK_!!6000000005125-2-tps-180-172.png',
      title: t('支付宝小程序开发工具'),
      description: t(
        '小程序开发者工具是支付宝开放平台打造的一站式小程序研发工具，提供了编码、调试、测试、上传、项目管理等功能。不仅支持开发支付宝小程序，相同代码还通用于蚂蚁开放生态，可直接发布至钉钉、高德等应用平台。'
      ),
      link: 'https://opendocs.alipay.com/mini/ide/overview',
      image:
        'https://img.alicdn.com/imgextra/i1/O1CN01BYqn4B219wcGGXHBS_!!6000000006943-2-tps-775-667.png'
    },
    {
      logo:
        'https://img.alicdn.com/imgextra/i1/O1CN01P04WYq1HV2XD2XhTP_!!6000000000762-2-tps-180-172.png',
      title: t('淘宝开发者工具'),
      link: 'https://miniapp-dev.taobao.com/',
      description: t(
        '开发者工具 IDE 是辅助淘宝开发者开发商家应用的本地开发工具，包含本地调试、代码编辑、真机预览、发布等功能，覆盖了应用开发的完整流程。'
      ),
      image:
        'https://img.alicdn.com/imgextra/i3/O1CN01goeVvb1w0iYnj95LL_!!6000000006246-2-tps-775-667.png'
    },
    {
      logo:
        'https://img.alicdn.com/imgextra/i2/O1CN01cBd8fD1tMIQC8kU7D_!!6000000005887-2-tps-200-200.png',
      title: t('Gitlink 开源代码托管平台'),
      link: 'https://www.gitlink.org.cn',
      description: t(
        'CCF Gitlink 开源代码托管平台使用基于 OpenSumi 的极速版 IDE 框架，将代码阅读、代码评审、WebIDE 浏览等交互进行升级，极大的提高了用户的使用效率。'
      ),
      image:
        'https://img.alicdn.com/imgextra/i4/O1CN01JSJl7d1yegP0B6ZLt_!!6000000006604-2-tps-775-667.png'
    }
  ];

  const bannerButtons = [
    {
      text: t('快速开始'),
      link: './docs/integrate/quick-start/web',
      type: 'primary'
    },
    {
      text: t('概览'),
      link: `/${i18n.language}/docs/integrate/overview`
    }
  ];

  return (
    <>
      <SEO title={t('OpenSumi')} lang={i18n.language} />
      <Banner
        coverImage={<BannerSVG />}
        logoUrl={logoUrl}
        title={t('OpenSumi')}
        description={t('一款帮助你快速搭建本地和云端 IDE 的框架。')}
        className="banner"
        buttons={bannerButtons}
      />
      <Cases cases={cases} />
      <Features title={t('能力特性')} features={features} />
      <Companies
        title={t('谁在使用？')}
        companies={companies}
        addMoreLink="https://github.com/opensumi/docs/edit/main/site/pages/index.zh.tsx#L56"
      />
    </>
  );
};

export default IndexPage;
