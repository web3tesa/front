
enum EWalletType {
    NOT_CONNECT,
    METAMASK,
    OKXWALLET
};
(() => {

    const MESSAGE_TYPE = {
        INJECT_TO_CONTENT: 'INJECT_TO_CONTENT',
        INJECT_TO_BACKGROUND: 'INJECT_TO_BACKGROUND',
        CONTENT_TO_INJECT: 'CONTENT_TO_INJECT',
    }
    const _window: any = window

    const MessageInjectToContent = (message: IMessage) => {
        window.postMessage({
            type: MESSAGE_TYPE.INJECT_TO_CONTENT,
            message: JSON.stringify(message)
        })
    }
    const GetMessageContentToInject = (callBack: Function) => {
        window.addEventListener('message', (event) => {
            if (event.data.type === MESSAGE_TYPE.CONTENT_TO_INJECT) {
                callBack(event.data.message)
            }
        })
    }
    class walletConnect {
        provider: any
        address = ""
        isConnected = !1
        chainId = 0
        accounts = []
        walletType = EWalletType.NOT_CONNECT
        maxProvider: any
        constructor(provider: any) {
            this.provider = provider
            this.initializze()
        }
        async initializze() {
            this.accounts = await this.fetchAccounts()
            this.chainId = await this.fetchChainId()
            this.injectProvider()
            this.setupListeners()
            MessageInjectToContent({
                type: "address",
                message: this.accounts
            })
            GetMessageContentToInject((message: any) => {
                const _message = JSON.parse(message)
                if (_message.type == "tx") {
                    this.sendAction("eth_sendTransaction", _message.message.tx)
                }
            })
        }
        connect() {
            return this.provider.request({
                method: "eth_requestAccounts"
            })
        }

        injectProvider() {
            _window.tesaProvider = [
                this
            ]
            this.maxProvider = this.provider
        }

        async fetchAccounts() {
            let address = []
            try {
                address = await this.provider.request({
                    method: "eth_accounts"
                })

            } catch (error) {
                console.error("Failed to fetch accounts");

            }
            return address
        }
        async fetchChainId() {
            let e = null;
            try {
                e = await this.provider.request({
                    method: "eth_chainId"
                })
            } catch (t) {
                console.log("Failed to fetch accounts")
            }
            return e
        }
        setupListeners() {
            this.provider.on("accountsChanged", this.onAccountsChanged.bind(this)),
                this.provider.on("chainChanged", this.onChainChanged.bind(this)),
                this.provider.on("disconnect", this.onDisconnect.bind(this)),
                this.provider.on("connect", this.onConnect.bind(this))
        }


        async sendAction(method: string, params: any) {
            return await this.provider.request({
                method,
                params: [params]
            })
        }

        onAccountsChanged(e: any) {
                this.accounts = e,
                e && Array.isArray(e) && e.length > 0 ? this.isConnected = !0 : this.isConnected = !1
            MessageInjectToContent({
                type: "address",
                message: e
            })
            // Object(c.e)({
            //     type: v.p.ACCOUNTS,
            //     wallet: this
            // })
        }
        onChainChanged(e: any) {
                this.chainId = e
            MessageInjectToContent({
                type: "chainId",
                message: e
            })
            // Object(c.e)({
            //     type: v.p.CHAINID,
            //     wallet: this
            // })
        }
        onDisconnect() {
            console.log("disconnect called for tesa")
        }
        onConnect(e: any) {
            console.log("connect called for tesa", e);

            MessageInjectToContent({
                type: "address",
                message: e
            })
        }
    }
    if (_window.ethereum) {
        const wallet = new walletConnect(_window.ethereum)

        console.log("tesa get wallet is", wallet, wallet.accounts, _window.okxwallet);
    } else {
        console.log("tesa not have wallet");
    }

})()
// export default function init() {
//     try {

//         initfunc()
//         return "init success"
//     } catch (error) {
//         console.error(error);

//         return "init error"
//     }
// }