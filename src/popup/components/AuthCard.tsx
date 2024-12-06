import React from 'react'
import config from "../../constant/config"


const { EXTENSION_MIDDLE_PAGE_URL } = config

export default function AuthCard() {
    return (
        <div className=' mx_text-white'>
            <a href={EXTENSION_MIDDLE_PAGE_URL}>
                Please login First
            </a>
        </div>
    )
}
