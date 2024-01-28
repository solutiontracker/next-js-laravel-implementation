<?php

namespace App\Notifications\Subscription\User;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class CancelSubscription extends Notification
{
    use Queueable;

    public $subscription;

    public $plan;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($subscription, $plan)
    {
        $this->subscription = $subscription;
        $this->plan = $plan;
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
        return (new MailMessage)->subject('Your subscription has been canceled!')->view(
            'emails.user.subscription-cancelled', [
                'notifiable' => $notifiable,
                'subscription' => $this->subscription,
                'plan' => $this->plan
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
