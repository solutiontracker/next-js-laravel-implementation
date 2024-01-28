import ActiveLink from 'components/widgets/active-link';
import { useRouter } from 'next/router';

const AccountSidebar = () => {

    const router: any = useRouter();

    return (
        <div className="wf-page--settings__sidebar mb-20">
            <div className="wf-page--settings__sidebar__wrapper">
                <div className="wf-page--settings__sidebar__head">
                    <button className="wf-button wf-button--slim" onClick={() => router.push('/user/dashboard')}>
                        <div className="wf-button__content">
                            <span className="SystemLimited-icon SystemLimited-icon-arrow-left"></span>
                        </div>
                        <div className="wf-button__backdrop"></div>
                    </button>
                    <div className="wf-page--dashboard__title">Settings</div>
                </div>
                <ul className="wf-navigation">
                    <ActiveLink activeClassName="wf-navigation__item--active" href="/user/account" wildcard={true}>
                        <li className="wf-navigation__item">
                            <span className="SystemLimited-icon SystemLimited-icon-user mr-4"></span>
                            <span className="wf-navigation__item__text">My Account</span>
                        </li>
                    </ActiveLink>
                    <ul>
                        <ActiveLink activeClassName="wf-navigation__item--active" href="/user/account?action=detail">
                            <li className="wf-navigation__item wf-navigation__item--sub">
                                <span className="wf-navigation__item__text">Account Details</span>
                            </li>
                        </ActiveLink>
                        <ActiveLink activeClassName="wf-navigation__item--active" href="/user/account?action=connected-accounts">
                            <li className="wf-navigation__item wf-navigation__item--sub">
                                <span className="wf-navigation__item__text">Connected Accounts</span>
                            </li>
                        </ActiveLink>
                    </ul>

                    <ActiveLink activeClassName="wf-navigation__item--active" href="/user/subscription" wildcard={true}>
                        <li className="wf-navigation__item">
                            <span className="SystemLimited-icon SystemLimited-icon-subscription mr-4"></span>
                            <span className="wf-navigation__item__text">Subscriptions</span>
                        </li>
                    </ActiveLink>
                    <ul>
                        <ActiveLink activeClassName="wf-navigation__item--active" href="/user/subscription?action=active-subscription">
                            <li className="wf-navigation__item wf-navigation__item--sub">
                                <span className="wf-navigation__item__text">Active Subscriptions</span>
                            </li>
                        </ActiveLink>
                        <ActiveLink activeClassName="wf-navigation__item--active" href="/user/subscription?action=payment-methods">
                            <li className="wf-navigation__item wf-navigation__item--sub">
                                <span className="wf-navigation__item__text">Payment Methods</span>
                            </li>
                        </ActiveLink>
                        <ActiveLink activeClassName="wf-navigation__item--active" href="/user/subscription?action=billing-history">
                            <li className="wf-navigation__item wf-navigation__item--sub">
                                <span className="wf-navigation__item__text">Billing History</span>
                            </li>
                        </ActiveLink>
                        {/* <ActiveLink activeClassName="wf-navigation__item--active" href="/user/subscription?action=redeem-ltd-code">
                            <li className="wf-navigation__item wf-navigation__item--sub">
                                <span className="wf-navigation__item__text">Redeem LTD Code</span>
                            </li>
                        </ActiveLink> */}
                        <ActiveLink activeClassName="wf-navigation__item--active" href="/user/subscription?action=cancel-subscription">
                            <li className="wf-navigation__item wf-navigation__item--sub">
                                <span className="wf-navigation__item__text">Cancel Subscription</span>
                            </li>
                        </ActiveLink>
                    </ul>

                </ul>
            </div>
        </div>
    )
}

export default AccountSidebar
