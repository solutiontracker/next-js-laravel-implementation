<?php

namespace App\Notifications\Subscription\User;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class AccountDowngraded extends Notification
{
    use Queueable;

    public $subscription;

    public $prev_plan;

    public $plan;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($subscription, $prev_plan, $plan)
    {
        $this->subscription = $subscription;
        $this->prev_plan = $prev_plan;
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
        return (new MailMessage)->subject('You’ve been downgraded to '.$this->plan->name.' ('.($this->plan->months == 1 ? 'Monthly' : 'Yearly').') Plan now!')->view(
            'emails.user.account-downgraded', [
                'notifiable' => $notifiable,
                'subscription' => $this->subscription,
                'plan' => $this->plan,
                'prev_plan' => $this->prev_plan,
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
