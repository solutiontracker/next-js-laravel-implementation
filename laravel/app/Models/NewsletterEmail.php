<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Notifications\Notifiable;

class NewsletterEmail extends Model
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['email', 'status', 'token', 'expire_at', 'redirect'];

    protected $table = 'newsletter_emails';
}
