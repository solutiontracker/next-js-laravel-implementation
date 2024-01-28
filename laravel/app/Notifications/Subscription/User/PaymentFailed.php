<?php

namespace App\Notifications\Subscription\User;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class PaymentFailed extends Notification
{
    use Queueable;

    public $subscription;

    public $plan;

    public $payload;

    public $paymentMethod;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($subscription, $plan, $paymentMethod, $payload)
    {
        $this->subscription = $subscription;
        $this->plan = $plan;
        $this->paymentMethod = $paymentMethod;
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
        $subject = 'We couldn’t process your system payment for '.$this->plan->name.' ('.($this->plan->months == 1 ? 'Monthly' : 'Yearly').') Plan';

        return (new MailMessage)->subject($subject)->view(
            'emails.user.payment-failed', [
                'notifiable' => $notifiable,
                'subscription' => $this->subscription,
                'plan' => $this->plan,
                'paymentMethod' => $this->paymentMethod,
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
