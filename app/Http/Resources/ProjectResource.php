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
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'created_at' => Carbon::parse($this->created_at)
                ->setTimezone($request->header('User-Timezone', 'UTC'))
                ->toISOString(),
            'due_date' => Carbon::parse($this->due_date)
                ->setTimezone($request->header('User-Timezone', 'UTC'))
                ->toISOString(),
            'status' => $this->status,
            'image_path' => $this->image_path ? Storage::url($this->image_path) : "",
            'createdBy' => new UserResource($this->createdBy),
            'updatedBy' => new UserResource($this->updatedBy),
            'invitedUsers' => UserResource::collection($this->invitedUsers),
        ];
    }
}
