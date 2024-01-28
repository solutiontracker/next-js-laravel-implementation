<?php
function getS3Image($image)
{
    if ($image) {
        $client = \Storage::disk('s3')->getDriver()->getAdapter()->getClient();
        $bucket = \Config::get('filesystems.disks.s3.bucket');

        $command = $client->getCommand('GetObject', [
            'Bucket' => $bucket,
            'Key' => $image, // file name in s3 bucket which you want to access
        ]);

        $request = $client->createPresignedRequest($command, '+1000 minutes');

        return $presignedUrl = (string) $request->getUri();
    } else {
        return "";
    }
}

function deleteObject($file)
{
    $file = base64_decode($file);
    \Storage::disk('s3')->delete($file);
}

function moveObject($from, $to)
{
    return \Storage::disk('s3')->move($from, $to);
}

function copyObject($from, $to)
{
    return \Storage::disk('s3')->copy($from, $to);
}
