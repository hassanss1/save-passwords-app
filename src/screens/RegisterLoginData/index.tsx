import React from 'react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
// Creating form with React Hook Form
import { useForm } from 'react-hook-form';
import { RFValue } from 'react-native-responsive-fontsize';
// Form validation
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// Locally storing data
import AsyncStorage from '@react-native-async-storage/async-storage';
// Generating unique id
import uuid from 'react-native-uuid';

import { Header } from '../../components/Header';
import { Input } from '../../components/Form/Input';
import { Button } from '../../components/Form/Button';

import { Container, Form } from './styles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface FormData {
  service_name: string;
  email: string;
  password: string;
}

const schema = Yup.object().shape({
  service_name: Yup.string().required('Nome do serviço é obrigatório!'),
  email: Yup.string()
    .email('Não é um email válido')
    .required('Email é obrigatório!'),
  password: Yup.string().required('Senha é obrigatória!'),
});

type RootStackParamList = {
  Home: undefined;
  RegisterLoginData: undefined;
};

type NavigationProps = StackNavigationProp<
  RootStackParamList,
  'RegisterLoginData'
>;

export function RegisterLoginData() {
  const { navigate } = useNavigation<NavigationProps>();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigation = useNavigation();

  async function handleRegister(formData: FormData) {
    const newLoginData = {
      id: String(uuid.v4()),
      ...formData,
    };

    const dataKey = '@savepass:logins';

    // Save data on AsyncStorage and navigate to 'Home' screen
    const data = await AsyncStorage.getItem(dataKey);
    const oldLoginData = data ? JSON.parse(data) : [];

    const compiledLoginData = [...oldLoginData, newLoginData];
    try {
      await AsyncStorage.setItem(dataKey, JSON.stringify(compiledLoginData));
      navigation.navigate('Home');
      reset();
    } catch (error) {
      throw new Error(error);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled
    >
      <Header />
      <Container>
        <Form>
          <Input
            testID='service-name-input'
            title='Nome do serviço'
            name='service_name'
            error={errors.service_name && errors.service_name.message}
            control={control}
            autoCapitalize='sentences'
            autoCorrect
          />
          <Input
            testID='email-input'
            title='E-mail ou usuário'
            name='email'
            error={
              // Replace here with real content
              errors.email && errors.email.message
            }
            control={control}
            autoCorrect={false}
            autoCapitalize='none'
            keyboardType='email-address'
          />
          <Input
            testID='password-input'
            title='Senha'
            name='password'
            error={
              // Replace here with real content
              errors.password && errors.password.message
            }
            control={control}
            secureTextEntry
          />

          <Button
            style={{
              marginTop: RFValue(8),
            }}
            title='Salvar'
            onPress={handleSubmit(handleRegister)}
          />
        </Form>
      </Container>
    </KeyboardAvoidingView>
  );
}
