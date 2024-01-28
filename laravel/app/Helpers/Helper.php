<?php

use Illuminate\Support\Str;

use Illuminate\Support\Facades\Http;

use \Firebase\JWT\JWT;

function print_all($data)
{
    echo '<pre>';
    print_r($data);
    exit;
}

function array_change_key_value($array, $old_key, $new_key)
{
    if (!array_key_exists($old_key, $array))
        return $array;
    $keys = array_keys($array);
    $keys[array_search($old_key, $keys)] = $new_key;
    return array_combine($keys, $array);
}

function user()
{
    return request()->user();
}

function trim_data($data)
{
    if ($data == null)
        return '';

    if (is_array($data)) {
        return array_map('trim_data', $data);
    } else return trim($data);
}

function  get_trim_all_data($formInput, $entity = '')
{
    if (in_array($entity, ['attendee', 'speaker', 'sponsor', 'exhibitor'])) {
        $trimmed_array = trim_data($formInput);
        return $trimmed_array;
    } else {
        return $formInput;
    }
}

function readArrayKey($row, $array, $key)
{
    foreach ($row[$key] as $val) {
        $array[$val['name']] = $val['value'];
    }
    return $array;
}

function readArrayIndex($array, $index)
{
    if (isset($array[$index])) {
        return $array[$index];
    }

    return;
}

function returnArrayKeys($array, $keys)
{
    $final_array = array();
    if (count($array) > 0) {
        foreach ($array as $record) {
            $temp_array = array();
            foreach ($record as $key => $rec) {
                if (in_array($key, $keys) && is_array($rec)) {
                    foreach ($record[$key] as $info) {
                        $temp_array[$info['name']] = $info['value'];
                    }
                } else {
                    $temp_array[$key] = $rec;
                }
            }
            $final_array[] = $temp_array;
        }
    } else {
        return $array;
    }
    return $final_array;
}

function verifyDate($date)
{
    return (DateTime::createFromFormat('d-m-Y', $date) !== false);
}

function verifyTime($date)
{
    if ((DateTime::createFromFormat('H:i', $date) !== false) || (DateTime::createFromFormat('H:i:s', $date) !== false) || (DateTime::createFromFormat('H.i', $date) !== false) || (DateTime::createFromFormat('H.i.s', $date) !== false)) {
        return false;
    } else
        return true;
}

function set_error_delimeter($errors)
{
    $array = array();
    if (count($errors) > 0) {
        foreach ($errors as $error) {
            array_push($array, $error);
        }
    }
    return $array;
}

function cdn($url = null)
{
    $url = (string) $url;
    if (empty($url)) {
        throw new Exception('URL missing');
    }

    $pattern = '|^http[s]{0,1}://|i';
    if (preg_match($pattern, $url)) {
        throw new Exception(
            'Invalid URL. ' .
                'Use: /image.jpeg instead of full URI: ' .
                'http://domain.com/image.jpeg.'
        );
    }

    $pattern = '|^/|';
    if (!preg_match($pattern, $url)) {
        $url = '/' . $url;
    }

    if (!config('cdn.cdn_enabled')) {
        return $url;
    } else {
        return config('cdn.cdn_protocol') . '://' . config('cdn.cdn_domain') . $url;
    }
}

function days($from, $to)
{
    $from = \Carbon\Carbon::parse(\Carbon\Carbon::parse($from)->toDateString());
    return $days = $from->diffInDays(\Carbon\Carbon::parse(\Carbon\Carbon::parse($to)->toDateString()), false);
}

function is_base64($string)
{
    return Str::contains($string, 'base64');
}

function fetchImageName($url)
{
    $pathinfo = pathinfo($url);
    return $pathinfo['filename'] . '.' . $pathinfo['extension'];
}

