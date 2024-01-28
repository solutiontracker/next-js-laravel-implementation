<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <style type="text/css">
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        table {
            border-collapse: collapse !important;
            background-color: #f8fafc;
        }

        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }

        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        a {
            color: #008060;
            text-decoration: underline;
        }

        * img[tabindex=0]+div {
            display: none !important;
        }

        @media screen and (max-width:350px) {
            h1 {
                font-size: 24px !important;
                line-height: 24px !important;
            }
        }

        div[style*=margin: 16px 0] {
            margin: 0 !important;
        }

        @media screen and (min-width: 360px) {
            .headingMobile {
                font-size: 40px !important;
            }

            .headingMobileSmall {
                font-size: 28px !important;
            }
        }

    </style>
</head>

<body bgcolor="#ffffff" style="background-color: #ffffff; margin: 0 !important; padding: 0 !important;">
    <div
        style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden">
        <span>We have successfully processed payment for your recurring {{ Str::ucfirst($plan->name) }} ({{ $plan->months > 1 ? 'yearly' : 'monthly' }}) subscription to system</span><span>&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;<wbr>&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;<wbr>&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;<wbr>&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;<wbr>&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;<wbr>&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;<wbr>&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;<wbr>&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;<wbr>&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;<wbr>&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;<wbr>&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;<wbr>&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;<wbr>&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;<wbr>&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</span>
    </div>
    <center>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" align="center" valign="top">
            <tbody>
                @include('emails/user/layout/header')
                <tr>
                    <td>
                        <table border="0" cellpadding="0" cellspacing="0" align="center" valign="top" bgcolor="#ffffff"
                            style="padding: 0 20px !important;max-width: 500px;width: 90%; background-color: #ffffff;
              border-color: #e8e5ef;
              border-radius: 6px;
              border-width: 1px;
              margin: 0px auto 0;
              overflow: hidden;
              box-shadow: 0px 0.2px 0.4px rgb(0 0 0 / 3%), 0px 0.5px 1px rgb(0 0 0 / 4%), 0px 1.2px 2.4px rgb(0 0 0 / 5%), 0px 4px 8px rgb(0 0 0 / 8%);">
                            <tbody>
                                <tr>
                                    <td bgcolor="#ffffff" style="padding: 0;">
                                        <p style="text-align: center;margin: 0 0 33px;">
                                            <img style="max-width: 500px;"
                                                src="{{ \Storage::disk('ftp')->url('/images/emails/emotions/happy-five.png') }}"
                                                alt="Emoticon Image" srcset=""
                                                style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; -ms-interpolation-mode: bicubic; border-radius: 0px; width: 100%; height: auto; margin: auto; display: block;">
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="center" style="padding: 0 32px 32px;">
                                        <!--[if (gte mso 9)|(IE)]>
               <table align="center" border="0" cellspacing="0" cellpadding="0" width="350">
                <tr>
                 <td align="center" valign="top" width="350">
                  <![endif]-->
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%"
                                            style="max-width: 500px;">
                                            <tbody>
                                                <tr>
                                                    <td bgcolor="#ffffff" align="left"
                                                        style="padding: 0; color: #666666; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400;-webkit-font-smoothing:antialiased;">
                                                        <p class="headingMobile"
                                                            style="margin: 0;color: #171717;font-size: 26px;font-weight: 200;line-height: 130%;margin-bottom:5px;">
                                                            {{ $notifiable->first_name }},
                                                            Thanks for your payment!</p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#ffffff" height="20"></td>
                                                </tr>
                                                <tr>
                                                    <td bgcolor="#ffffff" align="left"
                                                        style="padding:0; color: #666666; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400;-webkit-font-smoothing:antialiased;">
                                                        <p
                                                            style="margin:0;color:#585858;font-size:14px;font-weight:400;line-height:170%;">
                                                            We have successfully processed payment for your recurring
                                                            {{ Str::ucfirst($plan->name) }}
                                                            ({{ $plan->months > 1 ? 'yearly' : 'monthly' }})
                                                            subscription to system, and you may find your
                                                            <a
                                                                href="{{ route('user-subscription-download-invoice', [$notifiable->id, $payload['data']['object']['id']]) }}">invoice
                                                                here</a>. If you believe this
                                                            charge to be in error or have any questions, please email <a
                                                                href="mailto:{{ config('settings.sales_email') }}"
                                                                style="color: #008060;text-decoration: underline;"
                                                                target="_blank">{{ config('settings.sales_email') }}</a>.
                                                        </p>
                                                        <p
                                                            style="margin:10px 0 0;color:#585858;font-size:14px;font-weight:400;line-height:170%;">
                                                            <b>Your Plan:</b> {{ Str::ucfirst($plan->name) }}
                                                        </p>
                                                        <p
                                                            style="margin:0;color:#585858;font-size:14px;font-weight:400;line-height:170%;">
                                                            <b>Billing Cycle:</b>
                                                            {{ $plan->months > 1 ? 'Yearly' : 'Monthly' }}
                                                        </p>
                                                        <p
                                                            style="margin:0;color:#585858;font-size:14px;font-weight:400;line-height:170%;">
                                                            <b>Amount Charged:</b>
                                                            ${{ number_format($payload['data']['object']['amount_paid'] / 100, 2) }}
                                                        </p>
                                                        @if ($paymentMethod && is_object($paymentMethod))
                                                            <p
                                                                style="margin:0;color:#585858;font-size:14px;font-weight:400;line-height:170%;">
                                                                <b>Payment Method:</b>
                                                                {{ Str::ucfirst($paymentMethod->card->brand) }} (####
                                                                ####
                                                                #### {{ $paymentMethod->card->last4 }})
                                                            </p>
                                                        @endif
                                                        <p
                                                            style="margin:0;color:#585858;font-size:14px;font-weight:400;line-height:170%;">
                                                            <b>Invoice ID:</b> {{ $payload['data']['object']['id'] }}
                                                            (<a
                                                                href="{{ route('user-subscription-download-invoice', [$notifiable->id, $payload['data']['object']['id']]) }}">view
                                                                invoice</a>).
                                                        </p>
                                                        <p
                                                            style="margin:10px 0 0;color:#585858;font-size:14px;font-weight:400;line-height:170%;">
                                                            You can manage your bill by visiting the <a
                                                                href="{{ config('app.next_user_app_url') . '/user/subscription' }}">Billing
                                                                Settings</a>.</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <!--[if (gte mso 9)|(IE)]>
                 </td>
                </tr>
               </table>
               <![endif]-->
                    </td>
                </tr>
            </tbody>
        </table>
        <!--[if (gte mso 9)|(IE)]>
                    </td>
                   </tr>
                  </table>
                  <![endif]-->
        </td>
        </tr>
        <tr>
            <td align="center" style="padding: 0;">
                <!--[if (gte mso 9)|(IE)]>
                      <table align="center" border="0" cellspacing="0" cellpadding="0" width="350">
                        <tr>
                          <td align="center" valign="top" width="350">
                            <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%"
                    style="max-width: 500px; margin: 10px 0 20px;">
                    <tbody>
                        <tr>
                            <td align="center"
                                style="padding: 30px 0 30px 0; color: #666666; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 18px;">
                                <p
                                    style="margin: 0;color: #585858;font-size: 12px;font-weight: 400;-webkit-font-smoothing:antialiased;line-height: 170%;">
                                    Need help? Ask at <a href="mailto:{{ config('settings.support_email') }}"
                                        style="color: #008060;text-decoration: underline;"
                                        target="_blank">{{ config('settings.support_email') }}</a> or visit our <a
                                        href="{{ config('settings.help_desk_link') }}"
                                        style="color: #008060;text-decoration: underline;" target="_blank">Help
                                        Center</a>
                                </p>
                                <p
                                    style="margin: 0;color: #585858;font-size: 12px;font-weight: 400;-webkit-font-smoothing:antialiased;line-height: 170%;">
                                    You're receiving this email because your {{ Str::ucfirst($plan->name) }} ({{ $plan->months > 1 ? 'yearly' : 'monthly' }}) Plan was renewed.</p>
                        <tr>
                            <td align="center"
                                style="padding: 0; color: #666666; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 18px;">
                                <p
                                    style="margin: 0;color: #585858;font-size: 12px;font-weight: 400;-webkit-font-smoothing:antialiased;line-height: 170%;">
                                </p>
                            </td>
                        </tr>
                        @include('emails/user/layout/footer')
                    </tbody>
                </table>
            </td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
    </center>
</body>

</html>
