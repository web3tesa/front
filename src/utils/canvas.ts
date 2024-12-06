import MxBgImg from "../sidepanel/assets/mx/mx_bg.png"
import MxWinImg from "../sidepanel/assets/mx/mx_win.png"
import MxLoseImg from "../sidepanel/assets/mx/mx_lose.png"
import MxTimeImg from "../sidepanel/assets/mx/time.png"

import ImgWin1 from "../sidepanel/assets/mx/win_1.png"
import ImgWin2 from "../sidepanel/assets/mx/win_2.png"
import ImgWin3 from "../sidepanel/assets/mx/win_3.png"
import ImgWin4 from "../sidepanel/assets/mx/win_4.png"
import ImgWin5 from "../sidepanel/assets/mx/win_5.png"

import ImgLose1 from "../sidepanel/assets/mx/lose_1.png"
import ImgLose2 from "../sidepanel/assets/mx/lose_2.png"
import ImgLose3 from "../sidepanel/assets/mx/lose_3.png"
import ImgLose4 from "../sidepanel/assets/mx/lose_4.png"
import ImgLose5 from "../sidepanel/assets/mx/lose_5.png"
import { formatToTwoDecimals } from "."

interface IDrawSellCanvasProps {
    tokenPair: string
    persent: number
    holdTime: number
    canvas?: HTMLCanvasElement
    isCopy?: boolean
    isDownload?: boolean
}
export const drawSellCanvas = ({
    tokenPair,
    persent,
    holdTime,
    canvas = document.createElement('canvas'),
    isCopy = false,
    isDownload = true
}: IDrawSellCanvasProps) => {
    let image = ''
    const SCALE_SIZE = 1

    const canvasWidth = 908 * SCALE_SIZE,
        canvasHeight = 664 * SCALE_SIZE,
        canvasBgSrc = MxBgImg

    const statusImageWidth = 368 * SCALE_SIZE,
        statusImageHeight = 368 * SCALE_SIZE,
        statusLeft = 40 * SCALE_SIZE,
        statusTop = 258 * SCALE_SIZE,
        statusWinSrc = MxWinImg,
        statusLoseSrc = MxLoseImg

    const pairTextColor = "#000000",
        pairTop = 62 * SCALE_SIZE,
        pairRight = 62 * SCALE_SIZE,
        pairTextSize = 48 * SCALE_SIZE

    const winTextColor = "#1DCE00",
        loseTextColor = "#FF3D3D",
        persentTextTop = 120 * SCALE_SIZE,
        persentTextSize = 84 * SCALE_SIZE

    const holdTimeTextColor = "#8C8C8C",
        holdTimeTextTop = 240 * SCALE_SIZE,
        holdTimeIconTop = 248 * SCALE_SIZE,
        holdTimeIconRight = 264 * SCALE_SIZE,
        holdTimeIconWidht = 20 * SCALE_SIZE,
        holdTimeIconHeight = 20 * SCALE_SIZE,
        holdTimeIconSrc = MxTimeImg,
        holdTimeTextSize = 24 * SCALE_SIZE


    canvas.width = canvasWidth
    canvas.height = canvasHeight
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = "right"
    return new Promise((bgResolve, bgReject) => {
        const bgImage = new Image()
        bgImage.crossOrigin = "anonymous"
        bgImage.src = canvasBgSrc
        bgImage.width = canvasWidth
        bgImage.height = canvasHeight
        bgImage.onload = () => {
            ctx.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight)
            bgResolve(
                new Promise((statusSolve, statusReject) => {
                    const statusImg = new Image()
                    statusImg.crossOrigin = "anonymous"
                    if (persent > 0 && persent <= 0.2) {
                        statusImg.src = ImgWin1
                    } else if (persent > 0.2 && persent <= 0.5) {
                        statusImg.src = ImgWin2
                    } else if (persent > 0.5 && persent <= 1) {
                        statusImg.src = ImgWin3
                    } else if (persent > 1 && persent <= 2) {
                        statusImg.src = ImgWin4
                    } else if (persent > 2) {
                        statusImg.src = ImgWin5
                    } else if (persent < 0 && persent >= -0.2) {
                        statusImg.src = ImgLose1
                    } else if (persent < -0.2 && persent >= -0.4) {
                        statusImg.src = ImgLose2
                    } else if (persent < -0.4 && persent >= -0.6) {
                        statusImg.src = ImgLose3
                    } else if (persent < -0.6 && persent >= -0.8) {
                        statusImg.src = ImgLose4
                    } else if (persent < -0.8) {
                        statusImg.src = ImgLose5
                    }

                    statusImg.width = statusImageWidth
                    statusImg.height = statusImageHeight
                    statusImg.onload = () => {
                        ctx.drawImage(statusImg, statusLeft, statusTop, statusImageWidth, statusImageHeight)

                        // draw tokenPair test
                        ctx.fillStyle = pairTextColor
                        ctx.font = `bold ${pairTextSize}px Inter`
                        ctx.fillText(tokenPair, canvasWidth - pairRight, pairTop + pairTextSize)

                        // draw persent text
                        ctx.fillStyle = persent > 0 ? winTextColor : loseTextColor
                        ctx.font = `bold ${persentTextSize}px Inter`
                        ctx.fillText(`${formatToTwoDecimals(persent * 100)}%`, canvasWidth - pairRight, persentTextTop + persentTextSize)

                        // draw holdTime text
                        ctx.fillStyle = holdTimeTextColor
                        ctx.font = `bold ${holdTimeTextSize}px Inter`
                        ctx.fillText(`${TimeToDayTime(holdTime)}`, canvasWidth - pairRight, holdTimeTextTop + holdTimeTextSize)

                        // draw holdTime icon
                        const holdTimeIconImg = new Image()
                        holdTimeIconImg.crossOrigin = "anonymous"
                        holdTimeIconImg.src = holdTimeIconSrc
                        holdTimeIconImg.width = holdTimeIconWidht
                        holdTimeIconImg.height = holdTimeIconHeight
                        statusSolve(
                            new Promise((holdTimeSolve, holdTimeReject) => {
                                holdTimeIconImg.onload = () => {
                                    ctx.drawImage(holdTimeIconImg, canvasWidth - holdTimeIconRight, holdTimeIconTop, holdTimeIconWidht, holdTimeIconHeight)
                                    const tempCanvas = document.createElement('canvas');
                                    const tempCtx = tempCanvas.getContext('2d') as CanvasRenderingContext2D;

                                    // set the size of the temp canvas
                                    tempCanvas.width = 454;
                                    tempCanvas.height = 322;
                                    tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, tempCanvas.width, tempCanvas.height);
                                    if (isCopy) {
                                        tempCanvas.toBlob(function (blob) {
                                            const item = new ClipboardItem({ 'image/png': blob as Blob });
                                            navigator.clipboard.write([item]).then(function () {
                                                console.log('Canvas copied to clipboard.');
                                            }).catch(function (error) {
                                                console.error('Error copying canvas to clipboard: ', error);
                                            });
                                        }, 'image/png');
                                    } else if (isDownload && !isCopy) {

                                        // download the canvas as an image

                                        const a = document.createElement('a')
                                        document.getElementsByTagName('body')
                                        document.body.appendChild(a)
                                        a.download = `user_${persent > 0 ? "win" : "lose"}.png`
                                        a.href = tempCanvas?.toDataURL('image/png')
                                        a.click()
                                    }
                                    holdTimeSolve(canvas)
                                }
                                holdTimeIconImg.onerror = (e) => {
                                    console.error("load holdTimeIcon img got error", e);

                                    holdTimeReject(e)
                                }
                            })
                        )
                    }
                    statusImg.onerror = (e) => {
                        console.error("load status img got error", e);

                        statusReject(e)
                    }
                })
            )
        }
        bgImage.onerror = (e) => {
            console.error("load bgimg got error", e);

            bgReject(e)
        }
    })
}

//  convert time to day time
export const TimeToDayTime = (time: number): string => {
    const day = Math.floor(time / 86400)
    const hour = Math.floor((time % 86400) / 3600)
    const minute = Math.floor((time % 3600) / 60)
    const second = Math.floor(time % 60)
    return `${day}D ${hour}H ${minute}M ${second}S`
}