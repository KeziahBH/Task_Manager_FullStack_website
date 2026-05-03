import { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import { toast } from 'react-toastify';
import { Plus, CheckSquare, Sparkles, Calendar, History, Clock } from 'lucide-react';

export default function Dashboard() {
  const [activeDate, setActiveDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateOrUpdate = async (taskData, id) => {
    try {
      if (id) {
        await api.put(`/tasks/${id}`, taskData);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', taskData);
        toast.success('Task created');
      }
      setIsModalOpen(false);
      setTaskToEdit(null);
      fetchTasks();
    } catch (err) {
      toast.error(id ? 'Failed to update task' : 'Failed to create task');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        toast.success('Task deleted');
        fetchTasks();
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  const openCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  // Group tasks by exact date
  const dateGroups = useMemo(() => {
    const groups = {};
    tasks.forEach(task => {
      const date = new Date(task.createdAt || new Date()).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(task);
    });
    // Sort: newest dates first
    return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]));
  }, [tasks]);

  const formatDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    if (checkDate.getTime() === today.getTime()) return "Today";
    if (checkDate.getTime() === yesterday.getTime()) return "Yesterday";
    return dateStr;
  };

  // Stats for the active view
  const currentTasks = activeDate ? (dateGroups.find(([d]) => d === activeDate)?.[1] || []) : tasks;
  const completedCount = currentTasks.filter(t => t.status === 'COMPLETED').length;
  const progressPercentage = currentTasks.length > 0 ? Math.round((completedCount / currentTasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-100/50 to-transparent pointer-events-none"></div>
      
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
              {activeDate ? (
                <>
                  <button 
                    onClick={() => setActiveDate(null)}
                    className="mr-4 p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-slate-200 text-slate-400 hover:text-brand-600"
                  >
                    <History className="w-6 h-6 rotate-180" />
                  </button>
                  {formatDateLabel(activeDate)}'s Tasks
                </>
              ) : (
                <>
                  Your Overview
                  <Sparkles className="w-6 h-6 text-brand-500 ml-2 animate-pulse" />
                </>
              )}
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              {activeDate 
                ? `Viewing ${currentTasks.length} tasks created on this day.`
                : `You have ${tasks.length} total tasks organized by date.`}
            </p>
          </div>
          
          <button
            onClick={openCreateModal}
            className="group flex items-center px-6 py-3 bg-slate-900 text-white rounded-full hover:bg-brand-600 transition-all duration-300 shadow-lg hover:shadow-brand-500/30 font-bold transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" strokeWidth={3} />
            Create New Task
          </button>
        </div>

        {/* Progress Bar */}
        {currentTasks.length > 0 && (
          <div className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                {activeDate ? 'Daily Progress' : 'Overall Progress'}
              </span>
              <span className="text-2xl font-extrabold text-brand-600">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-brand-400 to-brand-600 h-3 rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-12 h-12">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-3xl shadow-sm border border-slate-200 border-dashed animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-100 to-brand-50 mb-6 shadow-inner text-brand-600 transform rotate-3">
              <CheckSquare className="w-10 h-10" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">A fresh start!</h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
              You don't have any active tasks right now. Create your first task to get the ball rolling.
            </p>
            <button
              onClick={openCreateModal}
              className="px-8 py-3 bg-white text-slate-800 border-2 border-slate-200 rounded-full hover:border-brand-500 hover:text-brand-600 font-bold transition-all duration-300 shadow-sm"
            >
              Add First Task
            </button>
          </div>
        ) : activeDate ? (
          /* Task Detail View */
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Date Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
            {dateGroups.map(([date, dateTasks]) => {
              const dateCompleted = dateTasks.filter(t => t.status === 'COMPLETED').length;
              const dateProgress = Math.round((dateCompleted / dateTasks.length) * 100);
              
              return (
                <button
                  key={date}
                  onClick={() => setActiveDate(date)}
                  className="group relative bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50/50 rounded-bl-full -mr-12 -mt-12 group-hover:bg-brand-100/50 transition-colors"></div>
                  
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-2xl bg-brand-50 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                      <Calendar className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-black text-slate-800 leading-none mb-1">
                        {formatDateLabel(date)}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {date !== "Today" && date !== "Yesterday" ? date : new Date(dateTasks[0].createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-500">Tasks</span>
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg font-black text-xs">
                        {dateTasks.length}
                      </span>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Completion</span>
                        <span className="text-xs font-black text-brand-600">{dateProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-brand-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${dateProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center text-brand-600 font-bold text-sm group-hover:translate-x-1 transition-transform">
                    View Tasks <Plus className="w-4 h-4 ml-1 rotate-45" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleCreateOrUpdate}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
