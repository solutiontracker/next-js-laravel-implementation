<?php

namespace App\Notifications\Subscription\User;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class SubscriptionScheduledDowngradation extends Notification
{
    use Queueable;

    public $subscription;

    public $prev_plan;

    public $plan;

    public $payload;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($subscription, $prev_plan, $plan, $payload)
    {
        $this->subscription = $subscription;
        $this->prev_plan = $prev_plan;
        $this->plan = $plan;
        $this->payload = $payload;
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
        return (new MailMessage)->subject('Your subscription has been scheduled for downgradation!')->view(
            'emails.user.subscription-scheduled-downgradation', [
                'notifiable' => $notifiable,
                'subscription' => $this->subscription,
                'plan' => $this->plan,
                'prev_plan' => $this->prev_plan,
                'payload' => $this->payload,
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
