<?php

use Illuminate\Filesystem\Filesystem as File;
use \Symfony\Component\HttpFoundation\File\UploadedFile as UploadedFile;

function uploadImage($image_file, $destination, $create_thumb, $thumb_dimensions, $asset_directory)
{
    $response_array      = array();
    $image_name          = '';
    $image_upload_name   = '';
    $temp_path_corrected = '';
    if ($image_file->isValid()) {
        $image_name          = $image_file->getClientOriginalName();
        $image_extension     = $image_file->getClientOriginalExtension();
        $lowercase_extension = strtolower($image_extension);
        if ($lowercase_extension == 'png' || $lowercase_extension == 'jpg' || $lowercase_extension == 'jpeg' || $lowercase_extension == 'gif') {
            $image_upload_name = 'image_' . rand() . time() . '.' . $image_extension;
            if ($lowercase_extension == 'png' || $lowercase_extension == 'jpg' || $lowercase_extension == 'jpeg') {

                $exif = exif_read_data($image_file);
                if (!empty($exif['Orientation'])) {
                    $temp_path_corrected = $destination . 'corrected/' . $image_upload_name;
                    image_fix_orientation($image_file, $temp_path_corrected);
                    if (file_exists($temp_path_corrected)) {
                        $image_file = new UploadedFile($temp_path_corrected, $image_upload_name, $exif['MimeType'], null, null, TRUE);
                    }
                }
            }
        } else if ($lowercase_extension == 'doc' || $lowercase_extension == 'docx' || $lowercase_extension == 'ppt' || $lowercase_extension == 'pdf' || $lowercase_extension == 'rar' || $lowercase_extension == 'zip' || $lowercase_extension == 'txt') {
            $image_upload_name = 'document_' . time() . '.' . $image_extension;
        } else {
            if (in_array($lowercase_extension, array(
                'php',
                'js',
                'html',
                'phtml',
                'css'
            ))) {
                $response_array['status']  = '0';
                $response_array['message'] = $image_name + ' is not valid.';
                return json_encode($response_array);
            }
            $image_upload_name = 'others_' . time() . '.' . $image_extension;
        }

        if ($image_file->move($destination, $image_upload_name)) {

            if ($asset_directory == 'social_wall') {
                $compres_image = $destination . $image_upload_name;
                $d             = compress($compres_image, $compres_image, '50');
            }


            //Deleting Corrected File
            if ($temp_path_corrected != '') {
                //@unlink($temp_path_corrected);
            }
            $response_array['url']        = URL::asset('assets/' . $asset_directory . '/temp') . '/' . $image_upload_name;
            $response_array['file_name']  = $image_upload_name;
            $response_array['status']     = '1';
            $response_array['message']    = 'File uploaded';
            $response_array['image_name'] = $image_name;
        } else {
            $response_array['status']  = '0';
            $response_array['message'] = $image_name + ' could not be uploaded';
        }
        //if $createThumb is true, create thumb
        if ($create_thumb) {
        }
    } else {
        $response_array['status']  = '0';
        $response_array['message'] = $image_name + ' is not valid.';
    }
    return json_encode($response_array);
}

function compress($source, $destination, $quality)
{

    $info = getimagesize($source);

    if ($info['mime'] == 'image/jpeg')
        $image = imagecreatefromjpeg($source);

    elseif ($info['mime'] == 'image/gif')
        $image = imagecreatefromgif($source);
    elseif ($info['mime'] == 'image/png')
        $image = imagecreatefrompng($source);

    imagejpeg($image, $destination, $quality);

    return $destination;
}


