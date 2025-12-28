<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NotifyManagerCreationAccount extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public  $password;
    public function __construct(string $password)
    {
        $this->password = $password;
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
            ->subject('Création de votre compte manager')
            ->greeting('Bonjour ' . $notifiable->name . ',')
            ->line('Votre compte manager a été créé avec succès.')
            ->line('Voici vos informations de connexion :')
            ->line('Email : ' . $notifiable->email)
            ->line('Mot de passe : ' . $this->password)
            ->action('Se connecter', url('/login'))
            ->line('Nous vous recommandons de changer votre mot de passe après votre première connexion.')
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
            'email' => $notifiable->email,
            'password' => $this->password,
            'message' => 'Votre compte manager a été créé avec succès.'
        ];
    }
}