function getCurrency($floatcurr, $curr = "USD")
{
    $currencies['ARS'] = array(2, ',', '.');          //  Argentine Peso
    $currencies['AMD'] = array(2, '.', ',');          //  Armenian Dram
    $currencies['AWG'] = array(2, '.', ',');          //  Aruban Guilder
    $currencies['AUD'] = array(2, '.', ' ');          //  Australian Dollar
    $currencies['BSD'] = array(2, '.', ',');          //  Bahamian Dollar
    $currencies['BHD'] = array(3, '.', ',');          //  Bahraini Dinar
    $currencies['BDT'] = array(2, '.', ',');          //  Bangladesh, Taka
    $currencies['BZD'] = array(2, '.', ',');          //  Belize Dollar
    $currencies['BMD'] = array(2, '.', ',');          //  Bermudian Dollar
    $currencies['BOB'] = array(2, '.', ',');          //  Bolivia, Boliviano
    $currencies['BAM'] = array(2, '.', ',');          //  Bosnia and Herzegovina, Convertible Marks
    $currencies['BWP'] = array(2, '.', ',');          //  Botswana, Pula
    $currencies['BRL'] = array(2, ',', '.');          //  Brazilian Real
    $currencies['BND'] = array(2, '.', ',');          //  Brunei Dollar
    $currencies['CAD'] = array(2, '.', ',');          //  Canadian Dollar
    $currencies['KYD'] = array(2, '.', ',');          //  Cayman Islands Dollar
    $currencies['CLP'] = array(0, '', '.');           //  Chilean Peso
    $currencies['CNY'] = array(2, '.', ',');          //  China Yuan Renminbi
    $currencies['COP'] = array(2, ',', '.');          //  Colombian Peso
    $currencies['CRC'] = array(2, ',', '.');          //  Costa Rican Colon
    $currencies['HRK'] = array(2, ',', '.');          //  Croatian Kuna
    $currencies['CUC'] = array(2, '.', ',');          //  Cuban Convertible Peso
    $currencies['CUP'] = array(2, '.', ',');          //  Cuban Peso
    $currencies['CYP'] = array(2, '.', ',');          //  Cyprus Pound
    $currencies['CZK'] = array(2, '.', ',');          //  Czech Koruna
    $currencies['DKK'] = array(2, ',', '.');          //  Danish Krone
    $currencies['DOP'] = array(2, '.', ',');          //  Dominican Peso
    $currencies['XCD'] = array(2, '.', ',');          //  East Caribbean Dollar
    $currencies['EGP'] = array(2, '.', ',');          //  Egyptian Pound
    $currencies['SVC'] = array(2, '.', ',');          //  El Salvador Colon
    $currencies['ATS'] = array(2, ',', '.');          //  Euro
    $currencies['BEF'] = array(2, ',', '.');          //  Euro
    $currencies['DEM'] = array(2, ',', '.');          //  Euro
    $currencies['EEK'] = array(2, ',', '.');          //  Euro
    $currencies['ESP'] = array(2, ',', '.');          //  Euro
    $currencies['EUR'] = array(2, ',', '.');          //  Euro
    $currencies['FIM'] = array(2, ',', '.');          //  Euro
    $currencies['FRF'] = array(2, ',', '.');          //  Euro
    $currencies['GRD'] = array(2, ',', '.');          //  Euro
    $currencies['IEP'] = array(2, ',', '.');          //  Euro
    $currencies['ITL'] = array(2, ',', '.');          //  Euro
    $currencies['LUF'] = array(2, ',', '.');          //  Euro
    $currencies['NLG'] = array(2, ',', '.');          //  Euro
    $currencies['PTE'] = array(2, ',', '.');          //  Euro
    $currencies['GHC'] = array(2, '.', ',');          //  Ghana, Cedi
    $currencies['GIP'] = array(2, '.', ',');          //  Gibraltar Pound
    $currencies['GTQ'] = array(2, '.', ',');          //  Guatemala, Quetzal
    $currencies['HNL'] = array(2, '.', ',');          //  Honduras, Lempira
    $currencies['HKD'] = array(2, '.', ',');          //  Hong Kong Dollar
    $currencies['HUF'] = array(0, '', '.');           //  Hungary, Forint
    $currencies['ISK'] = array(0, '', '.');           //  Iceland Krona
    $currencies['INR'] = array(2, '.', ',');          //  Indian Rupee
    $currencies['IDR'] = array(2, ',', '.');          //  Indonesia, Rupiah
    $currencies['IRR'] = array(2, '.', ',');          //  Iranian Rial
    $currencies['JMD'] = array(2, '.', ',');          //  Jamaican Dollar
    $currencies['JPY'] = array(0, '', ',');           //  Japan, Yen
    $currencies['JOD'] = array(3, '.', ',');          //  Jordanian Dinar
    $currencies['KES'] = array(2, '.', ',');          //  Kenyan Shilling
    $currencies['KWD'] = array(3, '.', ',');          //  Kuwaiti Dinar
    $currencies['LVL'] = array(2, '.', ',');          //  Latvian Lats
    $currencies['LBP'] = array(0, '', ' ');           //  Lebanese Pound
    $currencies['LTL'] = array(2, ',', ' ');          //  Lithuanian Litas
    $currencies['MKD'] = array(2, '.', ',');          //  Macedonia, Denar
    $currencies['MYR'] = array(2, '.', ',');          //  Malaysian Ringgit
    $currencies['MTL'] = array(2, '.', ',');          //  Maltese Lira
    $currencies['MUR'] = array(0, '', ',');           //  Mauritius Rupee
    $currencies['MXN'] = array(2, '.', ',');          //  Mexican Peso
    $currencies['MZM'] = array(2, ',', '.');          //  Mozambique Metical
    $currencies['NPR'] = array(2, '.', ',');          //  Nepalese Rupee
    $currencies['ANG'] = array(2, '.', ',');          //  Netherlands Antillian Guilder
    $currencies['ILS'] = array(2, '.', ',');          //  New Israeli Shekel
    $currencies['TRY'] = array(2, '.', ',');          //  New Turkish Lira
    $currencies['NZD'] = array(2, '.', ',');          //  New Zealand Dollar
    $currencies['NOK'] = array(2, ',', '.');          //  Norwegian Krone
    $currencies['PKR'] = array(2, '.', ',');          //  Pakistan Rupee
    $currencies['PEN'] = array(2, '.', ',');          //  Peru, Nuevo Sol
    $currencies['UYU'] = array(2, ',', '.');          //  Peso Uruguayo
    $currencies['PHP'] = array(2, '.', ',');          //  Philippine Peso
    $currencies['PLN'] = array(2, '.', ' ');          //  Poland, Zloty
    $currencies['GBP'] = array(2, '.', ',');          //  Pound Sterling
    $currencies['OMR'] = array(3, '.', ',');          //  Rial Omani
    $currencies['RON'] = array(2, ',', '.');          //  Romania, New Leu
    $currencies['ROL'] = array(2, ',', '.');          //  Romania, Old Leu
    $currencies['RUB'] = array(2, ',', '.');          //  Russian Ruble
    $currencies['SAR'] = array(2, '.', ',');          //  Saudi Riyal
    $currencies['SGD'] = array(2, '.', ',');          //  Singapore Dollar
    $currencies['SKK'] = array(2, ',', ' ');          //  Slovak Koruna
    $currencies['SIT'] = array(2, ',', '.');          //  Slovenia, Tolar
    $currencies['ZAR'] = array(2, '.', ' ');          //  South Africa, Rand
    $currencies['KRW'] = array(0, '', ',');           //  South Korea, Won
    $currencies['SZL'] = array(2, '.', ', ');         //  Swaziland, Lilangeni
    $currencies['SEK'] = array(2, ',', '.');          //  Swedish Krona
    $currencies['CHF'] = array(2, '.', '\'');         //  Swiss Franc
    $currencies['TZS'] = array(2, '.', ',');          //  Tanzanian Shilling
    $currencies['THB'] = array(2, '.', ',');          //  Thailand, Baht
    $currencies['TOP'] = array(2, '.', ',');          //  Tonga, Paanga
    $currencies['AED'] = array(2, '.', ',');          //  UAE Dirham
    $currencies['UAH'] = array(2, ',', ' ');          //  Ukraine, Hryvnia
    $currencies['USD'] = array(2, '.', ',');          //  US Dollar
    $currencies['VUV'] = array(0, '', ',');           //  Vanuatu, Vatu
    $currencies['VEF'] = array(2, ',', '.');          //  Venezuela Bolivares Fuertes
    $currencies['VEB'] = array(2, ',', '.');          //  Venezuela, Bolivar
    $currencies['VND'] = array(0, '', '.');           //  Viet Nam, Dong
    $currencies['ZWD'] = array(2, '.', ' ');          //  Zimbabwe Dollar

    if (!function_exists('formatinr')) {
        function formatinr($input)
        {
            //CUSTOM FUNCTION TO GENERATE ##,##,###.##
            $dec = "";
            $pos = strpos($input, ".");
            if ($pos === false) {
                //no decimals
            } else {
                //decimals
                $dec = substr(round(substr($input, $pos), 2), 1);
                $input = substr($input, 0, $pos);
            }
            $num = substr($input, -3); //get the last 3 digits
            $input = substr($input, 0, -3); //omit the last 3 digits already stored in $num
            while (strlen($input) > 0) //loop the process - further get digits 2 by 2
            {
                $num = substr($input, -2) . "," . $num;
                $input = substr($input, 0, -2);
            }
            return $num . $dec;
        }
    }


    if ($curr == "INR") {
        return formatinr($floatcurr);
    } else {
        return number_format($floatcurr, $currencies[$curr][0], $currencies[$curr][1], $currencies[$curr][2]);
    }
}

