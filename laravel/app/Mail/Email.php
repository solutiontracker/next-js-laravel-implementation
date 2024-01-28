<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class Email extends Mailable
{
    use Queueable, SerializesModels;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }
    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $data = $this->subject($this->data['subject']);

        if (isset($this->data['view'])) {
            $data->view($this->data['view'])
                ->withData($this->data);
        }

        if (isset($this->data['from_name'])) {
            $data->from('donotreply@system.io', $this->data['from_name'])->replyTo('donotreply@system.io', $this->data['from_name']);
        }

        if (isset($this->data['bcc'])) {
            $data->bcc($this->data['bcc']);
        }

        if (isset($this->data['cc'])) {
            $data->cc($this->data['cc']);
        }

        if (isset($this->data['attachment'])) {
            foreach ($this->data['attachment'] as $key => $attahment) {
                if($attahment['path']) $data = $data->attach($attahment['path'], ['as' => $attahment['name']]);
            }
        }

        return $data;
    }
}
