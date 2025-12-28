<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class craeteAdminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-admin {name} {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new admin user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->argument('name');
        $email = $this->argument('email');

        $password = Str::random(10);

        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => bcrypt($password),
            'is_admin' => true,
        ]);

        if ($user) {
            $this->info('Admin user created successfully!');
            $this->info('Name: ' . $name);
            $this->info('Email: ' . $email);
            $this->info('Password: ' . $password);
            $this->info('token: ' . $user->createToken("API TOKEN")->plainTextToken,);
        } else {
            $this->error('Failed to create admin user.');
        }
    }
}
