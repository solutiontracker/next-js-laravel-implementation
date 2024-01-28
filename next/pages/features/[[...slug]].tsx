import type { NextPage } from 'next'
import React from "react";
import Master from 'components/layout/master'
import Head from 'next/head'
import { useAuth } from 'context/auth-provider';

const Features: NextPage = () => {

    const { trial_days } = useAuth();
    
    return (
        <Master>

            <Head>
                <title>Features List | SystemLimited</title>
                <meta name="description" content="SystemLimited is the best WordPress Media Library Folders and Image Optimization plugin. Here are the features that make SystemLimited the most powerful and user-friendly WordPress media toolkit in the market." />
                <link rel="canonical" href="https://SystemLimited.io/" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:site_name" content="SystemLimited" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Features List | SystemLimited" />
                <meta property="og:description" content="SystemLimited is the best WordPress Media Library Folders and Image Optimization plugin. Here are the features that make SystemLimited the most powerful and user-friendly WordPress media toolkit in the market." />
                <meta property="og:url" content="https://SystemLimited.io/" />
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`}/>
                <meta property="og:image:secure_url" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`}/>
                <meta property="og:image:width" content="1720" />
                <meta property="og:image:height" content="1000" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@SystemLimited_io" />
                <meta name="twitter:title" content="Features List | SystemLimited" />
                <meta name="twitter:description" content="SystemLimited is the best WordPress Media Library Folders and Image Optimization plugin. Here are the features that make SystemLimited the most powerful and user-friendly WordPress media toolkit in the market." />
                <meta name="twitter:creator" content="@SystemLimited_io" />
                <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/product/SystemLimited-social-card.png`} />
                
                <link rel='dns-prefetch' href='//js.stripe.com' />
                <link rel='dns-prefetch' href='//fonts.googleapis.com' />
            </Head>

            <div className="wf-hero wf-hero--other-pages">
                <div className="wf-hero__duo-wrapper">
                    <div className="wf-hero__content wf-hero__content--action-section wf-hero__content--solo">
                        <div className="wf-hero__title">Complete features list</div>
                        <div className="wf-hero__sub wf-hero__sub--680 mt-8">SystemLimited is the best WordPress Media Library Folders and Image Optimization plugin. Here are the features that make SystemLimited the most powerful and user-friendly WordPress All-in-One WordPress Media toolkit.</div>
                    </div>
                </div>
            </div>

            <div className="clearfix"></div>
            <div className="wf-page-section wf-page-section--features">
                <div className="wf-page-section__wrapper">
                    <div className="wf-page-section__title">Powerful Media Library</div>
                    <div className="wf-page-section__sub mt-8">Unclutter &amp; supercharge your WP Media Library with tons of features</div>
                    <div className="wf-page-section__feature-blocks">
                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Media Upload.</div>
                            <div className="wf-page-section__feature-blocks__sub">Upload media by dragging and dropping.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Folder Upload. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Upload the folder with all its media in one go.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Powerful Uploader.</div>
                            <div className="wf-page-section__feature-blocks__sub">WP default uploader will be replaced with SystemLimited powerful and user-friendly uploader.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Star Media. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Starring is a way to bookmark your important media or folders.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Trash Bin.</div>
                            <div className="wf-page-section__feature-blocks__sub">The trash bin is temporary storage for media or folders set aside for deletion.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">List View.</div>
                            <div className="wf-page-section__feature-blocks__sub">Powerful list view with column control.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Grid View.</div>
                            <div className="wf-page-section__feature-blocks__sub">WP default grid view replaced with SystemLimited enhanced grid view.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Folder Search. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Easily search folders and subfolders.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Folder Sorting. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Sort folders in ascending or descending order.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Bulk Compression.</div>
                            <div className="wf-page-section__feature-blocks__sub">Compress thousands of images in one go, also supports directory compression.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Bulk Watermarking.</div>
                            <div className="wf-page-section__feature-blocks__sub">Watermark thousands of images in one go also supports directory watermarking.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Media Search.</div>
                            <div className="wf-page-section__feature-blocks__sub">SystemLimited will start searching media as soon as you start typing.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Advanced Media Sorting and Filters.</div>
                            <div className="wf-page-section__feature-blocks__sub">Sort media based on different sorting orders and filters.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Powerful Context Menu.</div>
                            <div className="wf-page-section__feature-blocks__sub">A feature-packed context menu to keep all-powerful controls under a single click.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Bulk Bar.</div>
                            <div className="wf-page-section__feature-blocks__sub">Bulk bar to apply different actions in a one go on multiple items.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Media Download. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Download all the items from your media library or just the ones that you want.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Goto item location. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Easily locate an item inside its enclosing folder.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Shortcuts. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Create a shortcut to link to a file or folder.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Cut & Paste. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Easily cut media/folders from one place and paste them somewhere else.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Move To.</div>
                            <div className="wf-page-section__feature-blocks__sub">Easily move selected items to a different folder.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Add To. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Add selected items into a newly created folder.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Bulk Selection by Dragging.</div>
                            <div className="wf-page-section__feature-blocks__sub">Easily select items just by dragging and holding the click.</div>
                        </div>
                    </div>

                    <div className="wf-page-section__title">Powerful & Fast CDN</div>
                    <div className="wf-page-section__sub wf-page-section__sub--500 mt-8">Serve images from SystemLimited CDN with compression on the fly. There are over 100 edge locations in our CDN network which spans over 69 countries and 6 continents</div>
                    <div className="wf-page-section__feature-blocks">
                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Compress on Fly. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Use SystemLimited CDN to automatically compress your images on the fly. No compression is done on original images.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Super Compression. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Compress images up to 2x more than regular compression with almost no visible drop in quality.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Strip Image Metadata. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Photos often store camera settings in the file, i.e., focal length, date, time and location. Removing EXIF data reduces the file size.</div>
                        </div>


                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Automatic Resizing. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Images will be automatically resized to match container size, preventing the 'properly size image' warning in Google PageSpeed.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Auto WebP compression. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Images will be automatically converted and served as WebP to compatible browsers.</div>
                        </div>
                    </div>

                    <div className="wf-page-section__title">Image Compression</div>
                    <div className="wf-page-section__sub wf-page-section__sub--500 mt-8">Compress images to reduce size without the loss of quality. This will increase website speed and improve page load times</div>
                    <div className="wf-page-section__feature-blocks">
                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Automatic Compression.</div>
                            <div className="wf-page-section__feature-blocks__sub">When you upload images to your site, SystemLimited will automatically optimize and compress them for you.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Super Compression. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Compress images up to 2x more than regular compression with almost no visible drop in quality.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Convert PNG to JPEG. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">When you compress a PNG, SystemLimited will check if converting it to JPEG could further reduce its size.</div>
                        </div>


                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Strip Image Metadata.</div>
                            <div className="wf-page-section__feature-blocks__sub">Photos often store camera settings in the file, i.e., focal length, date, time and location. Removing EXIF data reduces the file size.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Image Resizing.</div>
                            <div className="wf-page-section__feature-blocks__sub">Detect unnecessarily large oversize images on your pages to reduce their size and decrease load times.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Disable WordPress default Compression.</div>
                            <div className="wf-page-section__feature-blocks__sub">WordPress automatically compresses uploaded images by up to 90%. If these images are further compressed with SystemLimited the drop in image quality is often noticeable.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Compress Original Full-size images. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Do you want SystemLimited to compress the copy of the original full-size image?</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Compressed Images backup & restoration.</div>
                            <div className="wf-page-section__feature-blocks__sub">SystemLimited will store original images in a separate folder so if an image is lossy after compression you will be able to revert to the original.</div>
                        </div>
                    </div>

                    <div className="wf-page-section__title">Image Watermark</div>
                    <div className="wf-page-section__sub wf-page-section__sub--500 mt-8">Automatically add watermarks to images as they are uploaded to the media library. You can also watermark existing images</div>
                    <div className="wf-page-section__feature-blocks">
                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Automatic Watermarking.</div>
                            <div className="wf-page-section__feature-blocks__sub">When you upload images to your site, SystemLimited will automatically watermark them for you.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Image Watermark Type.</div>
                            <div className="wf-page-section__feature-blocks__sub">Select an image to be used as a watermark.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Text Watermark Type.</div>
                            <div className="wf-page-section__feature-blocks__sub">Use SystemLimited advanced text watermark builder.</div>
                        </div>


                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Watermark Size. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Adjust the size of the watermark.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Watermark Position. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Define the position where the watermark will be displayed such as the top left.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Watermark Opacity. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Make the watermark semi-transparent.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Watermarked Images backup & restoration.</div>
                            <div className="wf-page-section__feature-blocks__sub">SystemLimited will store original images in a separate folder so you will be able to revert to the original non-watermarked state.</div>
                        </div>
                    </div>

                    <div className="wf-page-section__title">3rd Party Support</div>
                    <div className="wf-page-section__sub wf-page-section__sub--500 mt-8">Directly integrate SystemLimited into over 20+ plugins and themes. This means that you can now have SystemLimited media library management everywhere</div>
                    <div className="wf-page-section__feature-blocks">
                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Gutenberg Support.</div>
                            <div className="wf-page-section__feature-blocks__sub">Integrate SystemLimited folder structure directly into Gutenberg.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Classic Editor Support. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Integrate SystemLimited folder structure directly into Classic Editor.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">WooCommerce Support. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Integrate SystemLimited folder structure directly into WooCommerce.</div>
                        </div>


                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Elementor Support. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Integrate SystemLimited folder structure directly into Elementor.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Beaver Builder Support. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Integrate SystemLimited folder structure directly into Beaver Builder.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Brizy Builder Support. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Integrate SystemLimited folder structure directly into Brizy Builder .</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Cornerstone Builder Support. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Integrate SystemLimited folder structure directly into Cornerstone Builder.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Divi Builder Support. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Integrate SystemLimited folder structure directly into Divi Builder.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Thrive Quiz Builder Support. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Integrate SystemLimited folder structure directly into Thrive Quiz Builder.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Fusion Builder Support. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Integrate SystemLimited folder structure directly into Fusion Builder.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Oxygen Builder Support. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Integrate SystemLimited folder structure directly into Oxygen Builder.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Tatsu Builder Support. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Integrate SystemLimited folder structure directly into Tatsu Builder.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Dokan Support. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Integrate SystemLimited folder structure directly into Dokan.</div>
                        </div>
                    </div>

                    <div className="wf-page-section__title">Additional Modules</div>
                    <div className="wf-page-section__sub wf-page-section__sub--500 mt-8">SystemLimited have built-in modules to further extend the functionality</div>
                    <div className="wf-page-section__feature-blocks">
                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Lazy Load.</div>
                            <div className="wf-page-section__feature-blocks__sub">Speed up your website by loading images as they scroll into view and reduce the number of images that need to be loaded on a page upfront.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Media Download. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Download all the items from your media library or just the ones that you want. Selected items will be zipped and start downloading instantly.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Folder Colors. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Make your folders stand out from the crowd by applying colours to them. Because different folders will be used for different purposes.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Starred Media & Folders. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Starring is a way to bookmark your important media or folders. This allows you to quickly access your most important media or folders at all times.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Trash Bin.</div>
                            <div className="wf-page-section__feature-blocks__sub">The trash bin is temporary storage for media or folders set aside for deletion. In case something happens, they can be restored.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">WooCommerce Folders. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Organize all of your WooCommerce product images into folders automatically created on basis of products, categories, and more.</div>
                        </div>

                        <div className="wf-page-section__feature-blocks__single">
                            <div className="wf-page-section__feature-blocks__title">Gutenberg Gallery. <div className="wf-badge wf-badge--warning">Pro</div></div>
                            <div className="wf-page-section__feature-blocks__sub">Create dynamic galleries from a folder. Show images in columns set the maximum number of images per column, choose the layout, and much more.</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="wf-cta-section">
                <div className="wf-cta-section__wrapper">
                    <div className="wf-heading-section">
                        <div className="wf-heading-section__title">Unlock the full power of SystemLimited</div>
                        <div className="wf-heading-section__sub wf-heading-section__sub--max-700 mt-8">Setup takes less than 3 minutes. What are you waiting for?</div>
                        <button className="wf-button wf-button--primary wf-button--x-large mt-32">
                            <div className="wf-button__content">
                                <div className="wf-button__text">Start {trial_days}-Days free trial</div>
                            </div>
                            <div className="wf-button__backdrop"></div>
                        </button>
                    </div>
                </div>
            </div>

        </Master>
    )
}

export default Features
