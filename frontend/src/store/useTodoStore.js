import { create } from "zustand";

const useTodoStore = create((set) => ({
  currentUser: null,
  users: [],
  todos: [],
  filters: {
    tag: null,
    priority: null,
  },
  selectedTodoId: null,
  showCreateModal: false,
  filterPriority: null,

  setFilterPriority: (val) => set({ filterPriority: val }),
  setShowCreateModal: (val) => set({ showCreateModal: val }),
  setSelectedTodoId: (id) => set({ selectedTodoId: id }),
  clearSelectedTodo: () => set({ selectedTodoId: null }),
  setUsers: (users) => set({ users }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setTodos: (todos) => set({ todos }),
  setFilters: (filters) => set({ filters }),
}));
export default useTodoStore;
