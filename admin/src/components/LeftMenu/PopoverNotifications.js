import React from 'react';
import { Box } from '@strapi/design-system/Box';
import { Tabs, Tab, TabPanels, TabPanel } from '@strapi/design-system/Tabs';
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
  ButtonOk
} from './styled'


const PopoverNotifications = () => {
  return (
    <Popover id="notification">
      <TabGroupStyled
        label="Some stuff for the label" 
        id="tabs" 
        onTabChange={selected => console.log(selected)}
      >
        <Tabs>
          <Tab>Abertas</Tab>
          <Tab>Concluídas</Tab>
          <Tab>Histórico</Tab>
        </Tabs>
        <TabPanels>
          <TabPanel>
            <Box color="neutral800" padding={4} background="neutral0">
              <ContainerNot>
                <Title>Atualização de tempos - 06/10/2022 as 13:30h</Title>
                <Author>Inserido por Murillo Medeiros</Author>
                <p>Ivinhema - Frente 06 - COL-02004048</p>
                <p>Não parada - 06/10/2022 14:00 - Tempo de carregamento: 00:30</p>
                <p>Motivo: </p>
                <ContainerButton>
                  <ButtonStyled>Concluído</ButtonStyled>
                </ContainerButton>
              </ContainerNot>

              <ContainerNot>
                <ContainerTitle>
                  <img style={{ width: '35px' }} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAADAUlEQVRoge2Zu2sUURTGfytqiM9E8JG1sPBBiqhoApIUgk3AjQ+wFAVRbGwNCPEfsFHYQgtjY6MQtFCRVQhYCG7cCKIQFWKwCGpQUbNrIhZxLe65zLg7E3cz994ZYT+4zHLmzPnON/cxZ++FBiJhCzAEfJI2BGyNNaMFYDtQBMoVrSj3/hvcQyV+G0gDG4FbYrsfY151Q/dGm8+2TmylWDKqEX1AAfgB5PGGUiW0fUR8C0DGUY7/RB/Vc0G3bp9f9zx+iRAzikrmLNAKnAYmxTYHXJQ2J7ZJ8WmVZ8rAU+dZB0DPh+U+2zIgS/Wbz8o9jRV4q1nsKKCS6Ucl1gNcAaapFjIt93rEt58E9UiG8LGfB45Iy4f4/Ab2O886BBnUW50BxoALQEeAX4fcGxPfERIkIghdwGCAPQvsdZxLJIR9Rz6KfcNCgi6KklGSYFvIbiCHWpG+AXct80XGTuABqrT4AjwETgKzhK9alYg0tExgE8HfBd10lZuW34kQ0gUMo4ZJCbgjrYwqxVuA9cBVvIT9VW4bCRCyjeA/RLrt8PmuITzh2IUMClEOWCst50tsZYV/YoW8FaJOn61znsScCllch29aruM+23iQo6CAqpWcoB4hzXL1l9VFwhPeExLHqcAghA0JU2iUKNAQkjwkUcgpYKlNAtuT/RJqNdN/g1fZIrItBFSZ80J4HmFpxLgQAqrwnBCuozYIXAkBOC5cwzaCuxTSIlwzQMp0cJdCAL4LX0stzklcfjWa5PrLdGCXPbJZuD7X+kBSe+SgXJ/YCO6qR1LAS+E6YYPAlZDDwvMVtStvHK6E6KOIc7YISkJg5S0JDgnHB/4+9DGKN1Rv+5hECngmHGcscQBwTUgGLMU/IPEngCWWOADoFaIpzA+vZuCVxD9mOHYgHgvZTczWQJcl7iiOvm3tqH1fLSZqzzQB1/EKRFvzLxD78Aq6KeA8sIvaRa1G7VAOAO8lziwxnRe24w2zqO056nwlVvSiNrdfow55akn8J/AOuIGqqYzMiT+RzDI13BdEYgAAAABJRU5ErkJggg==" />
                  <TitleRed>Lembrete de validação</TitleRed>
                </ContainerTitle>
                <p>Ivinhema - Frente 06 - COL-02004048</p>
                <p>
                  <SpanBold>Parada: </SpanBold>06/10/2022 15:00
                  <SpanBold> Retorno: </SpanBold>06/10/2022 16:00
                </p>
                <ContainerButton>
                  <ButtonStyled>Alterar</ButtonStyled>
                  <ButtonOk>Ok, Manter</ButtonOk>
                </ContainerButton>
              </ContainerNot>
            </Box>
          </TabPanel>
          <TabPanel>
            <Box color="neutral800" padding={4} background="neutral0">
              Second panel
            </Box>
          </TabPanel>
          <TabPanel>
            <Box color="neutral800" padding={4} background="neutral0">
              Third panel
            </Box>
          </TabPanel>
          <TabPanel>
            <Box color="neutral800" padding={4} background="neutral0">
              Todas
            </Box>
          </TabPanel>
        </TabPanels>
      </TabGroupStyled>
    </Popover>
  );
};

export default PopoverNotifications;
