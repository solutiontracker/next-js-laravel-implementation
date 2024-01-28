<?php

namespace App\Notifications\Subscription\User;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class StartTrial extends Notification
{
    use Queueable;

    public $subscription;

    public $plan;

    public $paymentMethod;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($subscription, $plan, $paymentMethod)
    {
        $this->subscription = $subscription;
        $this->plan = $plan;
        $this->paymentMethod = $paymentMethod;
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
        return (new MailMessage)->subject('Your system 14-Days free trial starts today')->view(
            'emails.user.start-trial', [
                'notifiable' => $notifiable,
                'subscription' => $this->subscription,
                'plan' => $this->plan,
                'paymentMethod' => $this->paymentMethod,
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
