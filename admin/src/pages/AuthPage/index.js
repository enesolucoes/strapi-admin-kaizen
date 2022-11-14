import React, { useEffect, useReducer, useState } from 'react';
import axios from 'axios';
import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import omit from 'lodash/omit';
import { Redirect, useRouteMatch, useHistory } from 'react-router-dom';
import { auth, useQuery } from '@strapi/helper-plugin';
import PropTypes from 'prop-types';
import forms from 'ee_else_ce/pages/AuthPage/utils/forms';
import useLocalesProvider from '../../components/LocalesProvider/useLocalesProvider';
import formatAPIErrors from '../../utils/formatAPIErrors';
import init from './init';
import { initialState, reducer } from './reducer';

const AuthPage = ({ hasAdmin, setHasAdmin }) => {
  const { push } = useHistory();
  const [forceLogin, setForceLogin] = useState(false);
  const { changeLocale } = useLocalesProvider();
  const {
    params: { authType },
  } = useRouteMatch('/auth/:authType');
  const query = useQuery();
  const { Component, endPoint, fieldsToDisable, fieldsToOmit, inputsPrefix, schema, ...rest } = get(
    forms,
    authType,
    {}
  );
  const [{ formErrors, modifiedData, requestError }, dispatch] = useReducer(
    reducer,
    initialState,
    init
  );
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  useEffect(() => {
    // Cancel request on unmount
    return () => {
      source.cancel('Component unmounted');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset the state on navigation change
  useEffect(() => {
    dispatch({
      type: 'RESET_PROPS',
    });
  }, [authType]);

  const handleChange = ({ target: { name, value } }) => {
    dispatch({
      type: 'ON_CHANGE',
      keys: name,
      value,
    });
  };

  const handleSubmit = async (e, { setSubmitting, setErrors }) => {
    setSubmitting(true);
    const body = omit(e, fieldsToOmit);
    const requestURL = `/admin/${endPoint}`;

    if (authType === 'login') {
      await loginRequest(e, requestURL, { setSubmitting, setErrors });
    }

    if (authType === 'register' || authType === 'register-admin') {
      await registerRequest(e, requestURL, { setSubmitting, setErrors });
    }

    if (authType === 'forgot-password') {
      await forgotPasswordRequest(body, requestURL, { setSubmitting, setErrors });
    }

    if (authType === 'reset-password') {
      await resetPasswordRequest(body, requestURL, { setSubmitting, setErrors });
    }
  };

  const forgotPasswordRequest = async (body, requestURL, { setSubmitting, setErrors }) => {
    try {
      await axios({
        method: 'POST',
        url: `${strapi.backendURL}${requestURL}`,
        data: body,
        cancelToken: source.token,
      });

      push('/auth/forgot-password-success');
    } catch (err) {
      console.error(err);

      setErrors({ errorMessage: 'notification.error' });
    } finally {
      setSubmitting(false);
    }
  };

  const loginRequest = async (body, requestURL, { setSubmitting, setErrors }) => {
    try {
      const {
        data: {
          data: { token, user },
        },
      } = await axios({
        method: 'POST',
        url: `${strapi.backendURL}${requestURL}`,
        data: omit(body, fieldsToOmit),
        cancelToken: source.token,
      });

      let detais = null

      await axios.get(
        `https://kaizen-house-hml.enesolucoes.com.br/content-manager/collection-types/api::usuario-empresa.usuario-empresa?filters[$and][0][id_usuario][$eq]=${user.id}`,
        {headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json; charset=utf-8',
        }
      }).then(({ data }) => {
        detais = data.results
      })
      
      let detailsCompany = null

      if(detais.length) {
        await axios.get(
          `https://kaizen-house-hml.enesolucoes.com.br/content-manager/collection-types/api::empresa.empresa?filters[$and][0][id][$eq]=${detais[0].id_empresa}`,
          {headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
          }
        }).then(({ data }) => {
          detailsCompany = data.results
        })

        // SALVAR NO LOCALSTORAGE

        const data = {
          "softwareId": detailsCompany[0].id_software,
          "enterpriseId": detailsCompany[0].id_login,
          "licenseAccessedId": user.id.toString(),
          "token": token,
          "dateExpiresToken": "2022-12-07 19:12:00",
          "forceUpdate": forceLogin 
        }

        await axios.post(
          'https://sistema-login-kaizen.herokuapp.com/enterprises/license-access', data
          ).then(() => {
            if (user.preferedLanguage) {
              changeLocale(user.preferedLanguage);
            }

            sessionStorage.setItem("company", detailsCompany[0]);
      
            auth.setToken(token, body.rememberMe);
            auth.setUserInfo(user, body.rememberMe);
      
            push('/');
          }).catch((err) => {
            if (err.response) {
              const error1 = get(
                err,
                ['response', 'data', 'message'],
                null
              );

              setForceLogin(true)

              const error2 = get(
                err,
                ['response', 'data', 'error', 'message'],
                'Something went wrong'
              );

      
              const errorMessage = error1 || error2;

              if (camelCase(errorMessage).toLowerCase() === 'usernotactive') {
                push('/auth/oops');
      
                dispatch({
                  type: 'RESET_PROPS',
                });
      
                return;
              }
      
              setErrors({ errorMessage });
            }
          })
      }
    } catch (err) {
      if (err.response) {
        const errorMessage = get(
          err,
          ['response', 'data', 'error', 'message'],
          'Something went wrong'
        );

        if (camelCase(errorMessage).toLowerCase() === 'usernotactive') {
          push('/auth/oops');

          dispatch({
            type: 'RESET_PROPS',
          });

          return;
        }

        setErrors({ errorMessage });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const registerRequest = async (body, requestURL, { setSubmitting, setErrors }) => {
    try {
      const {
        data: {
          data: { token, user },
        },
      } = await axios({
        method: 'POST',
        url: `${strapi.backendURL}${requestURL}`,
        data: omit(body, fieldsToOmit),
        cancelToken: source.token,
      });

      auth.setToken(token, false);
      auth.setUserInfo(user, false);

      if (
        (authType === 'register' && body.userInfo.news === true) ||
        (authType === 'register-admin' && body.news === true)
      ) {
        axios({
          method: 'POST',
          url: 'https://analytics.strapi.io/register',
          data: {
            email: user.email,
            username: user.firstname,
            firstAdmin: !hasAdmin,
          },
          cancelToken: source.token,
        });
      }
      // Redirect to the homePage
      setSubmitting(false);
      setHasAdmin(true);
      push('/');
    } catch (err) {
      if (err.response) {
        const { data } = err.response;
        const apiErrors = formatAPIErrors(data);

        setErrors({ apiErrors });
      }
    }
  };

  const resetPasswordRequest = async (body, requestURL, { setErrors, setSubmitting }) => {
    try {
      const {
        data: {
          data: { token, user },
        },
      } = await axios({
        method: 'POST',
        url: `${strapi.backendURL}${requestURL}`,
        data: { ...body, resetPasswordToken: query.get('code') },
        cancelToken: source.token,
      });

      auth.setToken(token, false);
      auth.setUserInfo(user, false);

      // Redirect to the homePage
      push('/');
    } catch (err) {
      if (err.response) {
        const errorMessage = get(err, ['response', 'data', 'message'], 'Something went wrong');
        const errorStatus = get(err, ['response', 'data', 'statusCode'], 400);

        dispatch({
          type: 'SET_REQUEST_ERROR',
          errorMessage,
          errorStatus,
        });
        setErrors({ errorMessage });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Redirect the user to the login page if
  // the endpoint does not exist or
  // there is already an admin user oo
  // the user is already logged in
  if (!forms[authType] || (hasAdmin && authType === 'register-admin') || auth.getToken()) {
    return <Redirect to="/" />;
  }

  // Redirect the user to the register-admin if it is the first user
  if (!hasAdmin && authType !== 'register-admin') {
    return <Redirect to="/auth/register-admin" />;
  }

  return (
    <Component
      {...rest}
      fieldsToDisable={fieldsToDisable}
      formErrors={formErrors}
      inputsPrefix={inputsPrefix}
      modifiedData={modifiedData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      requestError={requestError}
      schema={schema}
      forceLogin={forceLogin}
    />
  );
};

AuthPage.defaultProps = {
  hasAdmin: false,
};

AuthPage.propTypes = {
  hasAdmin: PropTypes.bool,
  setHasAdmin: PropTypes.func.isRequired,
};

export default AuthPage;
