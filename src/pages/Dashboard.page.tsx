import { Card, Text, Title } from "@mantine/core";
import TodoChart from "@/components/Todos/TodoChart";

// const TodoChart = React.lazy(() => import('@/components/Todos/TodoChart'));

export const DashboardPage = () => {
  return (
    <>
      <Title ta="center" c="dark.7" order={1}>
        Welcome to your Dashboard
      </Title>
      <Text ta="center" c="dimmed" size="lg" mt="sm">
        Here you can manage and track your tasks, get insights and more!
      </Text>
      <Card mt="md" withBorder padding="lg">
        <TodoChart />
      </Card>
    </>
  );
};
