import React from 'react';
import { Box } from '@strapi/design-system/Box';
import { Flex } from '@strapi/design-system/Flex';
import { SkipToContent } from '@strapi/design-system/Main';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useIntl } from 'react-intl';

const FlexContainer = styled(Flex)`
  overflow: hidden;
`;

const FlexBox = styled(Box)`
  flex: 1;
`;

const ContainerSideNav = styled.div`
  position: fixed;
  position: fixed;
  height: 100%;
  background: white;
  z-index: 4;
`

const AppLayout = ({ children, sideNav, menuCondensed }) => {
  const { formatMessage } = useIntl();
  const margin =  menuCondensed ? '70px' : '230px'

  return (
    <Box background="neutral100">
      <SkipToContent>
        {formatMessage({ id: 'skipToContent', defaultMessage: 'Skip to content' })}
      </SkipToContent>
      <FlexContainer alignItems="flex-start" id="flex">
        <ContainerSideNav>{sideNav}</ContainerSideNav>
        <FlexBox style={{ marginLeft: margin, overflow: (window && window.location.pathname) === '/admin/settings/users' ? 'hidden' : 'auto' }}>{children}</FlexBox>
      </FlexContainer>
    </Box>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  sideNav: PropTypes.node.isRequired,
};

export default AppLayout;
