import { useEffect, useState } from "react";
import axios from "axios";
import useTodoStore from "../store/useTodoStore";

const priorities = ["low", "medium", "high"];

const TodoFormModal = () => {
  const { currentUser, showCreateModal, setShowCreateModal, setTodos } =
    useTodoStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [tags, setTags] = useState("");
  const [mentions, setMentions] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showCreateModal) {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setTags("");
      setMentions("");
    }
  }, [showCreateModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/todos", {
        username: currentUser,
        title,
        description,
        priority,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        assignedUsers: mentions
          .split(",")
          .map((u) => u.trim())
          .filter(Boolean),
      });

      // Optionally refetch todos
      const todoRes = await axios.get(
        `http://localhost:3000/api/todos?user=${currentUser}`
      );
      setTodos(todoRes.data);

      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create todo:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!showCreateModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <button
          className="text-sm text-red-500 float-right"
          onClick={() => setShowCreateModal(false)}
        >
          ❌
        </button>
        <h2 className="text-lg font-bold mb-4">Create New Todo</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm"
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <input
            type="text"
            placeholder="Mentions (@username, comma-separated)"
            value={mentions}
            onChange={(e) => setMentions(e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm"
          />
          <button
            type="submit"
            disable={loading}
            className="w-full bg-blue-600 text-white py-2 rounded text-sm"
          >
            {loading ? "Creating..." : "Create Todo"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TodoFormModal;
