import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// Matching UI Icons
const SignOut = ({ size = 18, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const Plus = ({ size = 18, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const Edit = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
);

const Trash = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const SearchIcon = ({ size = 18, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const Loader2 = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

const LogoMark = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect width="40" height="40" rx="12" fill="url(#logo-gradient)" />
        <path d="M12 20.5l5 5 11-11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
            <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6" />
                <stop offset="1" stopColor="#06B6D4" />
            </linearGradient>
        </defs>
    </svg>
);

function Dashboard() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const completedTasks = tasks.filter((task) => task.completed).length;
    const pendingTasks = tasks.filter((task) => !task.completed).length;

    const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.description || "").toLowerCase().includes(search.toLowerCase())
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        setSearch("");
        navigate("/");
    };

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const response = await api.get("/tasks");
            setTasks(
                response.data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )
            );
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem("token");
                navigate("/");
                return;
            }
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleAddTask = async () => {
        if (!title.trim()) {
            toast.error("Please enter a task title.");
            return;
        }
        try {
            await api.post("/tasks", { title, description });
            setTitle("");
            setDescription("");
            fetchTasks();
            setSearch("");
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteTask = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this task?");
        if (!confirmDelete) return;
        try {
            await api.delete(`/tasks/${id}`);
            fetchTasks();
        } catch (error) {
            console.log(error);
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            await api.put(`/tasks/${task._id}`, { completed: !task.completed });
            fetchTasks();
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditTask = async () => {
        if (!title.trim()) {
            toast.error("Please enter a task title.");
            return;
        }
        try {
            await api.put(`/tasks/${editingTaskId}`, { title, description });
            setEditingTaskId(null);
            setTitle("");
            setDescription("");
            fetchTasks();
            setSearch("");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-cyan-100 px-4 py-8 relative overflow-hidden font-sans">
            {/* Ambient background decoration */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl animate-pulse" />

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Header Navigation Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 backdrop-blur-lg border border-white/50 rounded-2xl p-6 shadow-xl gap-4"
                >
                    <div className="flex items-center gap-3">
                        <LogoMark size={38} />
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                                Task<span className="text-blue-600">ly</span> Dashboard
                            </h1>
                            <p className="text-slate-500 text-sm mt-0.5">Organize your work efficiently.</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-rose-500 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/20 active:scale-[0.98] text-sm self-end sm:self-auto"
                    >
                        <SignOut size={16} />
                        Logout
                    </button>
                </motion.div>

                {/* Dashboard Matrix Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

                    {/* Left Column: Creator panel and stats */}
                    <div className="space-y-6 lg:col-span-1">
                        {/* Stats Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/70 backdrop-blur-lg border border-white/50 shadow-xl rounded-2xl p-5"
                        >
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Metrics</h3>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-white/50 p-3 rounded-xl border border-slate-100">
                                    <p className="text-2xl font-black text-slate-700">{tasks.length}</p>
                                    <p className="text-[11px] text-slate-500 font-medium mt-1">Total</p>
                                </div>
                                <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100/50">
                                    <p className="text-2xl font-black text-emerald-600">{completedTasks}</p>
                                    <p className="text-[11px] text-emerald-600/80 font-medium mt-1">Done</p>
                                </div>
                                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100/50">
                                    <p className="text-2xl font-black text-amber-600">{pendingTasks}</p>
                                    <p className="text-[11px] text-amber-600/80 font-medium mt-1">Pending</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Task Form Editor */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/70 backdrop-blur-lg border border-white/50 shadow-xl rounded-2xl p-6"
                        >
                            <h2 className="text-lg font-bold text-slate-800 mb-4">
                                {editingTaskId ? "✏️ Edit Task" : "✨ Create Task"}
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">Task Title</label>
                                    <input
                                        type="text"
                                        placeholder="What needs doing?"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white/80 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-600 block mb-1.5">Description (Optional)</label>
                                    <textarea
                                        placeholder="Add more details..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white/80 outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm resize-none"
                                    />
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={editingTaskId ? handleEditTask : handleAddTask}
                                        disabled={!title.trim()}
                                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 shadow-sm ${title.trim()
                                            ? "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/20 active:scale-[0.98]"
                                            : "bg-slate-300 cursor-not-allowed"
                                            }`}
                                    >
                                        <Plus size={16} />
                                        {editingTaskId ? "Update" : "Save Task"}
                                    </button>
                                    {editingTaskId && (
                                        <button
                                            onClick={() => {
                                                setEditingTaskId(null);
                                                setTitle("");
                                                setDescription("");
                                            }}
                                            className="px-4 py-2.5 rounded-xl bg-slate-200 text-slate-600 hover:bg-slate-300 font-medium text-sm transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Search & Task Deck */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Elegant Search Engine layout */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="relative group"
                        >
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                            <input
                                type="text"
                                placeholder="🔍 Search by title or description..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white/70 backdrop-blur-lg border border-white/50 rounded-2xl shadow-xl outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm placeholder:text-slate-400"
                            />
                        </motion.div>

                        {/* Task Iterative Renderer */}
                        <div className="space-y-3.5">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center p-12 bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl">
                                    <Loader2 className="animate-spin text-blue-500 mb-2" />
                                    <p className="text-slate-500 text-sm font-medium">Syncing database registers...</p>
                                </div>
                            ) : filteredTasks.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="p-10 text-center bg-white/40 backdrop-blur-md border border-white/30 rounded-2xl shadow-sm"
                                >
                                    <span className="text-2xl">🍃</span>
                                    <p className="text-slate-400 text-sm font-medium mt-2">No functional tasks align with parameters.</p>
                                </motion.div>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {filteredTasks.map((task) => (
                                        <motion.div
                                            key={task._id}
                                            layout
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                            className={`bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 hover:shadow-lg ${task.completed ? "opacity-75 bg-slate-50/50" : ""
                                                }`}
                                        >
                                            <div className="space-y-1.5 max-w-[80%]">
                                                <h2 className={`text-base font-bold text-slate-800 tracking-tight ${task.completed ? "line-through text-slate-400 decoration-slate-400/60 stroke-2" : ""
                                                    }`}>
                                                    {task.title}
                                                </h2>
                                                <p className={`text-sm leading-relaxed ${task.completed ? "line-through text-slate-400/70" : "text-slate-600"
                                                    }`}>
                                                    {task.description || "No descriptions detailed."}
                                                </p>
                                                <p className="text-[11px] font-medium text-slate-400/80 pt-0.5">
                                                    Logged: {new Date(task.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 sm:self-center justify-end border-t border-slate-100 sm:border-t-0 pt-3 sm:pt-0">
                                                <button
                                                    onClick={() => handleToggleComplete(task)}
                                                    className={`px-3 py-1.5 rounded-xl font-semibold text-xs border transition-all duration-200 ${task.completed
                                                        ? "bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/20"
                                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                                                        }`}
                                                >
                                                    {task.completed ? "✓ Complete" : "⏳ Pending"}
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setEditingTaskId(task._id);
                                                        setTitle(task.title);
                                                        setDescription(task.description);
                                                    }}
                                                    className="p-2 bg-white hover:bg-blue-50 text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-200 rounded-xl transition-all duration-200"
                                                    title="Edit Entry"
                                                >
                                                    <Edit size={15} />
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteTask(task._id)}
                                                    className="p-2 bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl transition-all duration-200"
                                                    title="Purge Task"
                                                >
                                                    <Trash size={15} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )
                            }
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;