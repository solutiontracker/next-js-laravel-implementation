<?php

namespace App\Notifications\Cdn\User;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class AutoRechargePaymentFailed extends Notification
{
    use Queueable;

    public $payload;

    public $paymentMethod;

    public $plan;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($paymentMethod, $payload, $plan)
    {
        $this->paymentMethod = $paymentMethod;
        $this->payload = $payload;
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
        return (new MailMessage)->subject('Your system CDN Auto-recharge failed')->view(
            'emails.user.cdn-payment-failed', [
                'notifiable' => $notifiable,
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
