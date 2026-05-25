<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateUserRoleRequest;
use App\Models\User;
use App\Services\DemoProductService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Throwable;

class UserManagementController extends Controller
{
    public function __construct(private readonly DemoProductService $demoProducts)
    {
    }

    public function index(): View
    {
        try {
            return view('admin.users.index', [
                'users' => User::query()->latest()->paginate(12),
                'userStats' => [
                    'total' => User::query()->count(),
                    'admins' => User::query()->where('role', 'admin')->count(),
                    'customers' => User::query()->where('role', 'user')->count(),
                ],
            ]);
        } catch (Throwable) {
            $users = $this->demoProducts->users();

            return view('admin.users.index', [
                'users' => $this->demoProducts->paginate($users),
                'userStats' => [
                    'total' => $users->count(),
                    'admins' => $users->where('role', 'admin')->count(),
                    'customers' => $users->where('role', 'user')->count(),
                ],
            ])->with('status', 'Demo mode: database write actions are disabled on Vercel.');
        }
    }

    public function updateRole(UpdateUserRoleRequest $request, string $user): RedirectResponse
    {
        if ($this->demoProducts->isVercelDemo()) {
            return back()->with('status', 'Demo mode: database write actions are disabled on Vercel.');
        }

        $user = User::query()->findOrFail($user);

        $data = $request->validated();

        if ($request->user()?->is($user) && $data['role'] !== 'admin') {
            return back()->with('status', 'You cannot remove admin access from your own account.');
        }

        $user->update($data);

        return back()->with('status', 'User role updated successfully.');
    }
}
