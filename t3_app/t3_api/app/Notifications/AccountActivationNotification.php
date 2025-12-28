<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\User;

class AccountActivationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $user;
    public $token;

    public function __construct(User $user, $token)
    {
        $this->user = $user;
        $this->token = $token;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {

        $host = env('FRONTEND_URL_BASE_URL');
        return (new MailMessage)
            ->line('Votre demande de compte a été acceptée.')
            ->action('Activer le compte', url("$host/activate_account/token={$this->token}"))
            ->line('Merci d\'utiliser notre application !')
            ->salutation('Cordialement, TEAM TIME TRACKING 😊');
    }
}
