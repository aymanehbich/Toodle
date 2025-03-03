import { Link } from 'react-router-dom';
import { Anchor, Container, Text } from '@mantine/core';
import { ForgotPassword } from '@/components/Auth/ForgotPassword';

export const ForgotPasswordPage = () => {
  return (
    <Container size={600} my={40}>
      {/* <Title ta="center" mb="lg">
        Welcome to login page
      </Title> */}
      <ForgotPassword />
      <Text c="dimmed" size="sm" ta="center" mt={20}>
        {/* Already have an account?{' '} */}
        <Anchor size="sm" component={Link} to="/login">
          Get back to login
        </Anchor>
      </Text>
    </Container>
  );
};