function getCurrencyArray()
{
    return array('208' => 'DKK', '978' => 'EUR', '840' => 'USD', '578' => 'NOK', '752' => 'SEK', '036' => 'AUD', '756' => 'CHF', '36' => 'AUD', '826' => 'GBP');
}

function getDatesFromRange($date_time_from, $date_time_to)
{
    // cut hours, because not getting last day when hours of time to is less than hours of time_from
    // see while loop
    $start = \Carbon\Carbon::createFromFormat('Y-m-d', substr($date_time_from, 0, 10));
    $end = \Carbon\Carbon::createFromFormat('Y-m-d', substr($date_time_to, 0, 10));
    $dates = [];
    while ($start->lte($end)) {
        $dates[] = $start->copy()->format('m/d/Y');
        $start->addDay();
    }
    return $dates;
}

function set_lang($date)
{
    $a_find_months = array(
        'January',
        'Jan',
        'February',
        'Feb',
        'March',
        'Mar',
        'April',
        'Apr',
        'May',
        'June',
        'Jun',
        'July',
        'Jul',
        'August',
        'Aug',
        'September',
        'Sep',
        'October',
        'Oct',
        'November',
        'Nov',
        'December',
        'Dec',
    );

    $a_translations_months = array(
        'January' => __('wizard.datetime.DT_JANUARY'),
        'Jan' => __('wizard.datetime.DT_JANUARY'),
        'February' => __('wizard.datetime.DT_FEBUARY'),
        'Feb' => __('wizard.datetime.DT_FEBUARY'),
        'March' => __('wizard.datetime.DT_MARCH'),
        'Mar' => __('wizard.datetime.DT_MARCH'),
        'April' => __('wizard.datetime.DT_APRIL'),
        'Apr' => __('wizard.datetime.DT_APRIL'),
        'May' => __('wizard.datetime.DT_MAY'),
        'June' => __('wizard.datetime.DT_JUN'),
        'Jun' => __('wizard.datetime.DT_JUN'),
        'July' => __('wizard.datetime.DT_JULY'),
        'Jul' => __('wizard.datetime.DT_JULY'),
        'August' => __('wizard.datetime.DT_AUGUST'),
        'Aug' => __('wizard.datetime.DT_AUGUST'),
        'September' => __('wizard.datetime.DT_SEPTEMBER'),
        'Sep' => __('wizard.datetime.DT_SEPTEMBER'),
        'October' => __('wizard.datetime.DT_OCTOBER'),
        'Oct' => __('wizard.datetime.DT_OCTOBER'),
        'November' => __('wizard.datetime.DT_NOVEMBER'),
        'Nov' => __('wizard.datetime.DT_NOVEMBER'),
        'December' => __('wizard.datetime.DT_DECEMBER'),
        'Dec' => __('wizard.datetime.DT_DECEMBER'),
    );

    $date = str_replace($a_find_months, $a_translations_months, $date);

    $a_find_time = array(
        'pm' => 'PM',
        'am' => 'AM',
    );

    $a_translations_time = array(
        'PM' => __('wizard.datetime.DT_PM'),
        'AM' => __('wizard.datetime.DT_AM')
    );

    $date = str_replace($a_find_time, $a_translations_time, $date);

    $a_find_days = array(
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    );

    $a_translations_days = array(
        'Sunday' => __('wizard.datetime.DT_SUNDAY'),
        'Monday' => __('wizard.datetime.DT_MONDAY'),
        'Tuesday' => __('wizard.datetime.DT_TUESDAY'),
        'Wednesday' => __('wizard.datetime.DT_WEDNESDAY'),
        'Thursday' => __('wizard.datetime.DT_THURSDAY'),
        'Friday' => __('wizard.datetime.DT_FRIDAY'),
        'Saturday' => __('wizard.datetime.DT_SATURDAY')
    );

    $date = str_replace($a_find_days, $a_translations_days, $date);

    return $date;
}

