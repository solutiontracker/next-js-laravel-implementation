import React from 'react'
import { useAuth } from 'context/auth-provider';
import Iframe from 'react-iframe'

const VideoIframe = () => {

    const { updateAction, action } = useAuth();

    return (
        <>
            {typeof window !== 'undefined' && action === "play-video" && (
                <div className="wf-modal wf-modal--lightbox">
                    <div className="wf-modal__modal-wrapper">
                        <div className="wf-modal__close" onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            updateAction("");
                        }}>
                            <span className="SystemLimited-icon SystemLimited-icon-cancel"></span>
                        </div>
                        <div className="wf-modal__content">
                            <div className="intro-video">
                                <Iframe url="https://www.youtube.com/embed/COCmK09h8R4"
                                    width="560"
                                    height="315"
                                    frameBorder={0}
                                    display="block"
                                    position="relative"
                                />
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default VideoIframe