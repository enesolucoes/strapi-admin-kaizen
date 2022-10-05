import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { NavLink as Link } from 'react-router-dom';
import { Divider } from '@strapi/design-system/Divider';
import {
  MainNav,
  NavBrand,
  NavSections,
  NavLink,
  NavSection,
  NavUser,
  NavCondense,
} from '@strapi/design-system/MainNav';
import { FocusTrap } from '@strapi/design-system/FocusTrap';
import { Box } from '@strapi/design-system/Box';
import { Typography } from '@strapi/design-system/Typography';
import { Stack } from '@strapi/design-system/Stack';
import Write from  '@strapi/icons/Write';
import Users from '@strapi/icons/Users';
import Lock from '@strapi/icons/Lock';
import Exit from '@strapi/icons/Exit';
import { auth, usePersistentState, useAppInfos } from '@strapi/helper-plugin';
import useConfigurations from '../../hooks/useConfigurations';
import useModels from '../../content-manager/pages/App/useModels';

const LinkUserWrapper = styled(Box)`
  width: 9.375rem;
  position: absolute;
  bottom: ({ theme }) => theme.spaces[9];
  left: ({ theme }) => theme.spaces[5];
`;

const LinkUser = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-decoration: none;
  padding: ({ theme }) => theme.spaces[2] +' ' +theme.spaces[4];
  border-radius: ({ theme }) => theme.spaces[1];

  &:hover {
    background: ({ theme, logout }) =>
      logout ? theme.colors.danger100 : theme.colors.primary100;
    text-decoration: none;
  }

  svg {
    path {
      fill: ({ theme }) => theme.colors.danger600;
    }
  }
`;

const Container = styled.div`
  overflow: auto;
  height: calc(100% - 126px);
`

const ContainerDiv = styled.div`
  margin-top: -32px;
