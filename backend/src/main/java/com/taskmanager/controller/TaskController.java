package com.taskmanager.controller;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.model.Task;
import com.taskmanager.service.TaskService;
import com.taskmanager.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;
    private final UserService userService;

    public TaskController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    // helper to get current user's id
    private Long getCurrentUserId(Authentication authentication) {
        return userService.getUserIdByUsername(authentication.getName());
    }

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        List<Task> tasks = taskService.getAllTasks(userId);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody TaskRequest request,
                                           Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        Task task = taskService.createTask(request, userId);
        return ResponseEntity.status(201).body(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id,
                                        @Valid @RequestBody TaskRequest request,
                                        Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        Task task = taskService.updateTask(id, request, userId);
        if (task == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Task not found"));
        }
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id,
                                        Authentication authentication) {
        Long userId = getCurrentUserId(authentication);
        boolean deleted = taskService.deleteTask(id, userId);
        if (!deleted) {
            return ResponseEntity.status(404).body(Map.of("error", "Task not found"));
        }
        return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
    }
}
