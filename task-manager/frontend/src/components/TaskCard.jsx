import { Edit2, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function TaskCard({ task, onEdit, onDelete }) {
  const statusConfig = {
    PENDING: { 
      color: 'text-amber-600', 
      bg: 'bg-amber-50', 
      border: 'border-amber-200/50', 
      icon: AlertCircle, 
      label: 'Pending' 
    },
    IN_PROGRESS: { 
      color: 'text-blue-600', 
      bg: 'bg-blue-50', 
      border: 'border-blue-200/50', 
      icon: Clock, 
      label: 'In Progress' 
    },
    COMPLETED: { 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      border: 'border-emerald-200/50', 
      icon: CheckCircle, 
      label: 'Completed' 
    },
  };

  const config = statusConfig[task.status] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  return (
    <div className={`bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 animate-fade-in group`}>
      <div className="flex justify-between items-start mb-4 gap-4">
        <h3 className="text-xl font-bold text-slate-800 line-clamp-1 leading-tight">{task.title}</h3>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${config.bg} ${config.color} ${config.border} border whitespace-nowrap`}>
          <StatusIcon className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} />
          {config.label}
        </span>
      </div>
      
      <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
        {task.description || <span className="italic opacity-60">No description provided</span>}
      </p>
      
      <div className="flex justify-between items-center mt-auto pt-5 border-t border-slate-100">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Created</span>
          <span className="text-xs font-medium text-slate-600">
            {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
        
        <div className="flex space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
            title="Edit task"
          >
            <Edit2 className="w-4 h-4" strokeWidth={2.5} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
