import { useEffect, useState } from "react"
import { getClaudeAPI, initializeClaudeAPI } from "./claude-api"

interface PageInfo {
  title: string
  url: string
  isJobSite: boolean
  jobDescription: string
}

interface AdaptationResult {
  adaptedCV: string
  coverLetter: string
}

function IndexPopup() {
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adapting, setAdapting] = useState(false)
  const [result, setResult] = useState<AdaptationResult | null>(null)
  const [apiKey, setApiKey] = useState("")
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const [apiKeySet, setApiKeySet] = useState(false)
  const [cvContent, setCvContent] = useState("")
  const [cvFileName, setCvFileName] = useState("")
  const [showCvInput, setShowCvInput] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Load API key from storage on component mount
  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const result = await chrome.storage.local.get(["claudeApiKey"])
        if (result.claudeApiKey) {
          console.log("Found saved API key")
          setApiKey(result.claudeApiKey)
          // Try to initialize with saved key
          try {
            initializeClaudeAPI(result.claudeApiKey)
            setApiKeySet(true)
            console.log("API initialized with saved key")
          } catch (err) {
            console.error("Failed to initialize with saved key:", err)
            // Clear invalid key
            await chrome.storage.local.remove(["claudeApiKey"])
            setApiKey("")
            setApiKeySet(false)
          }
        }
      } catch (err) {
        console.error("Failed to load API key from storage:", err)
      }
    }

    loadApiKey()
  }, [])

  useEffect(() => {
    const getCurrentTabInfo = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

        if (!tab.id) {
          setError("Could not get current tab")
          setLoading(false)
          return
        }

        console.log("Getting page info from tab:", tab.id)

        // Try to get page info from content script
        try {
          const response = await chrome.tabs.sendMessage(tab.id, { action: "getPageInfo" })
          console.log("Received page info:", response)
          setPageInfo(response)
        } catch (err) {
          console.error("Content script error:", err)
          // Content script not available, create basic info
          setPageInfo({
            title: tab.title || "Unknown",
            url: tab.url || "",
            isJobSite: false,
            jobDescription: ""
          })
        }

        setLoading(false)
      } catch (err) {
        console.error("Tab query error:", err)
        setError("Failed to get tab information")
        setLoading(false)
      }
    }

    getCurrentTabInfo()
  }, [])

  const handleSetApiKey = async () => {
    if (!apiKey.trim()) {
      setError("Please enter your Claude API key")
      return
    }

    try {
      console.log("Setting API key...")
      initializeClaudeAPI(apiKey.trim())

      // Save to Chrome storage
      await chrome.storage.local.set({ claudeApiKey: apiKey.trim() })

      setApiKeySet(true)
      setShowApiKeyInput(false)
      setError(null)
      console.log("API key set and saved successfully")
    } catch (err) {
      console.error("Failed to set API key:", err)
      setError(err.message || "Failed to initialize API")
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'text/plain',
      'text/markdown',
      'application/markdown'
    ]

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF, TXT, or Markdown file")
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("File size must be less than 5MB")
      return
    }

    setUploading(true)
    setError(null)

    try {
      let textContent = ""

      if (file.type === 'application/pdf') {
        // For PDF files, convert to text
        const arrayBuffer = await file.arrayBuffer()
        const pdfjsLib = await import('pdfjs-dist')

        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
        const pdf = await loadingTask.promise

        // Extract text from all pages
        const textParts = []
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ')
          textParts.push(pageText)
        }

        textContent = textParts.join('\n\n')
      } else {
        // For text and markdown files
        textContent = await file.text()
      }

      setCvContent(textContent)
      setCvFileName(file.name)
      setShowCvInput(false)
      console.log("CV file uploaded successfully:", file.name)
    } catch (err) {
      console.error("Error reading file:", err)
      setError("Failed to read file. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleAdaptCV = async () => {
    console.log("Adapt CV button clicked")
    console.log("Page info:", pageInfo)
    console.log("API key set:", apiKeySet)

    if (!pageInfo?.jobDescription) {
      setError("No page content available to analyze")
      return
    }

    if (!apiKeySet) {
      console.log("API key not set, showing input")
      setShowApiKeyInput(true)
      return
    }

    setAdapting(true)
    setError(null)
    setResult(null)

    try {
      console.log("Starting CV adaptation process...")
      const claudeAPI = getClaudeAPI()
      if (!claudeAPI) {
        setError("API not initialized")
        return
      }

      console.log("Page content length:", pageInfo.jobDescription.length)
      console.log("CV content provided:", cvContent ? "Yes" : "No")

      // Get both CV adaptation and cover letter
      const [adaptedCV, coverLetter] = await Promise.all([
        claudeAPI.adaptCV(pageInfo.jobDescription, cvContent),
        claudeAPI.generateCoverLetter(pageInfo.jobDescription)
      ])

      console.log("Both operations completed successfully")
      setResult({
        adaptedCV,
        coverLetter
      })
    } catch (err) {
      console.error("Error in handleAdaptCV:", err)
      setError(err.message || "Failed to adapt CV")
    } finally {
      setAdapting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 16, width: 300 }}>
        <div>Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: 16, width: 300 }}>
        <div style={{ color: "red", marginBottom: "12px" }}>Error: {error}</div>
        <button
          onClick={() => setError(null)}
          style={{
            background: "#666",
            color: "white",
            border: "none",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: 16, width: 300 }}>
      <h2 style={{ margin: "0 0 16px 0", fontSize: "18px" }}>
        Clayface
      </h2>

      {showApiKeyInput && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "14px", marginBottom: "8px" }}>
            <strong>Enter your Claude API Key:</strong>
          </div>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-api03-..."
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              marginBottom: "8px"
            }}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleSetApiKey}
              style={{
                background: "#1976d2",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                flex: 1
              }}
            >
              Set API Key
            </button>
            <button
              onClick={() => {
                setShowApiKeyInput(false)
                setApiKey("")
              }}
              style={{
                background: "#666",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {pageInfo?.isJobSite ? (
        <div>
          <div style={{
            background: "#e8f5e8",
            padding: "8px 12px",
            borderRadius: "4px",
            marginBottom: "12px",
            border: "1px solid #4caf50"
          }}>
            ✅ Page content captured ({Math.round(pageInfo.jobDescription.length / 1024)}KB)
          </div>

          <div style={{ fontSize: "14px", marginBottom: "12px" }}>
            <strong>Page:</strong> {pageInfo.title}
          </div>

          {!apiKeySet && !showApiKeyInput && (
            <div style={{ marginBottom: "12px" }}>
              <div style={{
                background: "#fff3cd",
                padding: "8px 12px",
                borderRadius: "4px",
                marginBottom: "8px",
                border: "1px solid #ffc107"
              }}>
                ⚠️ Claude API key required
              </div>
              <button
                onClick={() => setShowApiKeyInput(true)}
                style={{
                  background: "#1976d2",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  width: "100%"
                }}
              >
                Set API Key
              </button>
            </div>
          )}

          {apiKeySet && !showApiKeyInput && (
            <div style={{ marginBottom: "12px" }}>
              <div style={{
                background: "#e8f5e8",
                padding: "8px 12px",
                borderRadius: "4px",
                marginBottom: "8px",
                border: "1px solid #4caf50"
              }}>
                ✅ API Key Saved
              </div>
              <button
                onClick={async () => {
                  await chrome.storage.local.remove(["claudeApiKey"])
                  setApiKey("")
                  setApiKeySet(false)
                }}
                style={{
                  background: "#f44336",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Clear API Key
              </button>
            </div>
          )}

          {showCvInput && (
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", marginBottom: "8px" }}>
                <strong>Upload your CV:</strong>
              </div>
              <div style={{
                border: "2px dashed #ddd",
                borderRadius: "4px",
                padding: "20px",
                textAlign: "center",
                marginBottom: "8px",
                background: "#f9f9f9"
              }}>
                <input
                  type="file"
                  accept=".pdf,.txt,.md,.markdown"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  id="cv-file-input"
                  disabled={uploading}
                />
                <label
                  htmlFor="cv-file-input"
                  style={{
                    cursor: uploading ? "not-allowed" : "pointer",
                    color: uploading ? "#999" : "#1976d2",
                    fontSize: "14px"
                  }}
                >
                  {uploading ? "Uploading..." : "📁 Click to upload PDF, TXT, or MD file"}
                </label>
                <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
                  Max 5MB • PDF, TXT, MD files only
                </div>
              </div>
              <button
                onClick={() => setShowCvInput(false)}
                style={{
                  background: "#666",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  width: "100%"
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {!showCvInput && apiKeySet && (
            <div style={{ marginBottom: "12px" }}>
              <div style={{
                background: cvContent ? "#e8f5e8" : "#fff3cd",
                padding: "8px 12px",
                borderRadius: "4px",
                marginBottom: "8px",
                border: cvContent ? "1px solid #4caf50" : "1px solid #ffc107"
              }}>
                {cvContent ? `✅ CV Ready (${cvFileName})` : "📄 No CV uploaded"}
              </div>
              <button
                onClick={() => setShowCvInput(true)}
                style={{
                  background: cvContent ? "#4caf50" : "#1976d2",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                  marginRight: "8px"
                }}
              >
                {cvContent ? "Change CV" : "Upload CV"}
              </button>
              {cvContent && (
                <button
                  onClick={() => {
                    setCvContent("")
                    setCvFileName("")
                  }}
                  style={{
                    background: "#f44336",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  Remove CV
                </button>
              )}
            </div>
          )}

          {!result && apiKeySet && (
            <button
              style={{
                background: adapting ? "#ccc" : "#1976d2",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                cursor: adapting ? "not-allowed" : "pointer",
                width: "100%"
              }}
              onClick={handleAdaptCV}
              disabled={adapting}
            >
              {adapting ? "Adapting CV..." : cvContent ? "Adapt My CV to This Job" : "Generate CV Template"}
            </button>
          )}

          {result && (
            <div style={{ marginTop: "12px" }}>
              <div style={{
                background: "#e3f2fd",
                padding: "8px 12px",
                borderRadius: "4px",
                marginBottom: "12px",
                border: "1px solid #2196f3"
              }}>
                ✅ {cvContent ? "CV Adapted Successfully" : "CV Template Generated"}
              </div>

              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                  <strong>{cvContent ? "Adapted CV:" : "CV Template:"}</strong>
                </div>
                <div style={{
                  fontSize: "12px",
                  background: "#f5f5f5",
                  padding: "8px",
                  borderRadius: "4px",
                  maxHeight: "100px",
                  overflow: "auto",
                  border: "1px solid #ddd"
                }}>
                  {result.adaptedCV}
                </div>
              </div>

              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                  <strong>Cover Letter:</strong>
                </div>
                <div style={{
                  fontSize: "12px",
                  background: "#f5f5f5",
                  padding: "8px",
                  borderRadius: "4px",
                  maxHeight: "100px",
                  overflow: "auto",
                  border: "1px solid #ddd"
                }}>
                  {result.coverLetter}
                </div>
              </div>

              <button
                style={{
                  background: "#4caf50",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "8px"
                }}
                onClick={() => {
                  navigator.clipboard.writeText(result.adaptedCV)
                }}
              >
                Copy CV
              </button>

              <button
                style={{
                  background: "#2196f3",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "8px"
                }}
                onClick={() => {
                  const blob = new Blob([result.adaptedCV], { type: "text/markdown" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "adapted-cv.md"
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                }}
              >
                Download CV
              </button>

              <button
                style={{
                  background: "#ff9800",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "8px"
                }}
                onClick={() => {
                  navigator.clipboard.writeText(result.coverLetter)
                }}
              >
                Copy Cover Letter
              </button>

              <button
                style={{
                  background: "#9c27b0",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
                onClick={() => {
                  const blob = new Blob([result.coverLetter], { type: "text/plain" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = "cover-letter.txt"
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                }}
              >
                Download Cover Letter
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div style={{
            background: "#fff3cd",
            padding: "8px 12px",
            borderRadius: "4px",
            marginBottom: "12px",
            border: "1px solid #ffc107"
          }}>
            ⚠️ No page content available
          </div>
          <div style={{ fontSize: "14px", color: "#666" }}>
            Navigate to any page to capture its content for CV adaptation.
          </div>
        </div>
      )}
    </div>
  )
}

export default IndexPopup
