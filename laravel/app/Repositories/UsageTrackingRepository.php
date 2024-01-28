<?php
namespace App\Repositories;

use Illuminate\Http\Request;

class UsageTrackingRepository extends AbstractRepository
{
    private $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * @param mixed $formInput
     * @param string $domain
     *
     * @return [type]
     */
    public function store($formInput, $domain)
    {
        if(isset($formInput['website_profile']['site_url']) && $formInput['website_profile']['site_url'] && isset($formInput['user_profile']['email']) && $formInput['user_profile']['email']) {

            $site_url = getDomain($formInput['website_profile']['site_url']);

            //User profile
            $user_profile = \App\Models\UsageTrackingUserProfile::where('site_url', $site_url)->where('email', $formInput['user_profile']['email'])->first();

            if($user_profile) {
                $user_profile->first_name = $formInput['user_profile']['first_name'];
                $user_profile->last_name = $formInput['user_profile']['last_name'];
                $user_profile->email = $formInput['user_profile']['email'];
                $user_profile->username = $formInput['user_profile']['username'];
                $user_profile->user_language = $formInput['user_profile']['user_language'];
                $user_profile->country_code = $formInput['user_profile']['country_code'];
                $user_profile->save();
            } else {
                $user_profile = \App\Models\UsageTrackingUserProfile::create([
                    'first_name' => $formInput['user_profile']['first_name'],
                    'last_name' => $formInput['user_profile']['last_name'],
                    'email' => $formInput['user_profile']['email'],
                    'username' => $formInput['user_profile']['username'],
                    'user_language' => $formInput['user_profile']['user_language'],
                    'country_code' => $formInput['user_profile']['country_code'],
                    'site_url' => $site_url
                ]);
            }

            //Website profile
            $website_profile = \App\Models\UsageTrackingWebsiteProfile::where('usage_tracking_user_profile_id', $user_profile->id)->where('site_url', $site_url)->first();

            if($website_profile) {
                $website_profile->title = $formInput['website_profile']['title'];
                $website_profile->admin_email = $formInput['website_profile']['admin_email'];
                $website_profile->home_url = $formInput['website_profile']['home_url'];
                $website_profile->timezone = $formInput['website_profile']['timezone'];
                $website_profile->site_language = $formInput['website_profile']['site_language'];
                $website_profile->multisite = $formInput['website_profile']['multisite'];
                $website_profile->environment_type = $formInput['website_profile']['environment_type'];
                $website_profile->save();
            } else {
                $website_profile = \App\Models\UsageTrackingWebsiteProfile::create([
                    'title' => $formInput['website_profile']['title'],
                    'admin_email' => $formInput['website_profile']['admin_email'],
                    'home_url' => $formInput['website_profile']['home_url'],
                    'timezone' => $formInput['website_profile']['timezone'],
                    'site_language' => $formInput['website_profile']['site_language'],
                    'multisite' => $formInput['website_profile']['multisite'],
                    'environment_type' => $formInput['website_profile']['environment_type'],
                    'site_url' => $site_url,
                    'usage_tracking_user_profile_id' => $user_profile->id,
                ]);
            }

            //System profile
            $system_profile = \App\Models\UsageTrackingSystemProfile::where('usage_tracking_website_profile_id', $website_profile->id)->first();

            if($system_profile) {
                $system_profile->wordpress_version = $formInput['system_profile']['wordpress_version'];
                $system_profile->webserver = $formInput['system_profile']['webserver'];
                $system_profile->php_version = $formInput['system_profile']['php_version'];
                $system_profile->database_extension = $formInput['system_profile']['database_extension'];
                $system_profile->database_server_version = $formInput['system_profile']['database_server_version'];
            } else {
                \App\Models\UsageTrackingSystemProfile::create([
                    'wordpress_version' => $formInput['system_profile']['wordpress_version'],
                    'webserver' => $formInput['system_profile']['webserver'],
                    'php_version' => $formInput['system_profile']['php_version'],
                    'database_extension' => $formInput['system_profile']['database_extension'],
                    'database_server_version' => $formInput['system_profile']['database_server_version'],
                    'usage_tracking_website_profile_id' => $website_profile->id,
                ]);
            }

            //system profile
            $system_profile = \App\Models\UsageTrackingSystemLimitedProfile::where('usage_tracking_website_profile_id', $website_profile->id)->first();

            if($system_profile) {
                $system_profile->version = isset($formInput['system_profile']['version']) ? $formInput['system_profile']['version'] : '';
                $system_profile->plan_id = isset($formInput['system_profile']['plan_id']) ? (int)$formInput['system_profile']['plan_id'] : 0;
                $system_profile->website_id = isset($formInput['system_profile']['website_id']) ? $formInput['system_profile']['website_id'] : '';
                $system_profile->total_images_compressed = $formInput['system_profile']['total_images_compressed'];
                $system_profile->total_images_watermarked = $formInput['system_profile']['total_images_watermarked'];
                $system_profile->total_folders_created = $formInput['system_profile']['total_folders_created'];
                $system_profile->active_modules = $formInput['system_profile']['active_modules'];
                $system_profile->total_bytes_saved = $formInput['system_profile']['total_bytes_saved'];
                $system_profile->feedback_id = isset($formInput['system_profile']['feedback_id']) ? $formInput['system_profile']['feedback_id'] : '';
                $system_profile->rating_id = isset($formInput['system_profile']['rating_id']) ? $formInput['system_profile']['rating_id'] : '';
                $system_profile->newsletter_id = isset($formInput['system_profile']['newsletter_id']) ? $formInput['system_profile']['newsletter_id'] : '';
                $system_profile->current_plugin_status = $formInput['system_profile']['current_plugin_status'];
                $system_profile->active_timestamp = $formInput['system_profile']['active_timestamp'];
                $system_profile->deactive_timestamp = $formInput['system_profile']['deactive_timestamp'];
                $system_profile->uninstall_timestamp = $formInput['system_profile']['uninstall_timestamp'];
                $system_profile->usage_tracking_disable_timestamp = $formInput['system_profile']['usage_tracking_disable_timestamp'];
                $system_profile->subscription_upgrade_timestamp = $formInput['system_profile']['subscription_upgrade_timestamp'];
                $system_profile->is_tour_guide = isset($formInput['system_profile']['is_tour_guide']) ? $formInput['system_profile']['is_tour_guide'] : 0;
                $system_profile->subscription_downgrade_timestamp = $formInput['system_profile']['subscription_downgrade_timestamp'];
                $system_profile->account_connection_timestamp = $formInput['system_profile']['account_connection_timestamp'];
                $system_profile->installer_step = $formInput['system_profile']['installer_step'];
                $system_profile->data_imported_plugins = isset($formInput['system_profile']['data_imported_plugins']) ? $formInput['system_profile']['data_imported_plugins'] : [];
                $system_profile->save();
            } else {
                \App\Models\UsageTrackingSystemLimitedProfile::create([
                    'version' => isset($formInput['system_profile']['version']) ? $formInput['system_profile']['version'] : '',
                    'plan_id' => isset($formInput['system_profile']['plan_id']) ? (int)$formInput['system_profile']['plan_id'] : 0,
                    'website_id' => isset($formInput['system_profile']['website_id']) ? $formInput['system_profile']['website_id'] : '',
                    'total_images_compressed' => $formInput['system_profile']['total_images_compressed'],
                    'total_images_watermarked' => $formInput['system_profile']['total_images_watermarked'],
                    'total_folders_created' => $formInput['system_profile']['total_folders_created'],
                    'active_modules' => $formInput['system_profile']['active_modules'],
                    'total_bytes_saved' => $formInput['system_profile']['total_bytes_saved'],
                    'feedback_id' => isset($formInput['system_profile']['feedback_id']) ? $formInput['system_profile']['feedback_id'] : '',
                    'rating_id' => isset($formInput['system_profile']['rating_id']) ? $formInput['system_profile']['rating_id'] : '',
                    'newsletter_id' => $formInput['system_profile']['newsletter_id'],
                    'current_plugin_status' => $formInput['system_profile']['current_plugin_status'],
                    'active_timestamp' => $formInput['system_profile']['active_timestamp'],
                    'deactive_timestamp' => $formInput['system_profile']['deactive_timestamp'],
                    'uninstall_timestamp' => $formInput['system_profile']['uninstall_timestamp'],
                    'usage_tracking_disable_timestamp' => $formInput['system_profile']['usage_tracking_disable_timestamp'],
                    'subscription_upgrade_timestamp' => $formInput['system_profile']['subscription_upgrade_timestamp'],
                    'is_tour_guide' => isset($formInput['system_profile']['is_tour_guide']) ? $formInput['system_profile']['is_tour_guide'] : 0,
                    'subscription_downgrade_timestamp' => $formInput['system_profile']['subscription_downgrade_timestamp'],
                    'account_connection_timestamp' => $formInput['system_profile']['account_connection_timestamp'],
                    'installer_step' => $formInput['system_profile']['installer_step'],
                    'data_imported_plugins' => isset($formInput['system_profile']['data_imported_plugins']) ? $formInput['system_profile']['data_imported_plugins'] : [],
                    'usage_tracking_website_profile_id' => isset($website_profile->id) ? $website_profile->id : '',
                ]);
            }

            //Media profile
            $media_profile = \App\Models\UsageTrackingMediaProfile::where('usage_tracking_website_profile_id', $website_profile->id)->first();

            if($media_profile) {
                $media_profile->active_media_editor = $formInput['media_profile']['active_media_editor'];
                $media_profile->media_count = $formInput['media_profile']['media_count'];
            } else {
                \App\Models\UsageTrackingMediaProfile::create([
                    'active_media_editor' => $formInput['media_profile']['active_media_editor'],
                    'media_count' => $formInput['media_profile']['media_count'],
                    'usage_tracking_website_profile_id' => $website_profile->id,
                ]);
            }

            //Active theme profile
            $theme_profile = \App\Models\UsageTrackingThemeProfile::where('name', $formInput['theme_profile']['current_theme'])->first();

            if(!$theme_profile) {
                $theme_profile = \App\Models\UsageTrackingThemeProfile::create([
                    'name' => $formInput['theme_profile']['current_theme'],
                ]);
            }

            $website_theme_profile = \App\Models\UsageTrackingWebsiteThemeProfile::where('usage_tracking_website_profile_id', $website_profile->id)->where('usage_tracking_theme_profile_id', $theme_profile->id)->first();

            if(!$website_theme_profile) {
                \App\Models\UsageTrackingWebsiteThemeProfile::create([
                    'usage_tracking_website_profile_id' => $website_profile->id,
                    'usage_tracking_theme_profile_id' => $theme_profile->id,
                    'status' => 'current'
                ]);
            }

            //Other themes
            if(isset($formInput['theme_profile']['themes']) && count((array)$formInput['theme_profile']['themes']) > 0) {
                foreach($formInput['theme_profile']['themes'] as $key => $value) {
                    $theme_profile = \App\Models\UsageTrackingThemeProfile::where('name', $value['label'])->first();
                    if(!$theme_profile) {
                        $theme_profile = \App\Models\UsageTrackingThemeProfile::create([
                            'name' => $value['label'],
                        ]);
                    }
                    $website_theme_profile = \App\Models\UsageTrackingWebsiteThemeProfile::where('usage_tracking_website_profile_id', $website_profile->id)->where('usage_tracking_theme_profile_id', $theme_profile->id)->first();
                    if(!$website_theme_profile) {
                        \App\Models\UsageTrackingWebsiteThemeProfile::create([
                            'usage_tracking_website_profile_id' => $website_profile->id,
                            'usage_tracking_theme_profile_id' => $theme_profile->id,
                            'status' => 'other'
                        ]);
                    }
                }
            }

            //Active plugins
            if(isset($formInput['plugins_profile']['active']) && count((array)$formInput['plugins_profile']['active']) > 0) {
                foreach($formInput['plugins_profile']['active'] as $key => $value) {
                    $plugin_profile = \App\Models\UsageTrackingPluginProfile::where('name', $value['label'])->first();
                    if(!$plugin_profile) {
                        $plugin_profile = \App\Models\UsageTrackingPluginProfile::create([
                            'name' => $value['label'],
                        ]);
                    }
                    $website_plugin_profile = \App\Models\UsageTrackingWebsitePluginProfile::where('usage_tracking_website_profile_id', $website_profile->id)->where('usage_tracking_plugin_profile_id', $plugin_profile->id)->first();
                    if(!$website_plugin_profile) {
                        \App\Models\UsageTrackingWebsitePluginProfile::create([
                            'usage_tracking_website_profile_id' => $website_profile->id,
                            'usage_tracking_plugin_profile_id' => $plugin_profile->id,
                            'status' => 'active'
                        ]);
                    }
                }
            }

            //Inactive plugins
            if(isset($formInput['plugins_profile']['inactive']) && count((array)$formInput['plugins_profile']['inactive']) > 0) {
                foreach($formInput['plugins_profile']['inactive'] as $key => $value) {
                    $plugin_profile = \App\Models\UsageTrackingPluginProfile::where('name', $value['label'])->first();
                    if(!$plugin_profile) {
                        $plugin_profile = \App\Models\UsageTrackingPluginProfile::create([
                            'name' => $value['label'],
                        ]);
                    }
                    $website_plugin_profile = \App\Models\UsageTrackingWebsitePluginProfile::where('usage_tracking_website_profile_id', $website_profile->id)->where('usage_tracking_plugin_profile_id', $plugin_profile->id)->first();
                    if(!$website_plugin_profile) {
                        \App\Models\UsageTrackingWebsitePluginProfile::create([
                            'usage_tracking_website_profile_id' => $website_profile->id,
                            'usage_tracking_plugin_profile_id' => $plugin_profile->id,
                            'status' => 'inactive'
                        ]);
                    }
                }
            }

        }

    }
}