function group_by($key, $data)
{
    $result = array();
    foreach ($data as $val) {
        if (array_key_exists($key, $val)) {
            $result[$val[$key]][] = $val;
        } else {
            $result[""][] = $val;
        }
    }
    return $result;
}

function get_url_hostname($url)
{
    $parse = parse_url($url);
    if(isset($parse['host']) && $parse['host']) {
        return str_ireplace('www.', '', $parse['host']);
    } else {
        return $url;
    }
}

function get_url_protocol($url)
{
    $parse = parse_url($url);
    if(isset($parse['scheme']) && $parse['scheme']) {
        return $parse['scheme'];
    } else {
        return 'https';
    }
}

/**
 * @param mixed $allDates
 * @param mixed $date
 *
 * @return [type]
 */
function getClosestNextDate($allDates, $date)
{
    function date_sort($a, $b)
    {
        return strtotime($a) - strtotime($b);
    }
    usort($allDates, "date_sort");
    foreach ($allDates as $count => $dateSingle) {
        if (strtotime($date) <= strtotime($dateSingle)) {
            $nextDate = date('Y-m-d', strtotime($dateSingle));
            break;
        }
    }
    return $nextDate;
}

/**
 * @param mixed $email
 * @param string $mask_char
 * @param mixed $percent=50
 *
 * @return [type]
 */
