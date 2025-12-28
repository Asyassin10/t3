<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NotifyManagerModificationAccount extends Notification implements ShouldQueue
{
    use Queueable;

    private  $user;
    public function __construct(User $user)
    {
        $this->user = $user;
    }


    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Modification de votre compte manager')
            ->greeting('Bonjour ' . $this->user->name . ',')
            ->line('Votre compte manager a été modifié avec succès.')
            ->line('Voici vos informations mises à jour :')
            ->line('Email : ' . $this->user->email)
            ->line('Rôle : Manager')
            ->action('Se connecter', url('/login'))
            ->line('Si vous n\'avez pas effectué cette modification, veuillez contacter immédiatement le support.')
            ->salutation('Cordialement, L\'équipe de support.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'email' => $this->user->email,
            'role' => 'Manager',
            'message' => 'Votre compte manager a été modifié avec succès.'
        ];
    }
}