`

const LeftMenu = ({ generalSectionLinks, pluginsSectionLinks, setMenuCondensed }) => {
  const buttonRef = useRef();
  const [userLinksVisible, setUserLinksVisible] = useState(false);
  const { menuLogo } = useConfigurations();
  const [condensed, setCondensed] = usePersistentState('navbar-condensed', true);
  const { userDisplayName } = useAppInfos();
  const { formatMessage } = useIntl();
  const [menusUser, setMenusUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [permissaoMenu, setPermissaoMenu] = useState([]);
  const [plugins, setPlugins] = useState([]);
  const { useEffect } = require('react');
  const { LoadingIndicatorPage, request, useNotification } = require('@strapi/helper-plugin');
  const toggleNotification = useNotification();

  const { collectionTypeLinks } = useModels();

  useEffect(() => {

    ( async () => {
        try {
          setCondensed(true)
          const { email, id } = JSON.parse(sessionStorage.getItem('userInfo') || {});

          const data2 = await request('/content-manager/collection-types/api::usuario-permissao.usuario-permissao/?filters[$and][0][id_usuario][$eq]=' + id, { method: 'GET' });
          const result = data2.results[0]

          // sessionStorage.setItem('usuario-permissao', JSON.stringify(result));

          let data3 = null
          if (result && result.id_permissao) {
            data3 = await request('/content-manager/collection-types/api::permissao-menu.permissao-menu/?pageSize=1000&filters[$and][0][permissao][id][$eq]=' + result.id_permissao, { method: 'GET' });
            setPermissaoMenu(data3.results)
            // sessionStorage.setItem('permissaoMenu', JSON.stringify(data3.results));
          }

          let listPlugins = JSON.parse(sessionStorage.getItem('pluginsSectionLinks') || []);

          listPlugins = listPlugins.filter(item =>
            item.to !== '/plugins/upload' &&
            item.to !== '/plugins/permissoes'
          )

          const pluginsPermitidos = []
          listPlugins.map(item => {
            const itemsMenu = data3.results.filter(itemT => itemT.menu === item.intlLabel.defaultMessage)
            if(itemsMenu.length) {
              const itemFormatted = item.intlLabel.id.split('.')
              pluginsPermitidos.push(itemFormatted[0])
            }
          })


          if (!result) {
            toggleNotification({
              type: 'warning',
              lockTransition: true,
              message: user ? user.blocked ? ' usuário com perfil de acesso bloqueado.' : ' usuário sem papel de acesso vinculado.': ' usuário sem perfil de acesso cadastrado em Dados.',
            });
            return;
          }

          setPlugins(pluginsPermitidos)



        } catch (err) {
            toggleNotification({
            type: 'warning',
            lockTransition: true,
            message: ' verifique seu perfil de acesso cadastrado em Dados ou Configurações.'
          });
          console.error(err);

        } finally {
          setIsLoading(false);
        }
      }

    )();
  }, []);

  const arrrayMenu = plugins;

  const filteredPluginsSectionLinks = pluginsSectionLinks.filter(({to}) => arrrayMenu.includes(to.substring(9)));
  const filteredGeneralSectionLinks = menusUser.Configuracoes && menusUser.Configuracoes.Visualizar ? [generalSectionLinks[generalSectionLinks.length - 1]] : [];

  const initials = userDisplayName
    .split(' ')
    .map(name => name.substring(0, 1))
    .join('')
    .substring(0, 2);

  const handleToggleUserLinks = () => setUserLinksVisible(prev => !prev);

  const handleLogout = () => {
    auth.clearAppStorage();
    handleToggleUserLinks();
  };

  const handleBlur = e => {
    if (
      !e.currentTarget.contains(e.relatedTarget) &&
      e.relatedTarget?.parentElement?.id !== 'main-nav-user-button'
    ) {
      setUserLinksVisible(false);
    }
  };

  const menuTitle = formatMessage({
    id: 'app.components.LeftMenu.navbrand.title',
    defaultMessage: 'Strapi Dashboard',
  });

  if (isLoading) {
    return <LoadingIndicatorPage />;
  }


  // const hasData = permissaoMenu.filter(item => item.tipo === 'tabela' && item.listar === true && !item.aba)
  const hasPermissionUsers = permissaoMenu.filter(item => item.menu === 'Usuários' && item.listar === true)
  const hasPermission = permissaoMenu.filter(item => item.menu === 'Permissões' && item.listar === true)

  const collectionTypeLinksFiltered = collectionTypeLinks.filter((link) => {
    const linkName = link.name.split(".")

    const findLink2 = permissaoMenu && permissaoMenu.find(item => item.menu === linkName[1]);

    if(findLink2 && (findLink2.listar)) {
      return (findLink2)
    }
  });

  console.log('teste')

  return (
    <MainNav condensed={condensed}>
      <NavBrand
        workplace={formatMessage({
          id: 'app.components.LeftMenu.navbrand.workplace',
          defaultMessage: 'Workplace',
        })}
        title={menuTitle}
        icon={<img src={menuLogo} alt={menuTitle} />}
      />

      <Divider />
      <Container>
        <NavSections id="navsections">

          {collectionTypeLinksFiltered.length > 0 ? (
            <NavLink to="/content-manager" icon={<Write/>}>
              {formatMessage({id: 'content-manager.plugin.name', defaultMessage: 'Content manager'})}
            </NavLink>
          ) : <ContainerDiv />}


          {filteredPluginsSectionLinks.length > 0 ? (
          <NavSection label="Plugins">
            {filteredPluginsSectionLinks.map(link => {
              const Icon = link.icon;
              const hasAbas = permissaoMenu.filter(item => (item.menu === link.intlLabel.defaultMessage) && item.aba)

              if(hasAbas.length) {
                const canList = hasAbas.filter(item => item.listar)
                if (!canList.length) return null
              }
              return (
                <NavLink to={link.to} key={link.to} icon={<Icon />}>
                  {formatMessage(link.intlLabel)}
                </NavLink>
              );
            })}
          </NavSection>
        ) : null}

        {(hasPermissionUsers.length || hasPermission.length) ? (
          <NavSection label="Controle de acesso">
            {hasPermissionUsers.length ? <NavLink to="/settings/users" icon={<Users/>}>Usuários</NavLink>  : null}
            {hasPermission.length ? <NavLink to="/plugins/permissoes" icon={<Lock/>}>Permissões</NavLink>  : null}
          </NavSection>
        ) : null}
          {filteredGeneralSectionLinks.length > 0 ? (
            <NavSection label="General">
              {filteredGeneralSectionLinks.map(link => {
                const LinkIcon = link.icon;

                return (
                  <NavLink
                    badgeContent={
                      (link.notificationsCount > 0 && link.notificationsCount.toString()) || undefined
                    }
                    to={link.to}
                    key={link.to}
                    icon={<LinkIcon />}
                  >
                    {formatMessage(link.intlLabel)}
                  </NavLink>
                );
              })}
            </NavSection>
            ) : null}
        </NavSections>
      </Container>
      <NavUser
        id="main-nav-user-button"
        ref={buttonRef}
        onClick={handleToggleUserLinks}
        initials={initials}
        style={{ background: 'white' }}
      >
        {userDisplayName}
      </NavUser>
      {userLinksVisible && (
        <LinkUserWrapper
          onBlur={handleBlur}
          padding={1}
          shadow="tableShadow"
          background="neutral0"
          hasRadius
          style={{ background: 'white' }}
        >
          <FocusTrap onEscape={handleToggleUserLinks}>
            <Stack size={0}>
              <LinkUser tabIndex={0} onClick={handleToggleUserLinks} to="/me">
                <Typography>
                  {formatMessage({
                    id: 'app.components.LeftMenu.profile',
                    defaultMessage: 'Profile',
                  })}
                </Typography>
              </LinkUser>
              <LinkUser tabIndex={0} onClick={handleLogout} logout="logout" to="/auth/login">
                <Typography textColor="danger600">
                  {formatMessage({
                    id: 'app.components.LeftMenu.logout',
                    defaultMessage: 'Logout',
                  })}
                </Typography>
                <Exit />
              </LinkUser>
            </Stack>
          </FocusTrap>
        </LinkUserWrapper>
      )}

      <NavCondense onClick={() => {setCondensed(s => !s); setMenuCondensed(s => !s)}}>
        {condensed
          ? formatMessage({
              id: 'app.components.LeftMenu.expand',
              defaultMessage: 'Expand the navbar',
            })
          : formatMessage({
              id: 'app.components.LeftMenu.collapse',
              defaultMessage: 'Collapse the navbar',
            })}
      </NavCondense>
    </MainNav>
  );
};

LeftMenu.propTypes = {
  generalSectionLinks: PropTypes.array.isRequired,
  pluginsSectionLinks: PropTypes.array.isRequired,
};

export default LeftMenu;
