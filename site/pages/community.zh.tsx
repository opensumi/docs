import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Communities from '@opensumi/gatsby-theme/site/components/Communities';

const CommunityPage: React.FC & { noLayout: boolean } = () => {
  const query = graphql`
    query CommunityQuery {
      site {
        siteMetadata {
          showDingTalkQRCode
          showWeChatQRCode
          weChatQRCode
          dingTalkQRCode
        }
      }
    }
  `;
  const { site } = useStaticQuery(query);
  const {
    showDingTalkQRCode,
    showWeChatQRCode,
    weChatQRCode,
    dingTalkQRCode
  } = site.siteMetadata;
  return (
    <Communities
      showDingTalkQRCode={showDingTalkQRCode}
      showWeChatQRCode={showWeChatQRCode}
      weChatQRCode={weChatQRCode}
      dingTalkQRCode={dingTalkQRCode}
    />
  );
};

CommunityPage.noLayout = true;

export default CommunityPage;
