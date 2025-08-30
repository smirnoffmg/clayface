import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"] // Run on all pages
}

// Extract the entire HTML content of the page
const extractPageContent = (): string => {
  // Get the entire HTML content
  const htmlContent = document.documentElement.outerHTML

  console.log("Clayface: Extracted HTML content", { length: htmlContent.length })

  return htmlContent
}

// Get basic page information
const getPageInfo = () => {
  const title = document.title
  const url = window.location.href
  const pageContent = extractPageContent()

  const pageInfo = {
    title,
    url,
    isJobSite: true, // Always consider it a job site since we have content
    jobDescription: pageContent // Send the entire HTML content
  }

  console.log("Clayface: Page info", { title, url, contentLength: pageContent.length })
  return pageInfo
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Clayface: Message received", request)
  if (request.action === "getPageInfo") {
    const response = getPageInfo()
    console.log("Clayface: Sending response", { contentLength: response.jobDescription.length })
    sendResponse(response)
  }
})

// Notify that content script is loaded
console.log("Clayface content script loaded on:", window.location.href)
