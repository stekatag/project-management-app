<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskLabel\StoreTaskLabelRequest;
use App\Http\Requests\TaskLabel\UpdateTaskLabelRequest;
use App\Http\Resources\TaskLabelResource;
use App\Models\TaskLabel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskLabelController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request) {
        $projectId = $request->input('project_id');
        $labels = TaskLabel::where(function ($query) use ($projectId) {
            $query->whereNull('project_id') // Fetch generic labels
                ->orWhere('project_id', $projectId); // Fetch labels specific to the project
        })->get();

        return Inertia::render('TaskLabels/Index', [
            'labels' => TaskLabelResource::collection($labels),
            'success' => session('success'),
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        return Inertia::render('TaskLabels/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskLabelRequest $request) {
        $data = $request->validated();

        TaskLabel::create($data);

        return to_route('task_labels.index')->with('success', 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(TaskLabel $taskLabel) {
        return Inertia::render('TaskLabels/Show', [
            'label' => new TaskLabelResource($taskLabel),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TaskLabel $taskLabel) {
        return Inertia::render('TaskLabels/Edit', [
            'label' => new TaskLabelResource($taskLabel),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskLabelRequest $request, TaskLabel $taskLabel) {
        $data = $request->validated();

        $taskLabel->update($data);

        return to_route('task_labels.index')->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TaskLabel $taskLabel) {
        $name = $taskLabel->name;

        $taskLabel->delete();

        return to_route('task_labels.index')->with('success', "Task label '$name' deleted successfully.");
    }

    /**
     * Search for task labels.
     */
    public function search(Request $request) {
        $query = $request->input('query');
        $projectId = $request->input('project_id');

        $labels = TaskLabel::where(function ($q) use ($query, $projectId) {
            $q->where('name', 'like', '%' . $query . '%')
                ->where(function ($q) use ($projectId) {
                    $q->whereNull('project_id')
                        ->orWhere('project_id', $projectId);
                });
        })->get();

        return response()->json(TaskLabelResource::collection($labels));
    }
}
