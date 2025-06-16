import { useEffect } from "react";
import useTodoStore from "../store/useTodoStore.js";
import axios from "axios";

const UserSwitcher = () => {
  const { users, currentUser, setUsers, setCurrentUser } = useTodoStore();

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("http://localhost:3000/api/users");
      setUsers(res.data);
      if (!currentUser && res.data.length > 0) {
        setCurrentUser(res.data[0].username);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="mb-4">
      <label className="mr-2 font-medium">Switch User:</label>
      <select
        className="border rounded px-2 py-1"
        value={currentUser || ""}
        onChange={(e) => setCurrentUser(e.target.value)}
      >
        {users.map((user) => (
          <option key={user.id} value={user.username}>
            {user.username}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserSwitcher;
