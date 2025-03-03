import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { BarChart } from "@mantine/charts";
import { Center, Loader } from "@mantine/core";
import { db } from "@/firebase";
import { Todo } from "@/types/Todos";

const TodoChart = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  // Fetch todos from Firestore
  useEffect(() => {
    console.log("Setting up todos listener for user:", userId);
    const q = query(collection(db, "todos"), where("userId", "==", userId));
    // Use onSnapshot instead of getDocs for real-time updates
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const todosList: Todo[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Todo[];
        console.log("Todos updated:", todosList);
        setTodos(todosList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching todos:", error);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [userId]);

  // Transform todos into data for the BarChart
  const groupTodosByMonth = (todos: Todo[]) => {
    const monthsOfYear = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const grouped: { [key: string]: { total: number; completed: number } } = {};

    // Loop through the todos and group them by month and year
    todos.forEach((todo) => {
      const date = new Date(todo.createdAt);
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const key = `${month} ${year}`;

      if (!grouped[key]) {
        grouped[key] = { total: 0, completed: 0 };
      }
      grouped[key].total++;
      if (todo.completed) {
        grouped[key].completed++;
      }
    });

    // Now we ensure all months are present, even if no todos are for that month
    const currentYear = new Date().getFullYear();
    const result = monthsOfYear.map((month) => {
      const key = `${month} ${currentYear}`;
      return {
        month,
        todos: grouped[key]?.total || 0, // If there are no todos for that month, it will be 0
        completed: grouped[key]?.completed || 0, // If there are no completed todos for that month, it will be 0
      };
    });

    return result;
  };

  const todosData = groupTodosByMonth(todos);

  if (loading) {
    return (
      <Center h={400}>
        <Loader />
      </Center>
    );
  }

  return (
    <BarChart
      h={400}
      data={todosData}
      dataKey="month" // The key for the x-axis
      series={[
        { name: "todos", label: "Total Todos" }, // Total todos
        { name: "completed", label: "Completed Todos", color: "green.8" }, // Completed todos
      ]}
      withLegend
      xAxisLabel="Months"
      yAxisLabel="Total Todos"
      valueFormatter={(value) => `${value}`} // Format tooltip values
    />
  );
};

export default TodoChart;
