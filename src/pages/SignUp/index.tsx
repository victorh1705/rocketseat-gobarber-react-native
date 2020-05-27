import React, { useCallback, useRef } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import { FormContext, useForm } from 'react-hook-form';
import * as yup from 'yup';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';

import logoImg from '../../assets/logo.png';

import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

const SignUp = () => {
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  const methods = useForm({
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required(),
    }),
  });
  const { handleSubmit, watch, errors } = methods;

  const onSubmit = useCallback(
    async (data) => {
      try {
        const { email, name, password } = data;

        console.log('form cadastro', watch());

        await api.post('users', { name, email, password });
        navigation.goBack();
      } catch (e) {
        console.log('Erro cadastro', e);
      }
    },
    [Alert, api],
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
                <Title>Crie sua conta</Title>
              </View>

              <Input
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
              />

              <Input
                ref={emailRef}
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
                textContentType="newPassword"
              />

              <Button onPress={() => handleSubmit(onSubmit)()}>Entrar</Button>
            </Container>
          </FormContext>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignIn>
    </>
  );
};

export default SignUp;
