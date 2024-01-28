<?php

namespace App\Repositories;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Storage;

use App\Jobs\Bunny\CreateZone;

use Illuminate\Support\Str;

class WebsiteRepository extends AbstractRepository
{
    private $request;

    private $cdnRepository;

    private $userRepository;

    private $domains_end_with = ['.dev', '.dev.cc', '.local', '.localhost', '.test', '.tribe', '.staging', '.stage', '.example', '.invalid'];

    private $sub_domains = ['dev.', '.dev.', 'devsite.', 'wpdev.', 'webdev.', 'exampledev.', 'local.', 'test.', '.test.', 'staging.', '.staging.', 'staging1.', 'staging2.', 'staging3.', 'staging4.', 'staging5.', 'staging6.', 'staging7.', 'staging8.', 'staging9.', '.staging1.', '.staging2.', '.staging3.', '.staging4.', '.staging5.', '.staging6.', '.staging7.', '.staging8.', '.staging9.', 'stage.', '.stage.', 'sandbox.'];

    private $staging_hosting_providers = ['.nxcli.net', '.wpengine.com', '.staging.wpengine.com', '.myftpupload.com', '.mybluehost.com', '.dreamhosters.com', '.lightningbasehosted.com', '.kinsta.cloud', '.kinsta.com', '.flywheelstaging.com', '.pantheonsite.io', '-dev.ksysweb.com', '-stg.ksysweb.com', '.panth.io', '.wpstagecoach.com', '.wpsc.site', '.myraidbox.de', '.lndo.site', '.wpstage.net', '.mystagingwebsite.com', '.ddev.site', '.instawp.xyz', '.wpsandbox.org', '-tastewp.com', '.wpsandbox.pro', '.ngrok.io'];

