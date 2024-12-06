import React from 'react'
import './index.css'

export default function MxLoading() {
    return (
        <div className='mx_relative mx_h-full mx_text-center'>
            <div className="logo-container mx_m-auto">
                <div className="checkmark-circle">
                    <div className="checkmark mx_w-full mx_h-full mx_bg-mx_primary_light mx_rounded-full mx_flex mx_mx-auto">
                        <svg width="42" height="32" viewBox="0 0 42 32" fill="none" xmlns="http://www.w3.org/2000/svg" className='mx_m-auto'>
                            <path d="M34.2216 0.490596L16.6254 17.7469L7.67427 8.50126C7.01333 7.81765 5.92182 7.80254 5.24199 8.46349L0.524731 13.0297C-0.158876 13.6906 -0.17776 14.7821 0.486962 15.4657L15.2393 30.7052C15.904 31.3926 16.9993 31.404 17.6829 30.7355L41.2276 7.63636C41.9075 6.97164 41.9188 5.88014 41.2503 5.20031L36.6539 0.517034C35.9892 -0.162795 34.8977 -0.174126 34.2178 0.494373L34.2216 0.490596Z" fill="white" />
                        </svg>

                    </div>
                </div>
                <div className="wave wave1">
                    <div className='wave-child' />
                </div>
                <div className="wave wave2">
                    <div className='wave-child' />
                </div>
                <div className="wave wave3">
                    <div className='wave-child' />
                </div>
            </div>
                <p className='mx_italic mx_text-xl mx_font-semibold mx_text-mx_primary_light mx_absolute mx_bottom-0 mx_w-full mx_text-center'>
                    AI Model Looking for Best Route
                </p>
        </div>

    )
}
