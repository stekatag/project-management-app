<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskLabelResource extends JsonResource {
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
            'project_id' => $this->project_id ?? null,
            'variant' => $this->variant,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
