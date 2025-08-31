export class ClaudeAPISimple {
    private apiKey: string | null = null

    initialize(apiKey: string): void {
        this.apiKey = apiKey
        console.log("Claude API initialized successfully")
    }

    private getApiKey(): string {
        if (!this.apiKey) {
            throw new Error("Claude API not initialized. Please provide API key first.")
        }
        return this.apiKey
    }

    async adaptCV(pageHtml: string, cvContent?: string): Promise<string> {
        try {
            console.log("Starting CV adaptation...")

            if (!pageHtml || pageHtml.length === 0) {
                throw new Error("No page HTML content provided")
            }

            const apiKey = this.getApiKey()
            const prompt = cvContent
                ? `You are an expert CV/resume writer. I will provide you with the HTML content of a job posting page and an existing CV. Please adapt the CV to better match the job requirements found in the page content.

Page HTML Content:
${pageHtml.substring(0, 50000)}

Current CV:
${cvContent}

Please analyze the job posting from the HTML content and adapt the CV to:
1. Highlight relevant skills and experience that match the job requirements
2. Use keywords and terminology from the job posting
3. Emphasize achievements and experience that align with the role
4. Maintain a professional tone and structure
5. Focus on the most relevant aspects for this specific position

Provide the adapted CV in a clear, well-formatted structure.`
                : `You are an expert CV/resume writer. I will provide you with the HTML content of a job posting page. Please create a CV template that would be well-suited for this job.

Page HTML Content:
${pageHtml.substring(0, 50000)}

Please analyze the job posting from the HTML content and create a CV template that:
1. Highlights the key skills and experience mentioned in the job posting
2. Uses appropriate keywords and terminology from the job description
3. Includes relevant sections (Summary, Experience, Skills, Education, etc.)
4. Focuses on the most important requirements for this role
5. Maintains a professional structure and format

Provide a comprehensive CV template that would be ideal for this position.`

            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01"
                },
                body: JSON.stringify({
                    model: "claude-3-5-sonnet-20241022",
                    max_tokens: 4000,
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                })
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`API request failed: ${response.status} ${errorText}`)
            }

            const data = await response.json()
            console.log("CV adaptation completed successfully")
            return data.content[0].text
        } catch (error) {
            console.error("Error in adaptCV:", error)
            if (error.message?.includes("API key")) {
                throw new Error("Invalid API key. Please check your Claude API key.")
            } else if (error.message?.includes("rate limit")) {
                throw new Error("Rate limit exceeded. Please try again later.")
            } else if (error.message?.includes("token")) {
                throw new Error("Content too long. Please try with a shorter page.")
            } else {
                throw new Error(`Failed to adapt CV: ${error.message}`)
            }
        }
    }

    async generateCoverLetter(pageHtml: string): Promise<string> {
        try {
            console.log("Starting cover letter generation...")

            if (!pageHtml || pageHtml.length === 0) {
                throw new Error("No page HTML content provided")
            }

            const apiKey = this.getApiKey()
            const prompt = `You are an expert cover letter writer. I will provide you with the HTML content of a job posting page. Please write a concise, professional cover letter for this position.

Page HTML Content:
${pageHtml.substring(0, 50000)}

Please write a cover letter that:
1. Is 150-200 words maximum
2. Uses simple, clear language
3. Shows enthusiasm for the specific role
4. Mentions 1-2 relevant skills or experiences
5. Has basic formatting only (paragraphs, no fancy styling)
6. Is professional but not overly formal
7. Focuses on why you're interested in this specific position

Write a brief, compelling cover letter that gets straight to the point.`

            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01"
                },
                body: JSON.stringify({
                    model: "claude-3-5-sonnet-20241022",
                    max_tokens: 1000,
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                })
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`API request failed: ${response.status} ${errorText}`)
            }

            const data = await response.json()
            console.log("Cover letter generation completed successfully")
            return data.content[0].text
        } catch (error) {
            console.error("Error in generateCoverLetter:", error)
            if (error.message?.includes("API key")) {
                throw new Error("Invalid API key. Please check your Claude API key.")
            } else if (error.message?.includes("rate limit")) {
                throw new Error("Rate limit exceeded. Please try again later.")
            } else if (error.message?.includes("token")) {
                throw new Error("Content too long. Please try with a shorter page.")
            } else {
                throw new Error(`Failed to generate cover letter: ${error.message}`)
            }
        }
    }

    isInitialized(): boolean {
        return this.apiKey !== null
    }

    clear(): void {
        this.apiKey = null
    }
}

// Create a singleton instance
let claudeAPISimple: ClaudeAPISimple | null = null

export const getClaudeAPISimple = (): ClaudeAPISimple | null => {
    return claudeAPISimple
}

export const initializeClaudeAPISimple = (apiKey: string): void => {
    claudeAPISimple = new ClaudeAPISimple()
    claudeAPISimple.initialize(apiKey)
}

export const clearClaudeAPISimple = (): void => {
    if (claudeAPISimple) {
        claudeAPISimple.clear()
    }
    claudeAPISimple = null
}
