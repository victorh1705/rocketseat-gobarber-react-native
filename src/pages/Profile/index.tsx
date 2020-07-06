import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
  Alert,
} from 'react-native';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';

import api from '../../services/api';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/AuthContext';
import {
  Container,
  Title,
  BackButton,
  UserAvatarButton,
  UserAvatar,
} from './styles';

interface FormInputs {
  name: string;
  email: string;
  old_password: string | null;
  password: string | null;
  password_confirmation: string | null;
}

const SignIn = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();

  const emailRef = useRef<TextInput>(null);
  const oldPasswordRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const passwordConfirmationRef = useRef<TextInput>(null);

  const methods = useForm<FormInputs>({
    defaultValues: {
      name: user.name,
      email: user.email,
      old_password: null,
      password: null,
      password_confirmation: null,
    },
    validationSchema: yup.object().shape({
      name: yup.string(),
      email: yup.string(),
      // old_password: yup.string(),
      // password: yup.string().when('old_password', {
      //   is: (val) => !!val.length,
      //   then: yup.string().required(),
      //   otherwise: yup.string,
      // }),
      // password_confirmation: yup
      //   .string()
      //   .when('old_password', {
      //     is: (val) => !!val.length,
      //     then: yup.string().required(),
      //     otherwise: yup.string,
      //   })
      //   .oneOf([yup.ref('password'), undefined], 'Confirmação incorreta'),
    }),
  });

  const { handleSubmit, errors } = methods;

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onSubmit = useCallback(
    async (data) => {
      const {
        name,
        email,
        old_password,
        password,
        password_confirmation,
      } = data;

      const formData = {
        name,
        email,
        ...(old_password
          ? {
              old_password,
              password,
              password_confirmation,
            }
          : {}),
      };

      console.log('envou os dados: ', { name, email });

      try {
        const response = await api.put('profile', formData);

        // await updateUser(userUpdated);
        console.log('usuario atualizado : ', response.data);

        Alert.alert('Perfil atualizado com sucesso!');

        navigation.goBack();
      } catch (e) {
        console.log(e);
        Alert.alert('Erro no cadastro', 'Erro ao fazer cadastro');
      }
    },
    [navigation],
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
          contentContainerStyle={{ flex: 0 }}
        >
          <FormContext {...methods}>
            <Container>
              <BackButton onPress={handleGoBack}>
                <Icon name="chevron-left" size={24} color="#999591" />
              </BackButton>

              <UserAvatarButton>
                <UserAvatar source={{ uri: user.avatar_url }} />
              </UserAvatarButton>

              <View>
                <Title>Meu Perfil</Title>
              </View>

              <Input
                autoCorrect={false}
                autoCapitalize="words"
                name="name"
                icon="user"
                placeholder="Nome"
                defaultValue={user.name}
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
                defaultValue={user.email}
                returnKeyType="next"
                onSubmitEditing={() => oldPasswordRef.current?.focus()}
              />

              <Input
                ref={oldPasswordRef}
                name="old_password"
                icon="lock"
                placeholder="Senha Atual"
                secureTextEntry
                returnKeyType="next"
                containerStyle={{ marginTop: 16 }}
                onSubmitEditing={() => passwordConfirmationRef.current?.focus()}
              />
              <Input
                ref={passwordRef}
                name="password"
                icon="lock"
                placeholder="Nova Senha"
                secureTextEntry
                returnKeyType="next"
                onSubmitEditing={() => passwordConfirmationRef.current?.focus()}
              />
              <Input
                ref={passwordConfirmationRef}
                name="password_confirmation"
                icon="lock"
                placeholder="Confirmar Senha"
                secureTextEntry
                returnKeyType="send"
                containerStyle={{ marginBottom: 32 }}
                onSubmitEditing={handleSubmit(onSubmit)}
              />

              <Button onPress={() => handleSubmit(onSubmit)()}>
                Atualizar usuário
              </Button>
            </Container>
          </FormContext>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignIn;
