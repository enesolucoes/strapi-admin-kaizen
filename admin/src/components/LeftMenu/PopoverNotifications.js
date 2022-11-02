import React, { useEffect, useState } from 'react';
import { Box } from '@strapi/design-system/Box';
import { Tabs, Tab, TabPanels, TabPanel } from '@strapi/design-system/Tabs';
import { EmptyStateLayout } from '@strapi/design-system/EmptyStateLayout';
import { Button } from '@strapi/design-system/Button';
import get from 'lodash/get';
import omit from 'lodash/omit';
import EmptyDocuments from '@strapi/icons/EmptyDocuments';
import Refresh from '@strapi/icons/Refresh';
import { DismissibleLayer } from './DismissibleLayer';
import { FocusTrap } from '@strapi/design-system/FocusTrap';
import { Portal } from '@strapi/design-system/Portal';
import { Loader } from '@strapi/design-system/Loader';
import { Flex } from '@strapi/design-system/Flex';
import { useHistory } from 'react-router-dom';
import { useNotification } from '@strapi/helper-plugin';

import {
  TabGroupStyled,
  Popover,
  ContainerNot,
  Title,
  Author,
  ContainerButton,
  ButtonStyled,
  SpanBold,
  ContainerTitle,
  TitleRed,
  ButtonOk,
  WrapperContentNotification,
  LoadMoreButton
} from './styled'
import { backInstance } from '../../services/backendInstance';

