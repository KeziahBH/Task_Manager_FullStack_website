package com.portfolio.taskmanager.dto;

import com.portfolio.taskmanager.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class TaskDto {
    private Long id;
    
    @NotBlank
    private String title;
    
    private String description;
    private TaskStatus status;
    private LocalDateTime createdAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
