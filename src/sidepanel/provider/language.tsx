import React, { HTMLAttributes, createContext, useContext, useEffect } from 'react'
import { ELanguage } from '../../types/enum'

interface ILanguageContext {
    language: ELanguage,
    setLanguage: (language: ELanguage) => void
}

export const LanguageContext = createContext<ILanguageContext>({
    language: ELanguage.EN,
    setLanguage: (language: ELanguage) => { }
})

export default function LanguageProvider(props: HTMLAttributes<HTMLDivElement>) {
    const [language, setLanguageState] = React.useState<ELanguage>(ELanguage.EN)
    const setLanguage = (language: ELanguage) => {
        chrome.storage.local.set({ language })
        setLanguageState(language)
    }
    useEffect(() => {
        chrome.storage.local.get('language', (result) => {
            setLanguageState(result.language || ELanguage.EN)
        })
    }, [])
    return <LanguageContext.Provider value={
        {
            language,
            setLanguage
        }
    } >
        {props.children}
    </LanguageContext.Provider>
}
