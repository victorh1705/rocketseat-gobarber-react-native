import React, { useCallback, useRef } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';

import { FormContext, useForm } from 'react-hook-form';

import {
  Container,
  CreateAccountButton,
  CreateAccountButtonText,
  ForgotPassword,
  ForgotPasswordText,
  Title,
} from './styles';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import SignUp from '../SignUp';
import { useAuth } from '../../hooks/AuthContext';

const SignIn = () => {
  const navigation = useNavigation();
  const passwordRef = useRef<TextInput>(null);

  const { signIn } = useAuth();

  const methods = useForm({
    validationSchema: yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().required(),
    }),
  });
  const { handleSubmit, errors } = methods;

  const onSubmit = useCallback(
    async (data) => {
      const { password, email } = data;

      try {
        console.log('antes');
        await signIn({ email, password });
        Alert.alert('Form Data', JSON.stringify(data));
      } catch (e) {
        console.log('erro requisição:', e);
      }
    },
    [Alert, signIn],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <FormContext {...methods}>
            <Container>
              <Image source={logoImg} />

              <View>
                <Title>Faça seu Logon</Title>
              </View>

              <Input
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                keyboardType="email-address"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              <Input
                ref={passwordRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={handleSubmit(onSubmit)}
              />

              <Button onPress={() => handleSubmit(onSubmit)()}>Entrar</Button>

              <ForgotPassword>
                <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
              </ForgotPassword>
            </Container>
          </FormContext>
        </ScrollView>
      </KeyboardAvoidingView>

      <CreateAccountButton
        onPress={() => {
          navigation.navigate('SignUp');
        }}
      >
        <Icon name="log-in" size={20} color="#ff9000" />
        <CreateAccountButtonText>Criar conta</CreateAccountButtonText>
      </CreateAccountButton>
    </>
  );
};

export default SignIn;
