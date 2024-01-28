<?php

namespace App\Notifications\Cdn\User;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class CdnSuspended extends Notification
{
    use Queueable;

    public $websites;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($websites)
    {
        $this->websites = $websites;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)->subject('Your CDN service was suspend due to negative balance')->view(
            'emails.user.cdn-suspended', [
                'notifiable' => $notifiable,
                'websites' => $this->websites
            ]
        );
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
