import { useState } from 'react';
import { AuthErrorCodes, signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import {
  Anchor,
  Button,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { auth } from '@/firebase';
import { signInWithGoogle } from '@/utils/authUtils';
import { FacebookButton } from './ui/Facebook';
import { GoogleButton } from './ui/Google';

interface Credentials {
  email: string;
  password: string;
}
export const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<Credentials>({
    initialValues: {
      email: 'aymenfreelancer1@gmail.com',
      password: '1234567',
    },
  });
  const handleSubmit = async () => {
    const { email, password } = form.values;
    setLoading(true);
    try {
      // Register the user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Success notification
      notifications.show({
        title: 'Login Successful',
        message: `Welcome ${user.email}!`,
        color: 'green',
        autoClose: 3000,
        position: 'bottom-right',
      });
      navigate('/dashboard');
      console.log(user);
    } catch (error: any) {
      if (error.code === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
        form.setFieldError('email', 'Invalid credentials. Please check your email and password.');
        form.setFieldError(
          'password',
          'Invalid credentials. Please check your email and password.'
        );
      } else if (error.code === AuthErrorCodes.USER_DELETED) {
        form.setFieldError('email', 'No user found with this email.');
      } else if (error.code === AuthErrorCodes.INVALID_PASSWORD) {
        form.setFieldError('password', 'The password is incorrect.');
      } else {
        notifications.show({
          title: 'Login Failed',
          message: 'An unexpected error occurred. Please try again later.',
          color: 'red',
          autoClose: 3000,
          position: 'top-right',
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      console.log('User logged in:', user);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Title order={2} fw={700} ta="center">
          Welcome to Toodle, login with
        </Title>
        <Group grow mt="md">
          <GoogleButton radius="sm" onClick={handleGoogleSignIn}>
            Google
          </GoogleButton>
          <FacebookButton radius="sm">Facebook</FacebookButton>
        </Group>
        <Divider label="Or continue with email" labelPosition="center" my="lg" />
        <TextInput label="Email" placeholder="Enter your email" {...form.getInputProps('email')} />
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          mt="md"
          {...form.getInputProps('password')}
        />
        <Group mt="sm">
          <Anchor component={Link} to={'/forgot-password'} size="sm">
            Forgot password?
          </Anchor>
        </Group>
        <Button fullWidth mt="xl" type="submit" loading={loading}>
          Sign in
        </Button>
      </Paper>
    </form>
  );
};
