import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Task, TaskState } from "../components/types";

const initialState: TaskState = {
  tasks: [],
  loading: false,
  filter: "all",
};

export const fetchTasks = createAsyncThunk("tasks/fetch", async () => {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/todos?_limit=5"
  );
  const data = await res.json();

  return data.map((item: Task) => ({
    id: String(item.id),
    title: item.title,
    completed: item.completed,
  })) as Task[];
});

export const addTask = createAsyncThunk("tasks/add", async (title: string) => {
  const newTask: Task = {
    id: Date.now().toString(),
    title,
    completed: false,
  };

  return newTask;
});

export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (id: string) => {
    return id;
  }
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    toggleTask: (state, action) => {
      const task = state.tasks.find((item) => item.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.loading = false;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((item) => item.id !== action.payload);
      });
  },
});

export const { toggleTask, setFilter } = taskSlice.actions;
export default taskSlice.reducer;
