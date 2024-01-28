<tr>
    <td align="center" style="padding: 0px 0 10px 0;">
        <table border="0" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td class="img" style="font-size:0pt; line-height:0pt; text-align:left; padding: 0px 4px;"
                    width="30">
                    <a href="{{ config('settings.social_fb_link') }}" target="_blank"
                        style="color: #008060; text-decoration: none;">
                        <img alt="Facebook" border="0" class="lightImage" height="32"
                            src="{{ \Storage::disk('ftp')->url('/images/emails/social-outline-fb.png') }}" width="32"
                            style="-ms-interpolation-mode: bicubic;">
                    </a>
                </td>
                <td class="img" style="font-size:0pt; line-height:0pt; text-align:left; padding: 0px 4px"
                    width="30">
                    <a href=" {{ config('settings.social_tw_link') }}" target="_blank"
                        style="color: #008060; text-decoration: none;">
                        <img alt="Twitter" border="0" class="lightImage" height="32"
                            src="{{ \Storage::disk('ftp')->url('/images/emails/social-outline-twitter.png') }}"
                            width="32" style="-ms-interpolation-mode: bicubic;">
                    </a>
                </td>
                <td class="img" style="font-size:0pt; line-height:0pt; text-align:left; padding: 0px 4px"
                    width="30">
                    <a href="{{ config('settings.social_yt_link') }}" target="_blank"
                        style="color: #008060; text-decoration: none;">
                        <img alt="Youtube" border="0" class="lightImage" height="32"
                            src="{{ \Storage::disk('ftp')->url('/images/emails/social-outline-youtube.png') }}"
                            width="32" style="-ms-interpolation-mode: bicubic;">
                    </a>
                </td>
            </tr>
        </table>
    </td>
</tr>
<tr>
    <td align="center"
        style="padding: 0px 0 30px 0; color: #666666; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 18px;">
        <p
            style="margin: 0;color: #585858;font-size: 12px;font-weight: 400;-webkit-font-smoothing:antialiased;line-height: 170%;">
            {{ config('settings.email_footer_text') }}
        </p>
    </td>
</tr>