function maskEmail($email, $mask_char = '***', $percent = 50)
{
    list($user, $domain) = preg_split("/@/", $email);
    $len = strlen($user);
    $mask_count = floor($len * $percent / 100);
    $offset = floor(($len - $mask_count) / 2);
    $masked = substr($user, 0, $offset)
        . str_repeat($mask_char, $mask_count)
        . substr($user, $mask_count + $offset);

    return ($masked . '@' . $domain);
}

/**
 * @param mixed $number
 *
 * @return [type]
 */
function maskPhoneNumber($number)
{
    $mask_number =  str_repeat("*", strlen($number) - 4) . substr($number, -2);
    return $mask_number;
}

/**
 * @param mixed $format
 * @param mixed $date
 *
 * @return [type]
 */
function getFormatDate($format, $date)
{
    $result = trim(strftime($format, strtotime($date)));

    return $result;
}

function getContentTypeByExtension($ext)
{
    $types = array(
        'ai'      => 'application/postscript',
        'aif'     => 'audio/x-aiff',
        'aifc'    => 'audio/x-aiff',
        'aiff'    => 'audio/x-aiff',
        'asc'     => 'text/plain',
        'atom'    => 'application/atom+xml',
        'atom'    => 'application/atom+xml',
        'au'      => 'audio/basic',
        'avi'     => 'video/x-msvideo',
        'bcpio'   => 'application/x-bcpio',
        'bin'     => 'application/octet-stream',
        'bmp'     => 'image/bmp',
        'cdf'     => 'application/x-netcdf',
        'cgm'     => 'image/cgm',
        'class'   => 'application/octet-stream',
        'cpio'    => 'application/x-cpio',
        'cpt'     => 'application/mac-compactpro',
        'csh'     => 'application/x-csh',
        'css'     => 'text/css',
        'csv'     => 'text/csv',
        'dcr'     => 'application/x-director',
        'dir'     => 'application/x-director',
        'djv'     => 'image/vnd.djvu',
        'djvu'    => 'image/vnd.djvu',
        'dll'     => 'application/octet-stream',
        'dmg'     => 'application/octet-stream',
        'dms'     => 'application/octet-stream',
        'doc'     => 'application/msword',
        'dtd'     => 'application/xml-dtd',
        'dvi'     => 'application/x-dvi',
        'dxr'     => 'application/x-director',
        'eps'     => 'application/postscript',
        'etx'     => 'text/x-setext',
        'exe'     => 'application/octet-stream',
        'ez'      => 'application/andrew-inset',
        'gif'     => 'image/gif',
        'gram'    => 'application/srgs',
        'grxml'   => 'application/srgs+xml',
        'gtar'    => 'application/x-gtar',
        'hdf'     => 'application/x-hdf',
        'hqx'     => 'application/mac-binhex40',
        'htm'     => 'text/html',
        'html'    => 'text/html',
        'ice'     => 'x-conference/x-cooltalk',
        'ico'     => 'image/x-icon',
        'ics'     => 'text/calendar',
        'ief'     => 'image/ief',
        'ifb'     => 'text/calendar',
        'iges'    => 'model/iges',
        'igs'     => 'model/iges',
        'jpe'     => 'image/jpeg',
        'jpeg'    => 'image/jpeg',
        'jpg'     => 'image/jpeg',
        'js'      => 'application/x-javascript',
        'json'    => 'application/json',
        'kar'     => 'audio/midi',
        'latex'   => 'application/x-latex',
        'lha'     => 'application/octet-stream',
        'lzh'     => 'application/octet-stream',
        'm3u'     => 'audio/x-mpegurl',
        'man'     => 'application/x-troff-man',
        'mathml'  => 'application/mathml+xml',
        'me'      => 'application/x-troff-me',
        'mesh'    => 'model/mesh',
        'mid'     => 'audio/midi',
        'midi'    => 'audio/midi',
        'mif'     => 'application/vnd.mif',
        'mov'     => 'video/quicktime',
        'movie'   => 'video/x-sgi-movie',
        'mp2'     => 'audio/mpeg',
        'mp3'     => 'audio/mpeg',
        'mpe'     => 'video/mpeg',
        'mpeg'    => 'video/mpeg',
        'mpg'     => 'video/mpeg',
        'mpga'    => 'audio/mpeg',
        'ms'      => 'application/x-troff-ms',
        'msh'     => 'model/mesh',
        'mxu'     => 'video/vnd.mpegurl',
        'nc'      => 'application/x-netcdf',
        'oda'     => 'application/oda',
        'ogg'     => 'application/ogg',
        'pbm'     => 'image/x-portable-bitmap',
        'pdb'     => 'chemical/x-pdb',
        'pdf'     => 'application/pdf',
        'pgm'     => 'image/x-portable-graymap',
        'pgn'     => 'application/x-chess-pgn',
        'png'     => 'image/png',
        'pnm'     => 'image/x-portable-anymap',
        'ppm'     => 'image/x-portable-pixmap',
        'ppt'     => 'application/vnd.ms-powerpoint',
        'ps'      => 'application/postscript',
        'qt'      => 'video/quicktime',
        'ra'      => 'audio/x-pn-realaudio',
        'ram'     => 'audio/x-pn-realaudio',
        'ras'     => 'image/x-cmu-raster',
        'rdf'     => 'application/rdf+xml',
        'rgb'     => 'image/x-rgb',
        'rm'      => 'application/vnd.rn-realmedia',
        'roff'    => 'application/x-troff',
        'rss'     => 'application/rss+xml',
        'rtf'     => 'text/rtf',
        'rtx'     => 'text/richtext',
        'sgm'     => 'text/sgml',
        'sgml'    => 'text/sgml',
        'sh'      => 'application/x-sh',
        'shar'    => 'application/x-shar',
        'silo'    => 'model/mesh',
        'sit'     => 'application/x-stuffit',
        'skd'     => 'application/x-koan',
        'skm'     => 'application/x-koan',
        'skp'     => 'application/x-koan',
        'skt'     => 'application/x-koan',
        'smi'     => 'application/smil',
        'smil'    => 'application/smil',
        'snd'     => 'audio/basic',
        'so'      => 'application/octet-stream',
        'spl'     => 'application/x-futuresplash',
        'src'     => 'application/x-wais-source',
        'sv4cpio' => 'application/x-sv4cpio',
        'sv4crc'  => 'application/x-sv4crc',
        'svg'     => 'image/svg+xml',
        'svgz'    => 'image/svg+xml',
        'swf'     => 'application/x-shockwave-flash',
        't'       => 'application/x-troff',
        'tar'     => 'application/x-tar',
        'tcl'     => 'application/x-tcl',
        'tex'     => 'application/x-tex',
        'texi'    => 'application/x-texinfo',
        'texinfo' => 'application/x-texinfo',
        'tif'     => 'image/tiff',
        'tiff'    => 'image/tiff',
        'tr'      => 'application/x-troff',
        'tsv'     => 'text/tab-separated-values',
        'txt'     => 'text/plain',
        'ustar'   => 'application/x-ustar',
        'vcd'     => 'application/x-cdlink',
        'vrml'    => 'model/vrml',
        'vxml'    => 'application/voicexml+xml',
        'wav'     => 'audio/x-wav',
        'wbmp'    => 'image/vnd.wap.wbmp',
        'wbxml'   => 'application/vnd.wap.wbxml',
        'wml'     => 'text/vnd.wap.wml',
        'wmlc'    => 'application/vnd.wap.wmlc',
        'wmls'    => 'text/vnd.wap.wmlscript',
        'wmlsc'   => 'application/vnd.wap.wmlscriptc',
        'wrl'     => 'model/vrml',
        'xbm'     => 'image/x-xbitmap',
        'xht'     => 'application/xhtml+xml',
        'xhtml'   => 'application/xhtml+xml',
        'xls'     => 'application/vnd.ms-excel',
        'xml'     => 'application/xml',
        'xpm'     => 'image/x-xpixmap',
        'xsl'     => 'application/xml',
        'xslt'    => 'application/xslt+xml',
        'xul'     => 'application/vnd.mozilla.xul+xml',
        'xwd'     => 'image/x-xwindowdump',
        'xyz'     => 'chemical/x-xyz',
        'zip'     => 'application/zip'
    );
    return $types[strtolower($ext)];
}

