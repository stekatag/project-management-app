<?php

namespace App\Http\Requests\TaskLabel;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskLabelRequest extends FormRequest {
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:task_labels,name'],
            'bg_color_class' => ['required', 'string'],
            'border_color_class' => ['required', 'string'],
            'text_color_class' => ['required', 'string'],
        ];
    }
}
