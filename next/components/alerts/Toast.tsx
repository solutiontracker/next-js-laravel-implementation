import React, { ReactElement, FC } from "react";

const Toast: FC<any> = (props: any): ReactElement => {

    return (
        <div className={`wf-toast ${props.error === "true" ? 'wf-toast--error' : ''}`}>
            <div className="wf-toast__text">
                {props.message}
            </div>
            <div className="wf-toast__close" onClick={(e: any) => {
                e.preventDefault();
                e.stopPropagation();
                props?.cancel();
            }}>
                <span className="SystemLimited-icon SystemLimited-icon-cancel"></span>
            </div>
        </div>
    )
};

export default Toast;