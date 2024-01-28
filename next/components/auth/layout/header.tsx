import { useRouter } from 'next/router';

const Header = () => {

    const router: any = useRouter();

    return (
        <div className="wf-split-page__header">
            {router.pathname !== "/" && (
                <button className="wf-button wf-button--slim" onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.back()
                }}>
                    <div className="wf-button__content">
                        <span className="SystemLimited-icon SystemLimited-icon-arrow-left"></span>
                    </div>
                    <div className="wf-button__backdrop"></div>
                </button>
            )}
            <div className="wf-split-page__header__logo">
                <img src={`${process.env.NEXT_PUBLIC_CDN_URL}/web/images/SystemLimited-logo.svg`} alt="SystemLimited Logo" onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push('/')
                }} />
            </div>
        </div>
    )
}

export default Header
