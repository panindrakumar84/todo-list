import { useEffect, useState } from "react";
import axios from "axios";
import useTodoStore from "../store/useTodoStore";

const TodoDetailsModal = () => {
  const { selectedTodoId, clearSelectedTodo } = useTodoStore();
  const [todo, setTodo] = useState(null);
  const [note, setNote] = useState("");
  const [refresh, setRefresh] = useState(false);
  const { setTodos, currentUser } = useTodoStore();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchTodo = async () => {
      if (!selectedTodoId) return;
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/todos/${selectedTodoId}`
      );
      setTodo(res.data);
      setLoading(false);
    };
    fetchTodo();
  }, [selectedTodoId, refresh]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axios.delete(`http://localhost:3000/api/todos/${todo.id}`);
      const res = await axios.get(
        `http://localhost:3000/api/todos?user=${currentUser}`
      );
      setTodos(res.data);
      setTodo(null);
      clearSelectedTodo();
    } catch (err) {
      console.error("Failed to delete todo:", err);
    } finally {
      setDeleting(false);
    }
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;
    await axios.post(
      `http://localhost:3000/api/todos/${selectedTodoId}/notes`,
      {
        content: note,
      }
    );
    setNote("");
    setRefresh((prev) => !prev); // refetch todo
  };

  if (!selectedTodoId || !todo) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <button
          className="text-sm text-red-500 float-right"
          onClick={clearSelectedTodo}
        >
          ❌ Close
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className=" mb-4 px-3 py-1 bg-red-600 text-white rounded text-sm disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "🗑️ Delete Todo"}
        </button>

        <h2 className="text-xl font-bold mb-2">{todo.title}</h2>
        <p className="mb-2 text-gray-600">{todo.description}</p>
        <p className="text-sm mb-1">
          Priority: <span className="font-medium">{todo.priority}</span>
        </p>
        <p className="text-sm mb-1">Tags: {todo.tags?.join(", ") || "None"}</p>
        <p className="text-sm mb-1">
          Assigned Users: {todo.assignedUsers?.join(", ") || "None"}
        </p>

        <div className="mt-4">
          <div className="mt-3">
            <label className="text-sm font-medium mr-2">Completed:</label>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={async () => {
                await axios.put(`http://localhost:3000/api/todos/${todo.id}`, {
                  completed: !todo.completed,
                });
                const res = await axios.get(
                  `http://localhost:3000/api/todos/${todo.id}`
                );
                setTodo(res.data);
                const allTodos = await axios.get(
                  `http://localhost:3000/api/todos?user=${currentUser}`
                );
                setTodos(allTodos.data);
              }}
            />
          </div>

          <h3 className="font-semibold">Notes</h3>
          <ul className="text-sm text-gray-700 max-h-32 overflow-auto mb-2">
            {todo.notes.map((n, i) => (
              <li key={i} className="border-b py-1">
                {n.content}
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <button
              onClick={handleAddNote}
              className="text-sm bg-blue-500 text-white px-3 rounded"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoDetailsModal;
