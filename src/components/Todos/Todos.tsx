import { useEffect, useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import {
  Affix,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  SimpleGrid,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { db } from '../../firebase';
import { Todo } from '../../types/Todos';
import { TodoItem } from './TodoItem';

export const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const [opened, { open, close }] = useDisclosure(false);
  const auth = getAuth();
  const userId = auth.currentUser!.uid;

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      todoTitle: '',
    },
  });

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        if (userId) {
          const q = query(collection(db, 'todos'), where('userId', '==', userId));
          const querySnapshot = await getDocs(q);
          const todosList: Todo[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Todo[];
          todosList.map((todo) => {
            console.log('ID', todo.id);
          });
          setTodos(todosList);
        }
      } catch (error) {
        console.error('Error fetching todos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, [userId]);

  const generateTodos = async () => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.error('User not authenticated');
      return;
    }
    const getRandomDate = () => {
      // Generate a random date between 2020-01-01 and now
      const start = new Date(2024, 12, 1).getTime();
      const end = new Date(2025, 2, 27).getTime();
      const randomTime = start + Math.random() * (end - start);
      return new Date(randomTime).toISOString();
    };

    const todosBatch = Array.from({ length: 10 }, (_, i) => {
      const newTodoId = uuidv4(); // Generate a new ID for each todo
      return {
        newTodoId,
        todoTitle: `Todo #${i + 1}`,
        completed: false,
        createdAt: getRandomDate(),
        userId: userId,
      };
    });

    try {
      for (const todo of todosBatch) {
        // Use newTodoId explicitly in the Firestore doc reference
        await setDoc(doc(db, 'todos', todo.newTodoId), todo);
      }
      console.log('✅ 50 Todos successfully added!');
    } catch (error) {
      console.error('❌ Error adding todos:', error);
    }
  };

  const handleAddTodo = async () => {
    const { todoTitle } = form.getValues();
    if (form.getValues().todoTitle.trim()) {
      const newTodoId = uuidv4();
      const newTodo: Todo = {
        id: newTodoId, // Explicitly set the ID
        todoTitle: todoTitle,
        completed: false,
        createdAt: new Date().toISOString(),
        userId: userId,
      };
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      form.setFieldValue('todoTitle', '');
      close();
      try {
        await setDoc(doc(db, 'todos', newTodoId), newTodo);
        showNotification({
          title: 'Todo Added',
          message: 'Your new todo was successfully added!',
          color: 'green',
        });
      } catch (error) {
        console.error('Error adding todo:', error);
        showNotification({
          title: 'Error',
          message: 'There was an error adding your todo.',
          color: 'red',
        });
      }
    }
  };

  if (loading) {
    return (
      <Center>
        <Loader size="md" />
      </Center>
    );
  }

  return (
    <>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 3 }} spacing="sm">
        {todos.length > 0 &&
          !loading &&
          todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
      </SimpleGrid>

      {todos.length === 0 && !loading && (
        <Text size="lg" ta="center">
          No todos found. Add a new one!
        </Text>
      )}

      <Affix position={{ bottom: 20, right: 20 }} zIndex={1}>
        <Button variant="filled" onClick={open} leftSection={<IconPlus />} size="lg">
          New
        </Button>
      </Affix>
      <Modal opened={opened} onClose={close} title="Add New Todo">
        <TextInput {...form.getInputProps('todoTitle')} placeholder="Enter your todo" autoFocus />
        <Group mt="md" grow>
          <Button variant="light" onClick={close}>
            Cancel
          </Button>
          <Button variant="filled" onClick={handleAddTodo}>
            Add Todo
          </Button>
        </Group>
      </Modal>
    </>
  );
};
