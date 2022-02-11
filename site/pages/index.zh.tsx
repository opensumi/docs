import React from 'react';
import SEO from '@opensumi/gatsby-theme/site/components/Seo';
import Banner from '@opensumi/gatsby-theme/site/components/Banner';
import Companies from '@opensumi/gatsby-theme/site/components/Companies';
import Cases from '@opensumi/gatsby-theme/site/components/Cases';
import { useTranslation } from 'react-i18next';
import * as styles from './index.module.less';

const IndexPage = () => {
  const { t, i18n } = useTranslation();

  const features = [
    {
      icon:
        'https://img.alicdn.com/imgextra/i3/O1CN0140IdnX24Qq0oD3O6D_!!6000000007386-55-tps-110-96.svg',
      title: t('轻松集成'),
      description: t(
        '提供面向容器场景、Electron场景和纯前端场景的快速集成解决方案，助力业务快速落地'
      )
    },
    {
      icon:
        'https://img.alicdn.com/imgextra/i1/O1CN01DI01U51FiCcmAl2jI_!!6000000000520-55-tps-110-96.svg',
      title: t('高拓展性'),
      description: t(
        '提供从 VS Code 插件、OpenSumi 插件到 OpenSumi 模块三层业务解决方案，完美支持业务定制需求'
      )
    },
    {
      icon:
        'https://img.alicdn.com/imgextra/i1/O1CN018xokXu1iJ7nSUexNY_!!6000000004391-55-tps-110-96.svg',
      title: t('UI 自定义'),
      description: t(
        '提供可任意定制的布局系统，支持从简单的视图配置到布局模板研发的各类场景，支持从插件注入自定义视图'
      )
    }
  ];

  const companies = [
    {
      name: '阿里云',
      img:
        'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*Z1NnQ6L4xCIAAAAAAAAAAABkARQnAQ'
    },
    {
      name: '支付宝',
      img:
        'https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*6u3hTpsd7h8AAAAAAAAAAABkARQnAQ'
    },
    {
      name: '天猫',
      img:
        'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*BQrxRK6oemMAAAAAAAAAAABkARQnAQ'
    },
    {
      name: '淘宝',
      img:
        'https://gw.alipayobjects.com/mdn/rms_2274c3/afts/img/A*1l8-TqUr7UcAAAAAAAAAAABkARQnAQ'
    }
  ];

  const cases = [
    {
      logo:
        'https://img.alicdn.com/imgextra/i2/O1CN01DVM7ow1njIZNWiUnK_!!6000000005125-2-tps-180-172.png',
      title: t('支付宝小程序开发工具'),
      description: t(
        '小程序开发者工具是支付宝开放平台打造的一站式小程序研发工具，提供了编码、调试、测试、上传、项目管理等功能。不仅支持开发支付宝小程序，相同代码还通用于蚂蚁开放生态，可直接发布至淘宝、钉钉、高德等应用平台。'
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

  const imageUrl =
    i18n.language === 'en'
      ? 'https://img.alicdn.com/imgextra/i4/O1CN01bwaFlJ21FRNN2f63C_!!6000000006955-2-tps-3321-2049.png'
      : 'https://img.alicdn.com/imgextra/i4/O1CN01bwaFlJ21FRNN2f63C_!!6000000006955-2-tps-3321-2049.png';

  return (
    <>
      <SEO title={t('OpenSumi')} lang={i18n.language} />
      <Banner
        coverImage={<img className={styles.coverImage} src={imageUrl} />}
        title={t('OpenSumi')}
        description={t('一款帮助你快速搭建本地和云端 IDE 的框架')}
        className={styles.banner}
        buttons={bannerButtons}
        showGithubStars={true}
        notifications={[]}
      />
      <div className={styles.titleBlock}>
        <span className={styles.productCase}>Product Case</span>
        <span className={styles.productCasePrev}>产品案例</span>
      </div>
      <Cases className={styles.caseBlock} cases={cases} />
      <Features features={features} />
      <Companies title={t('合作公司')} companies={companies} />
    </>
  );
};

interface FeaturesProps {
  features: IFeature[];
}

interface IFeature {
  icon: string;
  title: string;
  description: string;
}

const Features: React.FC<FeaturesProps> = React.memo(({ features }) => {
  return (
    <>
      <div className={styles.titleBlock}>
        <span className={styles.capabilityCharacteristics}>
          Capability characteristics
        </span>
        <span className={styles.capabilityCharacteristicsPrev}>能力特性</span>
      </div>
      <section className={styles.features}>
        <div className="container">
          <div className={styles.feature_row}>
            {features.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
});

const Feature: React.FC<IFeature> = React.memo(
  ({ icon, title, description }) => {
    return (
      <div className={styles.feature}>
        <div className="text--center">
          <img className={styles.featureImage} src={icon} alt={title} />
        </div>
        <div className={styles.featureWrap}>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    );
  }
);

export default IndexPage;
