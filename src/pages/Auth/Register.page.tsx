import { Link } from 'react-router-dom';
import { Anchor, Container, Text } from '@mantine/core';
import { Register } from '@/components/Auth/Register';

export const RegisterPage = () => {
  return (
    <Container size={700} my={20}>
      {/* <Title ta="center" mb="lg">
        Welcome to the register page
      </Title> */}
      <Register />
      <Text c="dimmed" size="sm" ta="center" mt={20}>
        Already have an account?{' '}
        <Anchor size="sm" component={Link} to="/login">
          Login
        </Anchor>
      </Text>
    </Container>
  );
};
