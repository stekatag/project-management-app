<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource {
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array {
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
            'status' => $this->status,
            'priority' => $this->priority,
            'image_path' => $this->image_path ? Storage::url($this->image_path) : "",
            // Conditionally load the project reference to avoid circular dependency
            'project' => $this->when(!isset($request->projectContext), function () {
                return new ProjectResource($this->project);
            }),

            'project_id' => $this->project_id,
            'assigned_user_id' => $this->assigned_user_id,
            'assignedUser' => $this->assignedUser ? new UserResource($this->assignedUser) : null,
            'createdBy' => new UserResource($this->createdBy),
            'updatedBy' => new UserResource($this->updatedBy),
            'labels' => TaskLabelResource::collection($this->whenLoaded('labels')),
        ];
    }
}
