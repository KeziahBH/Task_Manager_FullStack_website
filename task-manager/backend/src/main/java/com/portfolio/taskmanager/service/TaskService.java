package com.portfolio.taskmanager.service;

import com.portfolio.taskmanager.dto.TaskDto;
import com.portfolio.taskmanager.exception.ResourceNotFoundException;
import com.portfolio.taskmanager.model.Task;
import com.portfolio.taskmanager.model.TaskStatus;
import com.portfolio.taskmanager.model.User;
import com.portfolio.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<TaskDto> getAllTasks(User user) {
        return taskRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public TaskDto createTask(TaskDto taskDto, User user) {
        Task task = new Task();
        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setStatus(taskDto.getStatus() != null ? taskDto.getStatus() : TaskStatus.PENDING);
        task.setUser(user);

        Task savedTask = taskRepository.save(task);
        return mapToDto(savedTask);
    }

    public TaskDto updateTask(Long id, TaskDto taskDto, User user) {
        Task task = getTaskByIdAndUser(id, user);

        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        if (taskDto.getStatus() != null) {
            task.setStatus(taskDto.getStatus());
        }

        Task updatedTask = taskRepository.save(task);
        return mapToDto(updatedTask);
    }

    public void deleteTask(Long id, User user) {
        Task task = getTaskByIdAndUser(id, user);
        taskRepository.delete(task);
    }

    private Task getTaskByIdAndUser(Long id, User user) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        if (!task.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Task not found for this user");
        }
        return task;
    }

    private TaskDto mapToDto(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setCreatedAt(task.getCreatedAt());
        return dto;
    }
}
