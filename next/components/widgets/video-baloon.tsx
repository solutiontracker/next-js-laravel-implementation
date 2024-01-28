import React from 'react'
import { useAuth } from 'context/auth-provider';

const VideoBaloon = () => {

    const { cookie_consent, updateAction, video_baloon, updateVideoBaloon } = useAuth();

    return (
        <>
            {!video_baloon && Number(cookie_consent) === 1 && typeof window !== 'undefined' && (
                <div className="wf-video-ballon">
                    <div className="wf-video-ballon__thumb" onClick={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                        updateAction("play-video");
                    }}>
                        <span className="SystemLimited-icon SystemLimited-icon-play-circle"></span>
                    </div>
                    <div className="wf-video-ballon__details">
                        <div className="wf-video-ballon__details__title">Get to know</div>
                        <div className="wf-video-ballon__details__sub">Watch this short video to get overview of SystemLimited</div>
                    </div>
                    <div className="wf-video-ballon__close" onClick={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                        updateVideoBaloon(1);
                    }}>
                        <div className="SystemLimited-icon SystemLimited-icon-cancel"></div>
                    </div>
                </div>
            )}
        </>
    )
}

export default VideoBaloon