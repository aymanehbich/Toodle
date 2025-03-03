import { Link } from 'react-router-dom';
import { Anchor, Container, Text } from '@mantine/core';
import { ResetPassword } from '@/components/Auth/ResetPassword';

export const ResetPasswordPage = () => {
  return (
    <Container size={600} my={40}>
      {/* <Title ta="center" mb="lg">
        Welcome to login page
      </Title> */}
      <ResetPassword />
      <Text c="dimmed" size="sm" ta="center" mt={20}>
        {/* Already have an account?{' '} */}
        <Anchor size="sm" component={Link} to="/register">
          Get back to login
        </Anchor>
      </Text>
    </Container>
  );
};