function cropImage($image_info, $dimensions, $dimensions_large = null, $src = null, $src_large = null, $asset_directory = null, $change_file_name = TRUE)
{
    if ($change_file_name) {
        $new_file_name = date("His") . '_' . $image_info['image_name'];
    } else {
        $new_file_name = $image_info['image_name'];
    }

    $old_src = $src . $image_info['image_name'];
    $new_src = $src . $new_file_name;

    $targ_w = $dimensions['width'];
    $targ_h = $dimensions['height'];

    $targ_w_large = $dimensions_large['width'];
    $targ_h_large = $dimensions_large['height'];
    $new_src_2    = $src_large . $new_file_name;

    $jpeg_quality     = 100;
    $return['status'] = 0;

    if (exif_imagetype($old_src) == IMAGETYPE_PNG) {
        if ($dimensions_large) {
            //large image
            $thumb = imagecreatetruecolor($targ_w_large, $targ_h_large);
            imagealphablending($thumb, false);
            imagesavealpha($thumb, true);

            $source = imagecreatefrompng($old_src);
            imagealphablending($source, true);
            $source = imagecopyresampled($thumb, $source, 0, 0, $image_info['x'], $image_info['y'], $targ_w_large, $targ_h_large, $image_info['w'], $image_info['h']);

            imagepng($thumb, $new_src_2);
            //end
        }

        $thumb = imagecreatetruecolor($targ_w, $targ_h);
        imagealphablending($thumb, false);
        imagesavealpha($thumb, true);

        $source = imagecreatefrompng($old_src);
        imagealphablending($source, true);
        $source = imagecopyresampled($thumb, $source, 0, 0, $image_info['x'], $image_info['y'], $targ_w, $targ_h, $image_info['w'], $image_info['h']);

        imagepng($thumb, $old_src);

        rename($old_src, $new_src);
    } elseif (exif_imagetype($old_src) == IMAGETYPE_JPEG) {
        if ($dimensions_large) {
            //large image
            $img_r = imagecreatefromjpeg($old_src);
            $dst_r = ImageCreateTrueColor($targ_w_large, $targ_h_large);

            imagecopyresampled($dst_r, $img_r, 0, 0, $image_info['x'], $image_info['y'], $targ_w_large, $targ_h_large, $image_info['w'], $image_info['h']);
            imagejpeg($dst_r, $new_src_2, $jpeg_quality);
            //end image
        }

        $img_r = imagecreatefromjpeg($old_src);
        $dst_r = ImageCreateTrueColor($targ_w, $targ_h);

        imagecopyresampled($dst_r, $img_r, 0, 0, $image_info['x'], $image_info['y'], $targ_w, $targ_h, $image_info['w'], $image_info['h']);
        imagejpeg($dst_r, $old_src, $jpeg_quality);

        rename($old_src, $new_src);
        imagedestroy($dst_r);
    } else {
        $return['status'] = 1;
    }

    $return['image']    = '<img src="' . URL::asset('assets/' . $asset_directory . '/temp') . '/' . $new_file_name . '"  id="cropbox" />';
    $return['img_name'] = $new_file_name;

    //echo $tempFile.'--'.$targetFile;

    return json_encode($return);
}

