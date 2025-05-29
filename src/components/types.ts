export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export type Filter = "all" | "completed" | "pending";

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  filter: Filter;
}
