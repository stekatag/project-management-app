<?php

namespace App\Http\Requests\User;

use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest {
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
        $user = $this->route("user");

        return [
            "name" => ["required", "string", "max:255"],
            "email" => ["required", "email", "max:255", Rule::unique("users")->ignore($user->id)],
            "password" => ["nullable", "confirmed", Password::min(8)
                ->letters()
                ->numbers()
                ->symbols()],
        ];
    }
}
