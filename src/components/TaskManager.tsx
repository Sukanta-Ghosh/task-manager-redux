import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTask,
  deleteTask,
  fetchTasks,
  setFilter,
  toggleTask,
} from "../store/taskSlice";
import type { Task, Filter } from "./types";
import type { AppDispatch, RootState } from "../store/store";

const TaskManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, filter, loading } = useSelector(
    (state: RootState) => state.task
  );
  const [title, setTitle] = useState("");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleAddTask = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    dispatch(addTask(trimmedTitle));
    setTitle("");
  };

  const handleFilterChange = (newFilter: Filter) => {
    dispatch(setFilter(newFilter));
  };

  const handleToggleTask = (id: string) => {
    dispatch(toggleTask(id));
  };

  const handleDeleteTask = (id: string) => {
    dispatch(deleteTask(id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") {
      return task.completed;
    }
    if (filter === "pending") {
      return !task.completed;
    }
    return true;
  });

  return (
    <div className="container">
      <h2>Task Manager</h2>

      <div className="input-container">
        <input
          type="text"
          value={title}
          onChange={handleInputChange}
          className="task-input"
        />
        <button onClick={handleAddTask} className="add-task-button">
          Add
        </button>
      </div>

      <div className="task-filter-buttons">
        {(["all", "completed", "pending"] as Filter[]).map((item) => (
          <button
            key={item}
            onClick={() => handleFilterChange(item)}
            className="filter-button"
          >
            {item}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul className="task-list">
          {filteredTasks.map((task: Task) => (
            <li key={task.id} className="task-item">
              <label className="label">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                />
                <span className={task.completed ? "task-completed" : ""}>
                  {task.title}
                </span>
              </label>
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="delete-task-button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskManager;
