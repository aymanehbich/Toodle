import { useEffect, useState } from 'react';
import { confirmPasswordReset } from 'firebase/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Paper, PasswordInput, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { auth } from '@/firebase';

export const ResetPassword = () => {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      newPassword: '',
      confirmNewPassword: '',
      oobCode: '',
    },
    validate: {
      confirmNewPassword: (value, values) =>
        value !== values.newPassword ? 'Passwords did not match' : null,
    },
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('oobCode'); // Get the oobCode from the URL
    if (code) {
      form.setFieldValue('oobCode', code);
    } else {
      notifications.show({
        title: 'Invalid Request',
        message: 'Invalid or expired reset link.',
        color: 'red',
      });
      navigate('/');
    }
  }, [searchParams, navigate]);

  const handleResetPassword = async () => {
    const { newPassword, oobCode } = form.values;
    if (!oobCode) return;
    setLoading(true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      notifications.show({
        title: 'Password Reset Successful',
        message: 'You can now log in with your new password.',
        color: 'green',
      });
      navigate('/login');
    } catch (error: any) {
      notifications.show({
        title: 'Reset Failed',
        message: error.message || 'An error occurred. Please try again.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleResetPassword)}>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Text size="xl" fw={700} ta="center">
          Set a New Password
        </Text>
        <Text color="dimmed" size="sm" ta="center">
          Enter a new password to complete the reset process.
        </Text>
        <PasswordInput
          label="New Password"
          placeholder="Enter your new password"
          required
          mt="md"
          {...form.getInputProps('newPassword')}
        />
        <PasswordInput
          label="Confirm New Password"
          placeholder="Confirm your new password"
          required
          mt="md"
          {...form.getInputProps('confirmNewPassword')}
        />
        <Button fullWidth mt="xl" type="submit" loading={loading}>
          Reset Password
        </Button>
      </Paper>
    </form>
  );
};
