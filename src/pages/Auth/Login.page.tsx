import { Link } from 'react-router-dom';
import { Anchor, Container, Text } from '@mantine/core';
import { Login } from '@/components/Auth/Login';

export const LoginPage = () => {
  return (
    <Container size={600} my={40}>
      <Login />
      <Text c="dimmed" size="sm" ta="center" mt={20}>
        You don't have an account?{' '}
        <Anchor size="sm" component={Link} to="/register">
          Register
        </Anchor>
      </Text>
    </Container>
  );
};
