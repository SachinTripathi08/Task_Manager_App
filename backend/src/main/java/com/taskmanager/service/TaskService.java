package com.taskmanager.service;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.model.Task;
import com.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks(Long userId) {
        return taskRepository.findByUserId(userId);
    }

    public Task createTask(TaskRequest request, Long userId) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : "TODO");
        task.setUserId(userId);
        return taskRepository.save(task);
    }

    public Task updateTask(Long taskId, TaskRequest request, Long userId) {
        Optional<Task> optionalTask = taskRepository.findByIdAndUserId(taskId, userId);
        if (optionalTask.isEmpty()) {
            return null;
        }

        Task task = optionalTask.get();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        return taskRepository.save(task);
    }

    public boolean deleteTask(Long taskId, Long userId) {
        Optional<Task> optionalTask = taskRepository.findByIdAndUserId(taskId, userId);
        if (optionalTask.isEmpty()) {
            return false;
        }
        taskRepository.delete(optionalTask.get());
        return true;
    }
}
