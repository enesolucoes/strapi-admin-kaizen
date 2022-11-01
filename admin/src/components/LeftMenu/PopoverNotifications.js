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

const ReminderNotication = ({ factory_name, front_name, equipment_name, summary_reminder_notification }) => {

  return (
    <ContainerNot>
      <ContainerTitle>
        <img style={{ width: '35px' }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAADAUlEQVRoge2Zu2sUURTGfytqiM9E8JG1sPBBiqhoApIUgk3AjQ+wFAVRbGwNCPEfsFHYQgtjY6MQtFCRVQhYCG7cCKIQFWKwCGpQUbNrIhZxLe65zLg7E3cz994ZYT+4zHLmzPnON/cxZ++FBiJhCzAEfJI2BGyNNaMFYDtQBMoVrSj3/hvcQyV+G0gDG4FbYrsfY151Q/dGm8+2TmylWDKqEX1AAfgB5PGGUiW0fUR8C0DGUY7/RB/Vc0G3bp9f9zx+iRAzikrmLNAKnAYmxTYHXJQ2J7ZJ8WmVZ8rAU+dZB0DPh+U+2zIgS/Wbz8o9jRV4q1nsKKCS6Ucl1gNcAaapFjIt93rEt58E9UiG8LGfB45Iy4f4/Ab2O886BBnUW50BxoALQEeAX4fcGxPfERIkIghdwGCAPQvsdZxLJIR9Rz6KfcNCgi6KklGSYFvIbiCHWpG+AXct80XGTuABqrT4AjwETgKzhK9alYg0tExgE8HfBd10lZuW34kQ0gUMo4ZJCbgjrYwqxVuA9cBVvIT9VW4bCRCyjeA/RLrt8PmuITzh2IUMClEOWCst50tsZYV/YoW8FaJOn61znsScCllch29aruM+23iQo6CAqpWcoB4hzXL1l9VFwhPeExLHqcAghA0JU2iUKNAQkjwkUcgpYKlNAtuT/RJqNdN/g1fZIrItBFSZ80J4HmFpxLgQAqrwnBCuozYIXAkBOC5cwzaCuxTSIlwzQMp0cJdCAL4LX0stzklcfjWa5PrLdGCXPbJZuD7X+kBSe+SgXJ/YCO6qR1LAS+E6YYPAlZDDwvMVtStvHK6E6KOIc7YISkJg5S0JDgnHB/4+9DGKN1Rv+5hECngmHGcscQBwTUgGLMU/IPEngCWWOADoFaIpzA+vZuCVxD9mOHYgHgvZTczWQJcl7iiOvm3tqH1fLSZqzzQB1/EKRFvzLxD78Aq6KeA8sIvaRa1G7VAOAO8lziwxnRe24w2zqO056nwlVvSiNrdfow55akn8J/AOuIGqqYzMiT+RzDI13BdEYgAAAABJRU5ErkJggg==" />
        <TitleRed>Lembrete de validação</TitleRed>
      </ContainerTitle>
      <p>{factory_name} - {front_name} - {equipment_name}</p>
      <p>
        <SpanBold>Parada: </SpanBold>{get(summary_reminder_notification, 'stop_date', '00/00/00 - 00:00')}
        <SpanBold> Retorno: </SpanBold>{get(summary_reminder_notification, 'return_date', '00/00/00 - 00:00')}
      </p>
      <ContainerButton>
        <ButtonStyled>Alterar</ButtonStyled>
        <ButtonOk>Ok, Manter</ButtonOk>
      </ContainerButton>
    </ContainerNot>
  );
};

const BreakingNotification = ({
  factory_name,
  front_name,
  equipment_name,
  updater_user,
  summary_update_notification,
  updated_at
}) => {

  return (
    <ContainerNot>
      <Title>Atualização de tempos - {updated_at}</Title>
      <Author>Inserido por {get(updater_user, 'firstname')}&nbsp;{get(updater_user, 'lastname')}</Author>
      <p>{factory_name} - {front_name} - {equipment_name}</p>
      <p>Não parada - {get(summary_update_notification, 'date', '00/00/00 - 00:00')} - Tempo de carregamento: {get(summary_update_notification, 'duration', '00:00')}</p>
      <p>Motivo: {get(summary_update_notification, 'reason')}</p>
      <ContainerButton>
        <ButtonStyled>Concluído</ButtonStyled>
      </ContainerButton>
    </ContainerNot>
  );
};


const WrapperNotification = ({
 content = {},
 isLoading,
 noContentLayout,
 requestNotifications
}) => {
  const data = get(content, 'data', []);
  function renderListNotifications() {
    return data.map(notification => {
      const isBreakingNotification = get(notification, 'notification_type', '').toLowerCase() === 'atualizacao';
      const pickContent = omit(notification, [isBreakingNotification ? 'summary_reminder_notification' : 'summary_update_notification']);

      return isBreakingNotification
        ? <BreakingNotification key={notification.notification_id} {...pickContent}/>
        : <ReminderNotication key={notification.notification_id} {...pickContent}/>
    });
  }

  return (
    <WrapperContentNotification color="neutral800" padding={4} background="neutral0">
      { (isLoading && !data.length)
        ? <Flex justifyContent="center" paddingTop={112}><Loader /></Flex>
        : !data.length
          ? noContentLayout
          :
            <>
              {renderListNotifications()}
              <LoadMoreButton variant="secondary" startIcon={<Refresh />} isLoading={isLoading} onClick={requestNotifications}>Buscar mais</LoadMoreButton>
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

  useEffect(() => {
    (requestNotifications)();
  }, [tab]);

  function verifyFetchingReminders(content) {
    return (!tab && get(content, 'data.isNextPage', false) && !get(content, 'data.data', []).length);
  }

  async function requestNotifications() {
    try {
      !isLoading && toggleLoading();
      const type = tab ? 'closed' : 'open';
      const page = !get(content, 'data.length', 0) && !verifyFetchingReminders(content) ?  1 : get(content, 'data.currentPage', 0) + 1;
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
    } finally {
      toggleLoading();
    }
  }

  function toggleLoading() { setIsLoading(prev => !prev); }

  const noContentLayout = (
    <EmptyStateLayout
      content={`Você não possui notificações ${tab ? 'concluídas' : 'em aberto'}!`}
      hasRadius
      icon={<EmptyDocuments width="10rem" />}
      shadow="tableShadow"
      action={<Button variant="secondary" startIcon={<Refresh />} onClick={requestNotifications}>Recarregar</Button>}
    />
  );

  const commonProps = { content, isLoading, noContentLayout, requestNotifications };

  return (
    <Portal>
      <FocusTrap onEscape={onDismiss}>
        <DismissibleLayer onEscapeKeyDown={onDismiss} onPointerDownOutside={onDismiss}>
        <Popover id="notifications" role="janela de diálogo suspensa" aria-modal={true}>
          <TabGroupStyled
            id="tabs"
            label="Abas de notificações"
            onTabChange={setTab}
          >
            <Tabs>
              <Tab>Abertas</Tab>
              <Tab>Concluídas</Tab>
            </Tabs>
            <TabPanels>
              <TabPanel>
                {tab === 0 && <WrapperNotification {...commonProps}/>}
              </TabPanel>
              <TabPanel>
                {tab === 1 && <WrapperNotification {...commonProps}/>}
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