    /**
     * __construct
     *
     * @param  mixed $request
     * @param  mixed $cdnRepository
     * @param  mixed $userRepository
     * @return void
     */
    public function __construct(Request $request, CdnRepository $cdnRepository, UserRepository $userRepository)
    {
        $this->request = $request;
        $this->cdnRepository = $cdnRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * listing
     *
     * @param  mixed $formInput
     * @return void
     */
    public function listing($formInput, $pagination = true)
    {
        $query = \App\Models\Website::where('user_id', request()->user()->id);

        if(in_array($formInput['type'], ['free', 'pro'])) {
            $query->where('type', $formInput['type']);
        }

        if($pagination) {
            $websites = $query->orderBy('created_at', 'DESC')->paginate($formInput['limit'])->toArray();

            foreach($websites['data'] as $key => $row) {
                $websites['data'][$key]['created_ago'] = \Carbon\Carbon::parse($row['created_at'])->diffForHumans();
            }
        } else {
            $websites = $query->orderBy('created_at', 'DESC')->get()->toArray();
        }

        return $websites;
    }

    /**
     * @param mixed $formInput
     *
     * @return [type]
     */
    public function fetch($formInput)
    {
        return \App\Models\Website::where('id', $formInput['id'])->where('user_id', request()->user()->id)->first();
    }

    /**
     * @param mixed $formInput
     *
     * @return [type]
     */
    public function fetchByUrl($formInput)
    {
        $website = \App\Models\Website::where('domain', get_url_hostname($formInput['url']))->where('user_id', request()->user()->id)->first();
        if($website) {
            $website->url = get_url_protocol($formInput['url']).'://'.get_url_hostname($formInput['url']);
            $website->save();
            return $website;
        } else {
            return array(
                'url' => getDomain($formInput['url'])
            );
        }
    }

    /**
     * @param mixed $formInput
     *
     * @return [type]
     */
    public function store($formInput)
    {
        $input = array();

        do {
            $token = Str::random(32);
        } while (\App\Models\Website::where("token", $token)->first() instanceof \App\Models\Website);

        $favicon = $this->getFavicon($formInput['url']);

        $input['favicon'] = $favicon;
        $input['cdn'] = (int)$formInput['cdn'];
        $input['user_id'] = request()->user()->id;
        $input['url'] = getDomain($formInput['url']);
        $input['domain'] = get_url_hostname($formInput['url']);
        $input['type'] = $formInput['type'];
        $input['volume'] = $formInput['volume'];
        $input['token'] = $token;
        $input['step'] = 0;
        $input['is_stage'] = $this->isStaging($input['domain']) ? 1 : 0;
        $input['cdn_status'] = request()->user()->is_free == 0 && (int)$formInput['cdn'] == 1 ? 'pending' : 'active';

        $website = \App\Models\Website::create($input);

        //Create zone job
        if(request()->user()->is_free == 0 && (int)$formInput['cdn'] == 1) {
            //Process job queue
            CreateZone::dispatch(['website_id' => $website->id, 'user_id' => request()->user()->id]);
        }

        return [
            'success' => true,
            'message' => "You have created website succesfully.",
            'data' => array(
                'website' => $website
            )
        ];
    }

    public function getFavicon($domain) {
        try {
            //Storage favicon
            $favicon = request()->user()->id.time() . '.png';

            $contents = file_get_contents('https://icon.horse/icon?fallback_text=000000&uri='.$domain.'&fallback_bg=ffffff&size=large&ignore_other_sizes=false');

            Storage::disk('ftp')->put('images/website/' . $favicon, $contents);
        } catch (\Exception $e) {
            $favicon = null;
        }
        return $favicon;
    }

    /**
     * removeFavicon
     *
     * @param  mixed $favicon
     * @return void
     */
    public function removeFavicon($favicon) {
        try {
            Storage::disk('ftp')->delete('images/website/' . $favicon);
        } catch (\Exception $e) {}
    }

    /**
     * update
     *
     * @param  mixed $formInput
     * @param  mixed $id
     * @return void
     */
    public function _update($formInput, $id)
    {
        $website = \App\Models\Website::where('id', $id)->where('user_id', request()->user()->id)->first();

        if ($website) {

            if(!$website->token) {
                do {
                    $token = Str::random(32);
                } while (\App\Models\Website::where("token", $token)->first() instanceof \App\Models\Website);
                $website->token = $token;
            }

            $url = getDomain($formInput['url']);

            if($url != $website->url) {
                $this->removeFavicon($website->favicon);
                $website->favicon = $this->getFavicon($formInput['url']);
            }

            $website->url = $url;

            $website->domain = get_url_hostname($formInput['url']);

            $website->type = $formInput['type'];

            $website->cdn = $formInput['cdn'];

            $website->volume = $formInput['volume'];

            $website->is_stage = $this->isStaging($website->domain) ? 1 : 0;

            //Pro user
            if(request()->user()->is_free == 0) {

                if($website->cdn && $website->type == "pro") {

                    if($website->zone_identifier) {

                        $response = $this->cdnRepository->updateZoneOrigin(['OriginUrl' => $website->url, 'zone_id' => $website->zone_identifier, 'volume' => $formInput['volume']]);

                        if($response['success']) {

                            $website->cdn_status = 'active';

                            $website->save();

                            //Update cdn rules
                            $this->updateCdnRules($website);

                            return [
                                'success' => true,
                                'data' => array(
                                    'website' => $website
                                ),
                            ];

                        } else {

                            $website->step = 0;

                            $website->zone_identifier = '';

                            $website->cname_identifier = '';

                            $website->cdn_domain_id = '';

                            $website->cdn_hostname = '';

                            $website->cdn = 0;

                            $website->cdn_status = 'active';

                            $website->save();

                            return [
                                'success' => true,
                                'data' => array(
                                    'website' => $website
                                ),
                            ];
                        }

                    } else {

                        $website->cdn_status = 'pending';

                        $website->step = 0;

                        $website->save();

                        //Create new zone by queue job
                        CreateZone::dispatch(['website_id' => $website->id, 'user_id' => request()->user()->id]);

                        return [
                            'success' => true,
                            'data' => array(
                                'website' => $website
                            ),
                        ];
                    }

                } else {

                    $website->cdn = 0;

                    $website->was_pro = 0;

                    $website->save();

                    $this->cdnRepository->disableZone(['website' => $website, 'cdn' => 0]);

                    return [
                        'success' => true,
                        'data' => array(
                            'website' => $website
                        ),
                    ];

                }

            } else {

                $website->cdn = 0;

                $website->was_pro = 0;

                $website->save();

                $this->cdnRepository->disableZone(['website' => $website, 'cdn' => 0]);

                return [
                    'success' => true,
                    'data' => array(
                        'website' => $website
                    ),
                ];
            }

        }

        return $website;
    }

    /**
     * updateCdnRules
     *
     * @param  mixed $website
     * @return void
     */
    public function updateCdnRules($website)
    {
        $rules = \App\Models\ZoneRule::where('zone_id', $website->zone_identifier)->get();
        if(count($rules) > 0) {
            foreach($rules as $rule) {
                if($rule->description == "redirect-1") {
                    $this->cdnRepository->addOrUpdateEdgeRule(0, $website, ['Guid' => $rule->guid]);
                } else if($rule->description == "redirect-2") {
                    $this->cdnRepository->addOrUpdateEdgeRule(1, $website, ['Guid' => $rule->guid]);
                } else if($rule->description == "headers-1") {
                    $this->cdnRepository->addOrUpdateEdgeRule(2, $website, ['Guid' => $rule->guid]);
                } else if($rule->description == "block-1") {
                    $this->cdnRepository->addOrUpdateEdgeRule(3, $website, ['Guid' => $rule->guid]);
                } else if($rule->description == "origin-1") {
                    $this->cdnRepository->addOrUpdateEdgeRule(4, $website, ['Guid' => $rule->guid]);
                }
            }
        }
    }

    /**
     * destroy
     *
     * @param  mixed $formInput
     * @param  mixed $id
     * @return void
     */
    public function destroy($formInput, $id)
    {
        $website = \App\Models\Website::where('id', $id)->where('user_id', request()->user()->id)->first();

        if($website) {

            //Remove favicon
            $this->removeFavicon($website->favicon);

            if($website->zone_identifier) {
                $this->cdnRepository->deleteZone($website->zone_identifier);
            }

            if($website->cname_identifier) {
                $this->cdnRepository->deleteCName($website->cname_identifier);
            }

           return $website->delete();
        }

        return null;
    }

    /**
     * @param mixed $formInput
     *
     * @return [type]
     */
    public function getTotalWebsite($formInput = array())
    {
        $query = \App\Models\Website::where('user_id', request()->user()->id);

        if(isset($formInput['type'])) {
            $query->where('type', $formInput['type']);
        }

        return $query->count();
    }

    /**
     * purgeZone
     *
     * @param  mixed $formInput
     * @return void
     */
    public function purgeZone($formInput)
    {
        $website = \App\Models\Website::where('id', $formInput['website_id'])->where('cdn', 1)->where('cdn_status', 'active')->first();

        if($website && $website->zone_identifier) {
            return $this->cdnRepository->purgeZone(['zone_id' => $website->zone_identifier]);
        } else {
            return [
                "success" => false,
                "message" => "Cdn is not enabled for this website.",
            ];
        }
    }

    /**
     * downloadPlugin
     * @param  mixed $formInput
     * @return void
     */
    public function downloadPlugin($formInput)
    {
        $version = config('settings.current_version');

        if(isset($formInput['website_id']) && $formInput['website_id']) {

            $user = $this->userRepository->getUserByWebsite($formInput['website_id']);

            $subscription = UserRepository::getActiveSubscription($user);

            // If user is pro
            if($user->is_free == 0 && $subscription) {
                $downloadUrl = (string) $this->cdnRepository->authenticate_cdn_url('/system-Pro-'.$version.'.zip');
            } else {
                $downloadUrl = 'https://system.io';
            }

        } else {
            $downloadUrl = 'https://system.io';
        }

        $json = array (
            "name" => "system Pro &#8211; WordPress Media Library Folders, Image Compression, Watermark, Lazyload &amp; more",
            "version" => $version,
            'download_url' => $downloadUrl,
            "author" => "<a href=\"https://system.io\">Media Library Folders - SystemLimited</a>",
            "author_profile" => "https://profiles.wordpress.org/SystemLimited/",
            "contributors" => array (
                "SystemLimited" => array (
                "profile" => "https://profiles.wordpress.org/SystemLimited/",
                "avatar" => "https://secure.gravatar.com/avatar/225601a561dd98ba1675cac71addc90e?s=96&d=monsterid&r=g",
                "display_name" => "SystemLimited"
                ),
                "bannedpoop" => array (
                "profile" => "https://profiles.wordpress.org/bannedpoop/",
                "avatar" => "https://secure.gravatar.com/avatar/7da952b8f126ad07552e5f6326fb415d?s=96&d=monsterid&r=g",
                "display_name" => "Ali Haider"
                ),
                "moazzammushtaq" => array (
                "profile" => "https://profiles.wordpress.org/moazzammushtaq/",
                "avatar" => "https://secure.gravatar.com/avatar/c451fd0a52547cd719a2c34b24fc019e?s=96&d=monsterid&r=g",
                "display_name" => "moazzammushtaq"
                )
            ),
            "requires" => "3.0",
            "tested" => "6.1",
            "requires_php" => false,
            "rating" => 100,
            "ratings" => array (
                "1" => 0,
                "2" => 0,
                "3" => 0,
                "4" => 0,
                "5" => 1
            ),
            "num_ratings" => 2,
            "support_threads" => 0,
            "support_threads_resolved" => 0,
            "active_installs" => 10,
            "last_updated" => "2022-11-03 9:25pm GMT",
            "added" => "2022-09-20",
            "homepage" => "https://system.io",
            "sections" => array (
                'description' => \View::make('plugin.installer-description')->render(),
                "installation" => \View::make('plugin.installer-installation')->render(),
                "faq" => \View::make('plugin.installer-faq')->render(),
                "changelog" => \View::make('plugin.installer-changelog')->render(),
                "screenshots" => \View::make('plugin.installer-screenshots')->render(),
                "reviews" => \View::make('plugin.installer-reviews')->render()
            ),
            "screenshots" => array (
                "1" => array (
                "src" => "https://ps.w.org/system/assets/screenshot-1.png?rev=2790843",
                "caption" => "system Media library Folders."
                ),
                "2" => array (
                "src" => "https://ps.w.org/system/assets/screenshot-2.gif?rev=2790844",
                "caption" => "Bulk select &amp; moving items by dragging in Media Library."
                ),
                "3" => array (
                "src" => "https://ps.w.org/system/assets/screenshot-3.gif?rev=2790844",
                "caption" => "Bulk items deletion from Media Library."
                ),
                "4" => array (
                "src" => "https://ps.w.org/system/assets/screenshot-4.gif?rev=2790844",
                "caption" => "New folder creation in Media Library."
                ),
                "5" => array (
                "src" => "https://ps.w.org/system/assets/screenshot-5.gif?rev=2790844",
                "caption" => "Drag and Drop items upload in a folder."
                ),
                "6" => array (
                "src" => "https://ps.w.org/system/assets/screenshot-6.gif?rev=2790844",
                "caption" => "Fast Media Search."
                )
            ),
            "tags" => array (
                "compress-images" => "compress images",
                "file-manager" => "file manager",
                "media-folder" => "media folder",
                "media-library-folders" => "media library folders",
                "watermark" => "watermark"
            ),
            "versions" => [],
            "donate_link" => "",
            "banners" => array (
                "low" => "https://ps.w.org/system/assets/banner-772x250.png?rev=2790826",
                "high" => "https://ps.w.org/system/assets/banner-1544x500.png?rev=2790826"
            )
        );

        return $json;
    }

    /**
     * Check if website is staging
     *
     * @param  mixed $domain
     * @return void
     */
    public function isStaging($domain)
    {
        $stage = false;

        foreach ($this->domains_end_with as $key => $tld) {
            if(Str::endsWith($domain, $tld)) {
                $stage = true;
                break;
            }
        }

        foreach ($this->sub_domains as $key => $tld) {
            if(Str::startsWith($domain, $tld)) {
                $stage = true;
                break;
            }
        }

        foreach ($this->staging_hosting_providers as $key => $tld) {
            if(Str::endsWith($domain, $tld)) {
                $stage = true;
                break;
            }
        }

        return $stage;
    }
}
