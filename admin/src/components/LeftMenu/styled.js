import styled from 'styled-components'
import { Box } from '@strapi/design-system/Box';
import { Button } from '@strapi/design-system/Button';
import { NavLink as Link } from 'react-router-dom';
import { TabGroup } from '@strapi/design-system/Tabs';
import {
  NavLink
} from '@strapi/design-system/MainNav';

export const LinkUserWrapper = styled(Box)`
  width: 9.375rem;
  position: absolute;
  bottom: ({ theme }) => theme.spaces[9];
  left: ({ theme }) => theme.spaces[5];
`;

export const LinkUser = styled(Link)`
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

export const Container = styled.div`
  overflow: auto;
  height: calc(100% - 126px);
`

export const ContainerDiv = styled.div`
  margin-top: -32px;
`

export const TabGroupStyled = styled(TabGroup)`
  background: #f6f6f9;
`

export const Popover = styled.div`
  position: absolute; 
  z-index: 999; 
  width: 500px; 
  height: 400px;
  background: white;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
  top: 80px;
  left: 68px;
  box-shadow: 0 1px 6px #d4d4d4;
`

export const NavLinkStyled = styled(NavLink)`
  background: #fff !important;
`

export const ContainerNot = styled.div`
  border: 0 1 0 0; 
  line-height: 1.8;
  border-bottom: 1px;
  border-color: #eeeeee;
  border-style: solid;
  font-size: 14px;
  margin-bottom: 8px;
`

export const Title = styled.p`
  font-weight: bold;
`

export const Author = styled.p`
  font-size: 13px; 
  color: gray; 
  margin: -6px auto 6px;
`

export const ContainerButton = styled.div`
  width: 100%; 
  display: flex; 
  margin-top: 8px; 
  margin-bottom: 8px; 
  justify-content: end;
`

export const ButtonStyled = styled(Button)`
  padding: 4px 8px; 
  background: #80a5e1; 
  border: 0;
  &:hover {
    padding: 4px 8px !important; 
    border: 0;
  }
`

export const SpanBold = styled.span`
  font-weight: bold;
`

export const ContainerTitle = styled.div`
  display: flex;
  align-items: center;
`

export const TitleRed = styled.p`
  font-weight: bold;
  color: red;
  margin-left: 8px;
`

export const ButtonOk = styled(Button)`
  padding: 4px 8px;
  margin-left: 8px;
  background: #80a5e1;
  border: 0;
  margin-right: 16px;
  &:hover {
    padding: 4px 8px !important; 
    border: 0;
  }
`