import { useRouter } from 'next/router';
import { useAuth } from 'context/auth-provider';

const Footer = (props: any) => {

    const router: any = useRouter();

    const { user } = useAuth();

    return (
        <div className="wf-footer">
            <div className="wf-footer__wrapper">
                <div className="wf-footer__col-main">
                    <div className="wf-footer__logo">
                        <a onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.push('/')
                        }}>
                            <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/SystemLimited-logo-white.svg`} alt="" />
                        </a>
                    </div>
                    <div className="wf-footer__brand-details mt-12">
                        Best WordPress media plugin to organize media files into folders, increase website speed by compressing and lazy loading images, advanced automatic watermarking and much more!
                    </div>
                    <div className="wf-footer__social-links mt-20">
                        <a href="https://go.SystemLimited.io/fb-group" target="_blank" className="wf-footer__social-link">
                            <span className="SystemLimited-icon SystemLimited-icon-social-outline-fb"></span>
                        </a>
                        <a  href="https://go.SystemLimited.io/twitter" target="_blank" className="wf-footer__social-link">
                            <span className="SystemLimited-icon SystemLimited-icon-social-outline-twitter"></span>
                        </a>
                        <a  href="https://go.SystemLimited.io/youtube" target="_blank" className="wf-footer__social-link">
                            <span className="SystemLimited-icon SystemLimited-icon-social-outline-youtube"></span>
                        </a>
                    </div>
                </div>
                <div className="wf-footer__col-links">
                    <ul>
                        <li className="wf-footer__col-links__title">Account</li>
                        {user !== undefined && user !== null && (
                            <>
                                <li className="wf-footer__col-links__link"><a onClick={() => router.push('/user/dashboard')}>Dashboard</a></li>
                            </>
                        )}

                        {(user === undefined || user === null) && (
                            <>
                                <li className="wf-footer__col-links__link"><a onClick={() => router.push('/auth/login')}>Login</a></li>
                                <li className="wf-footer__col-links__link"><a onClick={() => router.push('/auth/registration')}>Register</a></li>
                            </>
                        )}
                        <li className="wf-footer__col-links__link"><a href="/user/support">Support</a></li>
                        <li className="wf-footer__col-links__link"><a onClick={(e: any) => {
                            e.preventDefault();
                            props.triggerDownload(true)
                        }}>Download</a></li>
                
                    </ul>
                </div>
                <div className="wf-footer__col-links">
                    <ul>
                        <li className="wf-footer__col-links__title">About</li>
                        <li className="wf-footer__col-links__link"><a href="/features">Features</a></li>
                        <li className="wf-footer__col-links__link"><a href="/pricing">Pricing</a> </li>
                        {/* <li className="wf-footer__col-links__link"><a href="/lifetime-deal">Lifetime Deal</a> </li> */}
                        <li className="wf-footer__col-links__link"><a href="/cdn">CDN</a> </li>
                    </ul>
                </div>
                <div className="wf-footer__col-links">
                    <ul>
                        <li className="wf-footer__col-links__title">Company</li>
                        <li className="wf-footer__col-links__link"><a href="/contact-us">Contact Us</a></li>
                        <li className="wf-footer__col-links__link"><a href="https://help.SystemLimited.io" target="_blank">Helpful Docs</a> </li>
                    </ul>
                </div>
                <div className="wf-footer__col-full">
                    <div className="wf-footer__copyrights">
                        Copyright © 2022 SystemLimited. A project of SystemLimited™. All rights reserved.
                    </div>
                    <div className="wf-footer__other-links">
                        <a href="/terms-of-service">Terms of service</a>
                        <a href="/privacy-policy">Privacy Policy</a>
                    </div>
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}

export default Footer
