import { memo, useState } from 'react';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Modal,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { db } from '@/firebase';
import { Todo } from '../../types/Todos';

export const TodoItem = memo(({ todo }: { todo: Todo }) => {
  const form = useForm({
    mode: 'controlled',
    initialValues: {
      todoTitle: todo.todoTitle,
      completed: todo.completed,
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const status = form.values.completed ? 'Completed' : 'Pending';
  const todoRef = doc(db, 'todos', todo.id);

  const handleSaveTitle = async () => {
    setIsEditing(false);
    if (form.values.todoTitle === todo.todoTitle) return; // Verify if changed
    try {
      await updateDoc(todoRef, { todoTitle: form.values.todoTitle });
      showNotification({
        title: 'Todo Updated',
        message: 'Your todo title has been updated!',
        color: 'blue',
      });
    } catch (error) {
      showNotification({
        title: 'Error',
        message: 'There was an error updating your todo.',
        color: 'red',
      });
    }
  };

  const toggleCompletionStatus = async () => {
    const { completed } = form.values;
    const newStatus = !completed;
    form.setFieldValue('completed', newStatus);
    try {
      await updateDoc(todoRef, { completed: newStatus });
      showNotification({
        title: 'Status Updated',
        message: newStatus ? 'Marked as completed.' : 'Marked as pending.',
        color: 'blue',
      });
    } catch (error) {
      form.setFieldValue('completed', !newStatus);
      showNotification({
        title: 'Error',
        message: 'There was an error updating the status.',
        color: 'red',
      });
    }
  };

  // Move handleDelete logic here
  const handleDelete = async () => {
    try {
      setIsDeleted(true); // Optimistically update UI
      close(); // Close the delete confirmation modal
      await deleteDoc(todoRef); // Delete from Firestore
      showNotification({
        title: 'Todo Deleted',
        message: 'Your todo has been deleted successfully.',
        color: 'green',
      });
    } catch (error) {
      setIsDeleted(false); // Rollback UI change if there's an error
      showNotification({
        title: 'Error',
        message: 'There was an error deleting your todo.',
        color: 'red',
      });
    }
  };

  if (isDeleted) return null; // Don't render the component if deleted

  return (
    <>
      <Card withBorder padding="xs">
        <Group wrap="nowrap" justify="space-between" pb="sm">
          <Badge
            variant="dot"
            size="sm"
            color={form.values.completed ? 'green' : 'orange'}
            style={{ cursor: 'pointer' }}
            onClick={toggleCompletionStatus}
          >
            {status}
          </Badge>

          <Group gap={4}>
            <ActionIcon
              title="Edit todo"
              variant="white"
              aria-label="Edit todo"
              onClick={() => setIsEditing(true)}
            >
              <IconPencil size={20} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              title="Delete todo"
              color="red"
              variant="white"
              aria-label="Delete todo"
              onClick={open}
            >
              <IconTrash size={20} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Group>

        <Divider />

        {isEditing ? (
          <TextInput
            {...form.getInputProps('todoTitle')}
            onBlur={handleSaveTitle}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveTitle();
            }}
            pt="sm"
            size="sm"
          />
        ) : (
          <Text pt="sm" size="md" lineClamp={1}>
            {form.values.todoTitle}
          </Text>
        )}
      </Card>

      <Modal title="Confirm Deletion" opened={opened} onClose={close}>
        <Text>Are you sure you want to delete this todo?</Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </>
  );
});
