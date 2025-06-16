import UserSwitcher from "./components/UserSwitcher";
import HomePage from "./pages/HomePage";
import TodoDetailsModal from "./components/TodoDetailsModal";
import TodoFormModal from "./components/TodoFormModal";

function App() {
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📝 Todo List App</h1>
      <UserSwitcher />
      <HomePage />
      <TodoDetailsModal />
      <TodoFormModal />
    </div>
  );
}

export default App;
