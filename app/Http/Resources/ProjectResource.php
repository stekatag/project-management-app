<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProjectResource extends JsonResource {
    public static $wrap = null;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array {
        // Set a flag to indicate that tasks are being accessed within the project context
        $request->merge(['projectContext' => true]);

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'created_at' => Carbon::parse($this->created_at)
                ->setTimezone($request->header('User-Timezone', 'UTC'))
                ->toISOString(),
            'due_date' => $this->due_date ? Carbon::parse($this->due_date)
                ->setTimezone($request->header('User-Timezone', 'UTC'))
                ->toISOString() : null,
            'updated_at' => Carbon::parse($this->updated_at)
                ->setTimezone($request->header('User-Timezone', 'UTC'))
                ->toISOString(),
            'status' => $this->status,
            'image_path' => $this->image_path ? Storage::url($this->image_path) : "",
            'createdBy' => new UserResource($this->createdBy),
            'updatedBy' => new UserResource($this->updatedBy),
            'invitedUsers' => UserResource::collection($this->invitedUsers),
            'acceptedUsers' => $this->whenLoaded('acceptedUsers', function () use ($request) {
                return $this->acceptedUsers->map(function ($user) use ($request) {
                    return array_merge($user->toArray($request), [
                        'pivot' => [
                            'role' => $user->pivot->role,
                            'status' => $user->pivot->status
                        ]
                    ]);
                });
            }),

            // Include the latest 5 tasks sorted by updated_at
            'tasks' => TaskResource::collection($this->tasks()->orderBy('updated_at', 'desc')->take(5)->get()),

            'taskLabels' => TaskLabelResource::collection($this->whenLoaded('taskLabels')),

            // Single source of truth for task counts
            'task_counts' => [
                'total' => $this->tasks()->count(),
                'completed' => $this->tasks()
                    ->whereHas('status', function ($q) {
                        $q->where('slug', 'completed');
                    })->count(),
                'in_progress' => $this->tasks()
                    ->whereHas('status', function ($q) {
                        $q->where('slug', 'in_progress');
                    })->count(),
                'pending' => $this->tasks()
                    ->whereHas('status', function ($q) {
                        $q->where('slug', 'pending');
                    })->count(),
            ],
        ];
    }
}