const ReminderNotication = ({
  notification_id,
  factory_name,
  front_name,
  equipment_name,
  summary_reminder_notification,
  dispatchAction,
  isOpenedTab
}) => {
  const [loading, setLoading] = useState(false);
  ///TODO: Temporário
  const { push } = useHistory();
  const stopDate = get(summary_reminder_notification, 'stop_date', '00/00/00 - 00:00');
  const returnDate = get(summary_reminder_notification, 'return_date', '00/00/00 - 00:00');

  function toggleLoading() { setLoading(prev => !prev); }

  function handleClick() {
    dispatchAction && dispatchAction(notification_id, toggleLoading)
  }

  function handleClickEdit() {
    push('/plugins/controle-frentes');
  }

  return (
    <ContainerNot>
      <ContainerTitle>
        <img style={{ width: '35px' }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAADAUlEQVRoge2Zu2sUURTGfytqiM9E8JG1sPBBiqhoApIUgk3AjQ+wFAVRbGwNCPEfsFHYQgtjY6MQtFCRVQhYCG7cCKIQFWKwCGpQUbNrIhZxLe65zLg7E3cz994ZYT+4zHLmzPnON/cxZ++FBiJhCzAEfJI2BGyNNaMFYDtQBMoVrSj3/hvcQyV+G0gDG4FbYrsfY151Q/dGm8+2TmylWDKqEX1AAfgB5PGGUiW0fUR8C0DGUY7/RB/Vc0G3bp9f9zx+iRAzikrmLNAKnAYmxTYHXJQ2J7ZJ8WmVZ8rAU+dZB0DPh+U+2zIgS/Wbz8o9jRV4q1nsKKCS6Ucl1gNcAaapFjIt93rEt58E9UiG8LGfB45Iy4f4/Ab2O886BBnUW50BxoALQEeAX4fcGxPfERIkIghdwGCAPQvsdZxLJIR9Rz6KfcNCgi6KklGSYFvIbiCHWpG+AXct80XGTuABqrT4AjwETgKzhK9alYg0tExgE8HfBd10lZuW34kQ0gUMo4ZJCbgjrYwqxVuA9cBVvIT9VW4bCRCyjeA/RLrt8PmuITzh2IUMClEOWCst50tsZYV/YoW8FaJOn61znsScCllch29aruM+23iQo6CAqpWcoB4hzXL1l9VFwhPeExLHqcAghA0JU2iUKNAQkjwkUcgpYKlNAtuT/RJqNdN/g1fZIrItBFSZ80J4HmFpxLgQAqrwnBCuozYIXAkBOC5cwzaCuxTSIlwzQMp0cJdCAL4LX0stzklcfjWa5PrLdGCXPbJZuD7X+kBSe+SgXJ/YCO6qR1LAS+E6YYPAlZDDwvMVtStvHK6E6KOIc7YISkJg5S0JDgnHB/4+9DGKN1Rv+5hECngmHGcscQBwTUgGLMU/IPEngCWWOADoFaIpzA+vZuCVxD9mOHYgHgvZTczWQJcl7iiOvm3tqH1fLSZqzzQB1/EKRFvzLxD78Aq6KeA8sIvaRa1G7VAOAO8lziwxnRe24w2zqO056nwlVvSiNrdfow55akn8J/AOuIGqqYzMiT+RzDI13BdEYgAAAABJRU5ErkJggg==" />
        <TitleRed>Lembrete de validação</TitleRed>
      </ContainerTitle>
      <details open={isOpenedTab}>
        <summary>{factory_name} - {front_name} - {equipment_name}</summary>
        <p>
          <SpanBold>Parada: </SpanBold> <time dateTime={stopDate}>{stopDate}</time> &nbsp;
          <SpanBold>Retorno: </SpanBold> <time dateTime={stopDate}>{returnDate}</time>
        </p>
      </details>
      {
        isOpenedTab && (
          <ContainerButton>
            <ButtonStyled disabled={loading} onClick={handleClickEdit}>Alterar</ButtonStyled>
            <ButtonOk onClick={handleClick} loading={loading}>Ok, manter</ButtonOk>
          </ContainerButton>
        )
      }

    </ContainerNot>
  );
};

const BreakingNotification = ({
  notification_id,
  factory_name,
  front_name,
  equipment_name,
  updater_user,
  summary_update_notification,
  updated_at,
  dispatchAction,
  isOpenedTab
}) => {
  const [loading, setLoading] = useState(false);
  const nonStop = get(summary_update_notification, 'date', '00/00/00 - 00:00');

  function toggleLoading() { setLoading(prev => !prev); }

  function handleClick() {
    dispatchAction && dispatchAction(notification_id, toggleLoading)
  }
  return (
    <ContainerNot>
      <Title>Atualização de tempos - {updated_at}</Title>
      <Author>Inserido por {get(updater_user, 'firstname')}&nbsp;{get(updater_user, 'lastname')}</Author>
      <details open={isOpenedTab}>
        <summary>{factory_name} - {front_name} - {equipment_name}</summary>
        <p>
          <SpanBold>Não parada </SpanBold>
          <time dateTime={nonStop}> - {nonStop}</time> - <SpanBold>Tempo de carregamento: </SpanBold>
          <time>{get(summary_update_notification, 'duration', '00:00')}</time>
        </p>
        <p> <SpanBold>Motivo: </SpanBold>{get(summary_update_notification, 'reason')}</p>
      </details>
      {
        isOpenedTab && (
          <ContainerButton>
            <ButtonStyled onClick={handleClick} loading={loading}>Concluído</ButtonStyled>
          </ContainerButton>
        )
      }
    </ContainerNot>
  );
};


const WrapperNotification = ({
 content = {},
 isLoading,
 noContentLayout,
 requestNotifications,
 dispatchAction,
 isOpenedTab
}) => {
  const data = get(content, 'data', []);
  const total = get(content, 'total', []);
  const pageSize = get(content, 'pageSize', 0);

  function renderListNotifications() {
    return data.map(notification => {
      const isBreakingNotification = get(notification, 'notification_type', '').toLowerCase() === 'atualizacao';
      const pickContent = Object.assign({
          isOpenedTab,
          total,
          key: notification.notification_id,
          dispatchAction
        },
        omit(notification, [isBreakingNotification ? 'summary_reminder_notification' : 'summary_update_notification'])
      );
      const Component = isBreakingNotification ? BreakingNotification : ReminderNotication;

      return <Component {...pickContent}/>
    });
  }
  const { length } = data;
  return (
    <WrapperContentNotification color="neutral800" padding={4} background="neutral0">
      { (isLoading && !length)
        ? <Flex justifyContent="center" paddingTop={10}><Loader/></Flex>
        : !length
          ? noContentLayout
          :
            <>
              {renderListNotifications()}
              {((total !== length) && (length >= pageSize)) && (
                <LoadMoreButton
                  variant="secondary"
                  startIcon={<Refresh/>}
                  loading={isLoading}
                  onClick={requestNotifications}
                >
                  Buscar mais
                </LoadMoreButton>
              )}
            </>
      }
    </WrapperContentNotification>
  );
}

const PopoverNotifications = ({ onDismiss = () => {}}) => {
  const [tab, setTab] = useState(0);
  const [content, setContent] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { id } = JSON.parse(sessionStorage.getItem('userInfo') || {});
  const toggleNotification = useNotification();

  useEffect(() => {
    (requestNotifications)();
  }, [tab]);

  function verifyFetchingReminders(content) {
    return (!tab && get(content, 'isNextPage', false) && !get(content, 'data', []).length);
  }

  async function requestNotifications() {
    try {
      !isLoading && toggleLoading();
      const type = tab ? 'closed' : 'open';
      const page = !get(content, 'data.length', 0) && !verifyFetchingReminders(content) ?  1 : get(content, 'currentPage') + 1;
      const response = await backInstance.get(`/notifications/${type}?page=${page}&pageSize=10&userId=${id}`);
      const isRemindersFar = verifyFetchingReminders(response);

      if (response.data) {
        setContent(response.data);
      }

      if (isRemindersFar) {
        requestNotifications();
      }

    } catch (err) {
      console.error(err);
      toggleNotification({
        type: 'warning',
        lockTransition: false,
        message: `\t\t ao obter as notificações ${tab ? 'abertas' : 'concluídas'}.`
      });
    } finally {
      toggleLoading();
    }
  }

  async function requestActionNotification(notificationId, toggleLoading = () => {}) {

    const message = '\t\t ao concluir a notificação!';

    try {
      toggleLoading();
      const response = await backInstance.post(`/notifications/${notificationId}/close?&userId=${id}`);
      if (response.status == 200) {
        setContent(prev => {
          const data = prev.data.filter(({ notification_id }) => notification_id !== notificationId);
          delete prev['data'];
          return Object.assign({ data }, prev);
        });

        toggleNotification({type: 'success', message});
      }
    } catch (err) {
      console.error(err);
      toggleNotification({type: 'warning', message});
    } finally {
      toggleLoading();
    }
  }

  function toggleLoading() { setIsLoading(prev => !prev); }

  function toggleTab(tabbing) {
    setContent({});
    setTab(tabbing)
  }

  const noContentLayout = (
    <EmptyStateLayout
      content={`Você não possui notificações ${tab ? 'concluídas' : 'em aberto'}!`}
      hasRadius
      icon={<EmptyDocuments width="10rem" />}
      shadow="tableShadow"
      action={<Button variant="secondary" startIcon={<Refresh />} onClick={requestNotifications}>Recarregar</Button>}
    />
  );

  const commonProps = { content, isLoading, noContentLayout, requestNotifications, dispatchAction: requestActionNotification, isOpenedTab: !tab };

  return (
    <Portal>
      <FocusTrap onEscape={onDismiss}>
        <DismissibleLayer onEscapeKeyDown={onDismiss} onPointerDownOutside={onDismiss}>
        <Popover id="notifications" role="janela de diálogo suspensa" aria-modal={true}>
          <TabGroupStyled
            id="tabs"
            label="Abas de notificações"
            onTabChange={toggleTab}
          >
            <Tabs>
              <Tab>Abertas</Tab>
              <Tab>Concluídas</Tab>
            </Tabs>
            <TabPanels>
              <TabPanel>
                {!tab && <WrapperNotification {...commonProps}/>}
              </TabPanel>
              <TabPanel>
                {tab && <WrapperNotification {...commonProps}/>}
              </TabPanel>
            </TabPanels>
          </TabGroupStyled>
          </Popover>
        </DismissibleLayer>
      </FocusTrap>
    </Portal>
  );
};

export default PopoverNotifications;
