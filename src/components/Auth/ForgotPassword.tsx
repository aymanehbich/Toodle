import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Button, Paper, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { auth } from '@/firebase';

interface Credentials {
  email: string;
}

export const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<Credentials>({
    initialValues: {
      email: '',
    },
  });

  const handleForgotPassword = async () => {
    const { email } = form.values;

    if (!email) {
      form.setFieldError('email', 'Please enter your email to reset the password.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      notifications.show({
        title: 'Success',
        message: 'Password reset email sent! Check your inbox.',
        color: 'green',
        autoClose: 3000,
        position: 'top-right',
      });
    } catch (error: any) {
      notifications.show({
        title: 'Reset Failed',
        message: error.message || 'An error occurred. Please try again.',
        color: 'red',
        autoClose: 3000,
        position: 'bottom-right',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleForgotPassword)}>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Text size="xl" fw={700} ta="center" mb="sm">
          Forgot Your Password?
        </Text>
        <Text color="dimmed" size="sm" ta="center" mb="md">
          Enter your email and we will send you a link to reset your password.
        </Text>
        <TextInput label="Email" placeholder="Enter your email" {...form.getInputProps('email')} />

        <Button fullWidth mt="xl" type="submit" loading={loading}>
          {loading ? 'Sending...' : 'Send email'}
        </Button>
      </Paper>
    </form>
  );
};
