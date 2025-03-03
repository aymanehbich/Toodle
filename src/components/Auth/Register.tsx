import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button, Divider, Group, Paper, PasswordInput, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { defaultTodos } from '@/constants/Todos';
import { auth, db } from '@/firebase';
import { signUpWithGoogle } from '@/utils/authUtils';
import { FacebookButton } from './ui/Facebook';
import { GoogleButton } from './ui/Google';

interface Credentials {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<Credentials>({
    mode: 'uncontrolled',
    initialValues: {
      full_name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      full_name: (value) => (!value ? 'Full name is required' : null),
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email format'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords did not match' : null,
    },
  });
  const handleSubmit = async (values: Credentials) => {
    const { email, password, full_name } = values;
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);
      user.reload();
      await updateProfile(user, { displayName: full_name });

      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          fullName: full_name,
          uid: user.uid,
          email: email,
          createdAt: new Date(),
        },
        { merge: true }
      );
      console.log('User saved to Firestore');
      // Assign unique IDs to each default todo
      const todosWithIds = defaultTodos.map((todo) => ({
        ...todo,
        id: uuidv4(), // Generate a unique ID for each todo
        userId: user.uid,
        createdAt: new Date().toISOString(),
      }));

      // Save each todo to Firestore with its unique ID
      const todoPromises = todosWithIds.map((todo) => setDoc(doc(db, 'todos', todo.id), todo));
      await Promise.all(todoPromises);

      console.log('✅ Default todos added successfully!');

      notifications.show({
        title: 'Registration Successful',
        message: `Welcome ${user.email}!`,
        color: 'green',
        autoClose: 3000,
        position: 'bottom-right',
      });

      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      notifications.show({
        title: 'Registration Failed',
        message: error.message || 'An unexpected error occurred.',
        color: 'red',
        autoClose: 3000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const user = await signUpWithGoogle();
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // New user detected, saving user and todos to Firestore
        console.log('New user detected, saving user and todos to Firestore...');

        // Save user to Firestore
        await setDoc(
          userRef,
          {
            fullName: user.displayName,
            uid: user.uid,
            email: user.email,
            createdAt: new Date(),
          },
          { merge: true }
        );
        console.log('User saved to Firestore');

        // Create todos with unique IDs for the new user
        const todosWithIds = defaultTodos.map((todo) => ({
          ...todo,
          id: uuidv4(),
          userId: user.uid,
          createdAt: new Date().toISOString(),
        }));

        // Save todos to Firestore
        console.log('Saving todos to Firestore...');
        const todoPromises = todosWithIds.map(async (todo) => {
          try {
            await setDoc(doc(db, 'todos', todo.id), todo);
            console.log(`✅ Todo added: ${todo.todoTitle}`);
          } catch (err) {
            console.error(`❌ Failed to add todo: ${todo.todoTitle}`, err);
          }
        });
        await Promise.all(todoPromises); // Ensure todos are saved before continuing
        console.log('✅ All todos added successfully!');
      } else {
        // User already exists in Firestore, skipping todo creation
        console.log('Existing user detected, no new todos created.');
      }

      // Notifications for successful sign-in
      // notifications.show({
      //   title: 'Google Sign-In Successful',
      //   message: `Welcome ${user.displayName || user.email}!`,
      //   color: 'green',
      //   autoClose: 3000,
      //   position: 'bottom-right',
      // });
      notifications.show({
        title: 'Todos Created',
        message: 'Your default todos have been created successfully!',
        color: 'green',
        autoClose: 3000,
        position: 'bottom-right',
      });

      // Now that todos are created, navigate to the dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Paper withBorder shadow="md" p={30} radius="md">
        <Text size="xl" fw={700} ta="center">
          Welcome to Mantine, register with
        </Text>
        <Group grow mt="md">
          <GoogleButton radius="sm" onClick={handleGoogleRegister}>
            Google
          </GoogleButton>
          <FacebookButton radius="sm">Facebook</FacebookButton>
        </Group>
        <Divider label="Or continue with email" labelPosition="center" my="lg" />
        <Group grow>
          <TextInput
            label="Full Name"
            placeholder="Enter your Full Name"
            required
            {...form.getInputProps('full_name')}
          />
        </Group>

        <TextInput
          label="Email"
          placeholder="Enter your email"
          required
          {...form.getInputProps('email')}
        />
        <Group grow>
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            required
            mt="md"
            {...form.getInputProps('password')}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            mt="md"
            {...form.getInputProps('confirmPassword')}
          />
        </Group>

        <Button fullWidth mt="xl" type="submit" loading={loading}>
          Sign up
        </Button>
      </Paper>
    </form>
  );
};
