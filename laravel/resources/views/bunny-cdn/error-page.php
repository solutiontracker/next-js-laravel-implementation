<!DOCTYPE html>
<html>

<head>
    <title>{{status_code}} {{status_title}}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/png" sizes="16x16" href="https://bunnynetassets.b-cdn.net/error.png" />
    <script src="https://bunny.net/lib/jquery/jquery.min.js"></script>
    <link rel="stylesheet" href="https://bunnynetassets.b-cdn.net/error.css">
</head>

<body>
    <div class="hero">
        <div class="content">
            <div class="alert-details">
                <h3 class="alert">ERROR {{status_code}}</h3>
                <h1>{{status_title}}</h1>
                <h3>We could not establish a connection to <?php echo $url; ?></h3>
            </div>
            <div class="row cards">
                <div class="col-md g-md-1">
                    <div class="card">
                        <img src="https://bunnynetassets.b-cdn.net/icons/you.svg" alt="Card Icon" />
                        <h2>You</h2>
                        <small>IP: {{user_ip}}</small>
                    </div>
                </div>
                <div class="col-md-1 g-md-1 icons"> <img src="https://bunnynetassets.b-cdn.net/icons/arrow.svg"
                        class="img-fluid"></div>
                <div class="col-md g-1">
                    <div class="card">
                        <img src="https://bunnynetassets.b-cdn.net/icons/bunny.svg" alt="Card Icon" />
                        <h2>system CDN</h2>
                        <small>Edge Network</small>
                    </div>
                </div>
                <div class="col-md-1 g-md-1 icons"> <img src="https://bunnynetassets.b-cdn.net/icons/x.svg"
                        class="img-fluid"></div>
                <div class="col-md g-1">
                    <div class="card">
                        <img src="https://bunnynetassets.b-cdn.net/icons/origin.svg" alt="Card Icon" />
                        <h2><?php echo $url; ?></h2>
                        <small>Your Destination</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="final-details">
        <div class="box">
            <h1>What happened?</h1>
            <div class="description">{{status_description}}</div>
        </div>
        <div class="box">
            <h1>What can I do?</h1>
            <div class="description">If you are a visitor, please try again in a few minutes. If you are the
                administrator, please get in-touch with <a href="<?php echo config('app.next_user_app_url'); ?>/support">system Support</a>.</div>
        </div>
    </div>
</body>

</html>
