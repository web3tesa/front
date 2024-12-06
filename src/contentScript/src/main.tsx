import React from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import App from './App'
import config from '../../constant/config'


const body = document.querySelector('body')

const app = document.createElement('div')

const DOM_ID = config.APP_DOM_ID
app.id = DOM_ID

// Make sure the element that you want to mount the app to has loaded. You can
// also use `append` or insert the app using another method:
// https://developer.mozilla.org/en-US/docs/Web/API/Element#methods
//
// Also control when the content script is injected from the manifest.json:
// https://developer.chrome.com/docs/extensions/mv3/content_scripts/#run_time
if (body) {
  body.prepend(app)
}

const container = document.getElementById(DOM_ID)
const root = createRoot(container!)


root.render(<App />)
