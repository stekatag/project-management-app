<?php

namespace App\Services;

use App\Models\Task;
use App\Traits\FilterableTrait;
use App\Traits\SortableTrait;

class DashboardService extends BaseService {
  use FilterableTrait, SortableTrait;

  protected $taskService;

  public function __construct(TaskService $taskService) {
    $this->taskService = $taskService;
  }

  public function getActiveTasks($user, array $filters) {
    $query = Task::query();

    // Base query
    $query->whereHas('project', function ($query) use ($user) {
      $query->where('created_by', $user->id)
        ->orWhereHas('acceptedUsers', function ($q) use ($user) {
          $q->where('user_id', $user->id)
            ->where('status', 'accepted');
        });
    })
      ->whereIn('status', ['pending', 'in_progress'])
      ->where('assigned_user_id', $user->id);

    // Apply filters
    if (isset($filters['project_id'])) {
      $query->where('project_id', $filters['project_id']);
    }
    if (isset($filters['name'])) {
      $this->applyNameFilter($query, $filters['name']);
    }
    if (isset($filters['priority'])) {
      $this->applyPriorityFilter($query, $filters['priority']);
    }
    if (isset($filters['status'])) {
      $this->applyStatusFilter($query, $filters['status']);
    }
    if (isset($filters['label_ids'])) {
      $this->applyLabelFilter($query, $filters['label_ids']);
    }
    if (isset($filters['due_date'])) {
      $this->applyDateRangeFilter($query, $filters['due_date'], 'due_date');
    }

    // Handle sorting
    $basicFilters = $this->getBasicFilters($filters);

    $query = $this->applySorting($query, $basicFilters['sort_field'], $basicFilters['sort_direction'], 'tasks');

    return $query;
  }

  public function getOptions($user) {
    return [
      'projectOptions' => $this->taskService->getProjectOptions($user),
      'labelOptions' => $this->taskService->getLabelOptions(),
    ];
  }
}