function cropImageForGallery($image_info, $dimensions, $dimensions_large = null, $src = null, $src_large = null, $asset_directory = null)
{
    $new_file_name = $image_info['image_name'];
    $old_src       = $src . $image_info['image_name'];
    $new_src       = $src . $new_file_name;

    $targ_w = $dimensions['width'];
    $targ_h = $dimensions['height'];

    $targ_w_large = $dimensions_large['width'];
    $targ_h_large = $dimensions_large['height'];
    $new_src_2    = $src_large . $new_file_name;

    $jpeg_quality     = 100;
    $return['status'] = 0;

    if (exif_imagetype($old_src) == IMAGETYPE_PNG) {
        if ($dimensions_large) {
            //large image
            $thumb = imagecreatetruecolor($targ_w_large, $targ_h_large);
            imagealphablending($thumb, false);
            imagesavealpha($thumb, true);

            $source = imagecreatefrompng($old_src);
            imagealphablending($source, true);
            $source = imagecopyresampled($thumb, $source, 0, 0, $image_info['x'], $image_info['y'], $targ_w_large, $targ_h_large, $image_info['w'], $image_info['h']);

            imagepng($thumb, $new_src_2);
            //end
        }

        $thumb = imagecreatetruecolor($targ_w, $targ_h);
        imagealphablending($thumb, false);
        imagesavealpha($thumb, true);

        $source = imagecreatefrompng($old_src);
        imagealphablending($source, true);
        $source = imagecopyresampled($thumb, $source, 0, 0, $image_info['x'], $image_info['y'], $targ_w, $targ_h, $image_info['w'], $image_info['h']);

        imagepng($thumb, $old_src);

        rename($old_src, $new_src);
    } elseif (exif_imagetype($old_src) == IMAGETYPE_JPEG) {
        if ($dimensions_large) {
            //large image
            $img_r = imagecreatefromjpeg($old_src);
            $dst_r = ImageCreateTrueColor($targ_w_large, $targ_h_large);

            imagecopyresampled($dst_r, $img_r, 0, 0, $image_info['x'], $image_info['y'], $targ_w_large, $targ_h_large, $image_info['w'], $image_info['h']);
            imagejpeg($dst_r, $new_src_2, $jpeg_quality);
            //end image
        }

        $img_r = imagecreatefromjpeg($old_src);
        $dst_r = ImageCreateTrueColor($targ_w, $targ_h);

        imagecopyresampled($dst_r, $img_r, 0, 0, $image_info['x'], $image_info['y'], $targ_w, $targ_h, $image_info['w'], $image_info['h']);
        imagejpeg($dst_r, $old_src, $jpeg_quality);

        rename($old_src, $new_src);
        imagedestroy($dst_r);
    } else {
        $return['status'] = 1;
    }


    $return['image']    = '<img src="' . URL::asset('assets/' . $asset_directory . '/temp') . '/' . $new_file_name . '"  id="cropbox" />';
    $return['img_name'] = $new_file_name;

    //echo $tempFile.'--'.$targetFile;

    return json_encode($return);
}

function moveFile($source_path, $destination_path)
{
    $file = new File();
    if ($file->exists($source_path)) {
        chmod($source_path, 777);
        $file->move($source_path, $destination_path);
    }
}

function copyFile($source_path, $destination_path)
{
    copy($source_path, $destination_path);
}

function deleteFile($source_path)
{
    $file = new File();
    if ($file->exists($source_path)) {
        $file->delete($source_path);
    }
}

function getFileType($extension)
{
    //print_r($extension);die;
    $extensions = array(
        'jpg' => 'FILE_IMAGE_LABEL',
        'png' => 'FILE_IMAGE_LABEL',
        'jpeg' => 'FILE_IMAGE_LABEL',
        'gif' => 'FILE_IMAGE_LABEL',
        'doc' => 'FILE_WORD_LABEL',
        'docx' => 'FILE_WORD_LABEL',
        'xlsx' => 'FILE_EXCEL_LABEL',
        'xls' => 'FILE_EXCEL_LABEL',
        'ppt' => 'FILE_POWER_POINT_LABEL',
        'pptx' => 'FILE_POWER_POINT_LABEL',
        'mp3' => 'FILE_AUDIO_LABEL',
        'mp4' => 'FILE_VIDEO_LABEL',
        'avi' => 'FILE_VIDEO_LABEL'
    );

    if (array_key_exists($extension, $extensions)) {
        return $extensions[$extension];
    } else {
        return 'DIRECTORY_FILE_NAME';
    }
}

