import type {FormikErrors, FormikHelpers} from 'formik';
import {Field, Formik} from 'formik';
import {FC, useState} from 'react';
import {useRef} from 'react';
import {Image, View} from 'react-native';
import {createStyles} from './styles';
import type {FormValues, LoginProps} from './types';
import validationSchema from './validationSchema';
import {Button, Container, LoadingOverlay, Text, Title} from '../../components';
import {useThemedStyles} from '../../hooks';
import {ErrorFeedback, PasswordField, TextField} from '../../forms/fields';
import loginLogo from '../../assets/images/logo.png';
import {useSessionStore} from '../../state/session/slice.ts';
import {useLogin} from '../../state/session/actions.tsx';
import {users} from '../../constans/users.ts';
import BooleanButtons from '../../components/BooleanButtons';
import {SpeedDial} from '@rneui/themed';
import {
  UserAccountIcon,
  UserIcon,
  UserListIcon,
  UserSwitchIcon,
} from '../../assets/icons';
import colors from '../../theme/base/colors.ts';

const initialValues: FormValues = {username: '', password: ''};

const Login: FC<LoginProps> = () => {
  const [styles] = useThemedStyles(createStyles);
  const [open, setOpen] = useState(false);

  const [userId, setUserId] = useState<number | undefined>(undefined);
  const {status} = useSessionStore();
  const {login} = useLogin();
  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>,
  ) => {
    await login(values.username, values.password);
    actions.resetForm({values});
    actions.setStatus({isSubmitted: true});
  };

  const handleAutoComplete = async (
    setFieldValue: (
      field: string,
      value: any,
      shouldValidate?: boolean | undefined,
    ) => Promise<void | FormikErrors<FormValues>>,
    id: number,
  ) => {
    const user = users[id - 1];
    console.log(id, user.id, user.email);
    await setFieldValue('username', user.email, false);
    await setFieldValue('password', `${user.password}`, false);:
  };

  const usernameRef = useRef();
  const passwordRef = useRef();

  return (
    <Container accessibilityLabel="view-login-container">
      {status.isFetching && <LoadingOverlay />}
      <View style={styles.image}>
        <Image source={loginLogo} style={styles.logo} />
      </View>
      <Title style={styles.title}>Inicio de sessión</Title>
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validateOnMount
        validationSchema={validationSchema}>
        {({submitForm, dirty, status: state, setFieldValue}) => (
          <View style={styles.content}>
            <View style={styles.content}>
              <Field
                accessibilityLabel="txt-login-username"
                component={TextField}
                name="username"
                config={{
                  placeholder: 'Ingrese su email',
                  label: 'Email',
                  returnKeyType: 'next',
                  keyboardType: 'email-address',
                }}
                innerRef={usernameRef}
                nextInnerRef={passwordRef}
              />
              <Field
                accessibilityLabel="txt-login-password"
                component={PasswordField}
                name="password"
                config={{
                  placeholder: 'Ingrese contraseña',
                  label: 'Contraseña',
                }}
                innerRef={passwordRef}
              />
            </View>
            {!dirty && state?.isSubmitted && status.errorMessage && (
              <ErrorFeedback config={{label: status.errorMessage}} />
            )}

            <View style={styles.buttonContainer}>
              <Button
                onPress={submitForm}
                title="Ingresar"
                accessibilityLabel="btn-login-submit"
                buttonStyle={styles.button}
              />
            </View>
            <SpeedDial
              buttonStyle={{
                backgroundColor: colors.brandSecondary,
              }}
              isOpen={open}
              icon={<UserListIcon color={colors.white} />}
              openIcon={<UserSwitchIcon color={colors.white} />}
              onOpen={() => setOpen(!open)}
              onClose={() => setOpen(!open)}>
              {users.map((user, index) => (
                <SpeedDial.Action
                  key={index.toString()}
                  icon={<UserIcon color={colors.white} />}
                  title={user.rol}
                  onPress={() =>
                    handleAutoComplete(setFieldValue, Number(user.id))
                  }
                />
              ))}
            </SpeedDial>
          </View>
        )}
      </Formik>
    </Container>
  );
};

export default Login;

/*
* import * as React from "react";
import { value ButtonGroup } from "@rneui/base";

export default () => {
  const [
    selectedIndex,
    setSelectedIndex
  ] = React.useState(1);
  const [
    selectedIndexes,
    setSelectedIndexes
  ] = React.useState([]);
  return (
    <ButtonGroup
      buttonStyle={{ width: 100 }}
      buttonContainerStyle={{}}
      buttons={[
        "Hello",
        "World",
        "React",
        "Native",
        "Elements"
      ]}
      containerStyle={{}}
      disabledStyle={{}}
      disabledTextStyle={{}}
      disabledSelectedStyle={{}}
      disabledSelectedTextStyle={{}}
      innerBorderStyle={{}}
      onPress={selectedIdx =>
        setSelectedIndex(selectedIdx)
      }
      selectedButtonStyle={{}}
      selectedIndex={selectedIndex}
      selectedIndexes={selectedIndexes}
      selectedTextStyle={{}}
      textStyle={{}}
      vertical
    />
  );
}*/
