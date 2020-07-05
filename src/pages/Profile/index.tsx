import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useRef, useEffect } from 'react';
import { FormContext, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
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
  const { user } = useAuth();

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
      old_password: yup.string(),
      password: yup.string().when('old_password', {
        is: (val) => !!val.length,
        then: yup.string().required(),
        otherwise: yup.string,
      }),
      password_confirmation: yup
        .string()
        .when('old_password', {
          is: (val) => !!val.length,
          then: yup.string().required(),
          otherwise: yup.string,
        })
        .oneOf([yup.ref('password'), null], 'Confirmação incorreta'),
    }),
  });

  const { handleSubmit, watch, setValue } = methods;

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

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
              />

              <Button onPress={() => {}}>Confirmar mudanças</Button>
            </Container>
          </FormContext>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default SignIn;