function resizeImage($image_info, $dimensions, $dimensions_large = null, $src = null, $src_large = null, $asset_directory = null, $keep_ratio = true)
{

    $width  = $image_info['w'];
    $height = $image_info['h'];
    if ($image_info['h'] <= 0 && $image_info['w'] <= 0)
        return false;
    else {
        $new_file_name = $image_info['image_name'];
        $old_src       = $src . $image_info['image_name'];
        $new_src       = $src . $new_file_name;
        copy($old_src, $new_src);
        $info         = getimagesize($old_src);
        $image        = '';
        $final_width  = 0;
        $final_height = 0;
        list($width_old, $height_old) = $info;
        if ($keep_ratio) {
            if ($width == 0)
                $factor = $height / $height_old;
            elseif ($height == 0)
                $factor = $width / $width_old;
            else
                $factor = min($width / $width_old, $height / $height_old);
            $final_width  = round($width_old * $factor);
            $final_height = round($height_old * $factor);
        } else {
            $final_width  = ($width <= 0) ? $width_old : $width;
            $final_height = ($height <= 0) ? $height_old : $height;
        }
        switch ($info[2]) {
            case IMAGETYPE_GIF:
                $image = imagecreatefromgif($new_src);
                break;
            case IMAGETYPE_JPEG:
                $image = imagecreatefromjpeg($new_src);
                break;
            case IMAGETYPE_PNG:
                $image = imagecreatefrompng($new_src);
                break;
            default:
                return false;
        }
        $image_resized = imagecreatetruecolor($final_width, $final_height);
        if ($info[2] == IMAGETYPE_GIF || $info[2] == IMAGETYPE_PNG) {
            $transparency = imagecolortransparent($image);
            if ($transparency >= 0) {
                $transparent_color = imagecolorsforindex($image, $trnprt_indx);
                $transparency      = imagecolorallocate($image_resized, $trnprt_color['red'], $trnprt_color['green'], $trnprt_color['blue']);
                imagefill($image_resized, 0, 0, $transparency);
                imagecolortransparent($image_resized, $transparency);
            } elseif ($info[2] == IMAGETYPE_PNG) {
                imagealphablending($image_resized, false);
                $color = imagecolorallocatealpha($image_resized, 0, 0, 0, 127);
                imagefill($image_resized, 0, 0, $color);
                imagesavealpha($image_resized, true);
            }
        }
        imagecopyresampled($image_resized, $image, 0, 0, 0, 0, $final_width, $final_height, $width_old, $height_old);
        switch ($info[2]) {
            case IMAGETYPE_GIF:
                imagegif($image_resized, $new_src);
                break;
            case IMAGETYPE_JPEG:
                imagejpeg($image_resized, $new_src);
                break;
            case IMAGETYPE_PNG:
                imagepng($image_resized, $new_src);
                break;
            default:

                return false;
        }
        imagedestroy($image_resized);
        $return['image']    = '<img src="' . URL::asset('assets/' . $asset_directory . '/temp') . '/' . $new_file_name . '"  id="cropbox" />';
        $return['img_name'] = $new_file_name;

        return $return;
    }
}


function image_fix_orientation($filename, $pathToSave)
{
    $exif = exif_read_data($filename);
    if (!empty($exif['Orientation'])) {
        $image = imagecreatefromjpeg($filename);
        switch ($exif['Orientation']) {
            case 3:
                $image = imagerotate($image, 180, 0);
                break;

            case 6:
                $image = imagerotate($image, -90, 0);
                break;

            case 8:
                $image = imagerotate($image, 90, 0);
                break;
        }
        imagejpeg($image, $pathToSave, 90);
    }
}

function orientateImage($image, $orientation)
{
    switch ($orientation) {

            // 888888
            // 88
            // 8888
            // 88
            // 88
        case 1:
            return $image;

            // 888888
            //     88
            //   8888
            //     88
            //     88
        case 2:
            return $image->flip('h');


            //     88
            //     88
            //   8888
            //     88
            // 888888
        case 3:
            return $image->rotate(180);

            // 88
            // 88
            // 8888
            // 88
            // 888888
        case 4:
            return $image->rotate(180)->flip('h');

            // 8888888888
            // 88  88
            // 88
        case 5:
            return $image->rotate(-90)->flip('h');

            // 88
            // 88  88
            // 8888888888
        case 6:
            return $image->rotate(-90);

            //         88
            //     88  88
            // 8888888888
        case 7:
            return $image->rotate(-90)->flip('v');

            // 8888888888
            //     88  88
            //         88
        case 8:
            return $image->rotate(90);

        default:
            return $image;
    }
}
