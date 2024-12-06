export const getDomWithXPath = <T extends Node>(xpath: string): T => {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)?.singleNodeValue as T;
}