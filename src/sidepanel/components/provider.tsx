import React, { HTMLAttributes } from 'react'
import { UserValueProvider } from '../provider/userValue'
import { LoadingProvider } from '../provider/Loading'
import { RouterProvider } from '../provider/router'
import ConfigProvider from '../provider/Config'
import Theme from '../provider/theme'
import LanguageProvider from '../provider/language'

export default function SidePanelProvider(props: HTMLAttributes<HTMLDivElement>) {
    return (
        <LoadingProvider>
            <UserValueProvider>
                <ConfigProvider>
                    <RouterProvider>
                        <LanguageProvider>
                            <Theme>
                                {props.children}
                            </Theme>
                        </LanguageProvider>
                    </RouterProvider>
                </ConfigProvider>
            </UserValueProvider>
        </LoadingProvider>
    )
}
