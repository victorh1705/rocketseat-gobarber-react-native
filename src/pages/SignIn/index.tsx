import React from 'react';

import logoImg from '../../assets/logo.png'
import { Image } from 'react-native';

import { Container, Title } from './styles';

const SignIn = () => {
  return <Container>
    <Image source={logoImg} />

    <Title>Faça seu Login</Title>
  </Container>;
};

export default SignIn;
