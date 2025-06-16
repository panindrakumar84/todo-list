import { useEffect, useState } from "react";
import axios from "axios";
import useTodoStore from "../store/useTodoStore";

const HomePage = () => {
  const { currentUser, todos, setTodos } = useTodoStore();
  const { setSelectedTodoId } = useTodoStore();
  const { setShowCreateModal } = useTodoStore();
  const { filterPriority, setFilterPriority } = useTodoStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:3000/api/todos?user=${currentUser}`
        );

        setTodos(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch todos:", err);
      }
    };

    fetchTodos();
  }, [currentUser]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Todos for @{currentUser}</h2>
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="mb-4 px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          ➕ Add Todo
        </button>
        <button
          onClick={() => {
            if (!currentUser) return;
            window.open(
              `http://localhost:3000/api/todos/export?user=${currentUser}`,
              "_blank"
            );
          }}
          className="mb-4 px-3 py-1 bg-blue-600 text-white rounded text-sm"
        >
          📤 Export Todos
        </button>
      </div>
      <div className="mb-4">
        <label className="mr-2 text-sm font-medium">Filter by Priority:</label>
        <select
          value={filterPriority || ""}
          onChange={(e) => setFilterPriority(e.target.value || null)}
          className="text-sm border px-2 py-1 rounded"
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="space-y-2">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : todos.length === 0 ? (
          <p className="text-gray-500">No todos found.</p>
        ) : (
          todos
            .filter(
              (todo) => !filterPriority || todo.priority === filterPriority
            )
            .map((todo) => (
              <div
                key={todo.id}
                onClick={() => setSelectedTodoId(todo.id)}
                className={`cursor-pointer border p-3 rounded shadow-sm bg-white hover:bg-gray-50 ${
                  todo.completed ? "opacity-50 line-through" : ""
                }`}
              >
                <h3 className="font-bold">{todo.title}</h3>
                <p className="text-sm text-gray-600">{todo.description}</p>
                <p className="text-xs mt-1 text-blue-500">
                  Priority: {todo.priority}
                </p>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
