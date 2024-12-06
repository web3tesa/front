export const MESSAGE_TYPE = {
    INJECT_TO_CONTENT: 'INJECT_TO_CONTENT',
    INJECT_TO_BACKGROUND: 'INJECT_TO_BACKGROUND',
    CONTENT_TO_INJECT: 'CONTENT_TO_INJECT',
    REFRESH_TOKEN_LIST: 'REFRESH_TOKEN_LIST'
}


// from inject to content
export const MessageInjectToContent = (message: IMessage) => {
    window.postMessage({
        type: MESSAGE_TYPE.INJECT_TO_CONTENT,
        message: JSON.stringify(message)
    })
}
// listen message from inject to content
export const GetMessageInjectToContent = (callBack: Function) => {
    window.addEventListener('message', (event) => {
        if (event.data.type === MESSAGE_TYPE.INJECT_TO_CONTENT) {
            callBack(event.data.message)
        }
    })
}


// from inject to background
export const MessageContentToInject = (message: IMessage) => {
    window.postMessage({
        type: MESSAGE_TYPE.CONTENT_TO_INJECT,
        message: JSON.stringify(message)
    })
}

//listen from content to inject
export const GetMessageContentToInject = (callBack: Function) => {
    window.addEventListener('message', (event) => {
        if (event.data.type === MESSAGE_TYPE.CONTENT_TO_INJECT) {
            callBack(event.data.message)
        }
    })
}


export const MessageContentToSidePannelToRefreshTokenList = (message?: any) => {
    chrome.runtime.sendMessage({
        from: "sidebar",
        to: "content",
        data: {
            type: MESSAGE_TYPE.REFRESH_TOKEN_LIST,
            message: JSON.stringify(message)
        }
    })
}

//listen from content to inject
export const GetMessageContentToSidePannelToRefreshTokenList = (callBack: Function) => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.from === 'background' && message.to === 'sidebar') {
            if (message.data.type == MESSAGE_TYPE.REFRESH_TOKEN_LIST)
                callBack(message.data.message as string)
        }
    });
}