function generateQRHash($id, $prefix, $key)
{
    $hash = hash_hmac('md5', $id, $key);
    return $prefix . $hash;
}

function generateQrImage($qrContent = '', $width = 200, $height = 200, $imageType = 'png')
{
    if ($imageType == 'png') {
        $renderer = new \BaconQrCode\Renderer\Image\Png();
    }
    $renderer->setWidth($width);
    $renderer->setHeight($height);
    $writer = new \BaconQrCode\Writer($renderer);
    return $writer->writeString($qrContent);
}

function getDomain($url) {
    $result = parse_url($url);
    if(isset($result['host']) && $result['host']) {
        return $result['scheme']."://".$result['host'];
    } else {
        return $url;
    }
}

function readableBytes($num) {
    $neg = $num < 0;

    $units = array('B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');

    if ($neg){
        $num = -$num;
    }

    if ($num < 1){
        return ($neg ? '-' : '') . (int)$num . ' B';
    }

    $exponent = min(floor(log($num) / log(1000)), count($units) - 1);

    $num = sprintf('%.02F', ($num / pow(1000, $exponent)));

    $unit = $units[$exponent];

    return ($neg ? '-' : '') . $num . ' ' . $unit;
}

function getFrillToken($user) {
    try {
        $frillSSOKey = config('services.frill.api_key');
        $userData = [
        'email' => $user['email'],
        'id' => $user['id'],
        'name' => $user['name'],
        ];
        $frillUserToken = JWT::encode($userData, $frillSSOKey, 'HS256');
        return $frillUserToken;
    } catch (\Throwable $th) {
        \Log::error($th);
        return null;
    }

}
