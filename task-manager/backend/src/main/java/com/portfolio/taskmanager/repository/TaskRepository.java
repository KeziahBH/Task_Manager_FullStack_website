package com.portfolio.taskmanager.repository;

import com.portfolio.taskmanager.model.Task;
import com.portfolio.taskmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserOrderByCreatedAtDesc(User user);
}
