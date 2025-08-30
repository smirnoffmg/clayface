import { ChatAnthropic } from "@langchain/anthropic"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { PromptTemplate } from "@langchain/core/prompts"

export class ClaudeAPI {
    private model: ChatAnthropic | null = null

    initialize(apiKey: string): void {
        try {
            this.model = new ChatAnthropic({
                apiKey,
                model: "claude-sonnet-4-20250514",
                temperature: 0.7,
            })
            console.log("Claude API initialized successfully")
        } catch (error) {
            console.error("Failed to initialize Claude API:", error)
            throw new Error("Failed to initialize Claude API")
        }
    }

    private getModel(): ChatAnthropic {
        if (!this.model) {
            throw new Error("Claude API not initialized. Please provide API key first.")
        }
        return this.model
    }

    async adaptCV(pageHtml: string, cvContent?: string): Promise<string> {
        try {
            console.log("Starting CV adaptation...")

            if (!pageHtml || pageHtml.length === 0) {
                throw new Error("No page HTML content provided")
            }

            const model = this.getModel()
            console.log("Model retrieved, creating prompt...")

            const prompt = PromptTemplate.fromTemplate(
                cvContent
                    ? `You are an expert CV/resume writer. I will provide you with the HTML content of a job posting page and an existing CV. Please adapt the CV to better match the job requirements found in the page content.

Page HTML Content:
{pageHtml}

Current CV:
{cvContent}

Please analyze the job posting from the HTML content and adapt the CV to:
1. Highlight relevant skills and experience that match the job requirements
2. Use keywords and terminology from the job posting
3. Emphasize achievements and experience that align with the role
4. Maintain a professional tone and structure
5. Focus on the most relevant aspects for this specific position

Provide the adapted CV in a clear, well-formatted structure.`
                    : `You are an expert CV/resume writer. I will provide you with the HTML content of a job posting page. Please create a CV template that would be well-suited for this job.

Page HTML Content:
{pageHtml}

Please analyze the job posting from the HTML content and create a CV template that:
1. Highlights the key skills and experience mentioned in the job posting
2. Uses appropriate keywords and terminology from the job description
3. Includes relevant sections (Summary, Experience, Skills, Education, etc.)
4. Focuses on the most important requirements for this role
5. Maintains a professional structure and format

Provide a comprehensive CV template that would be ideal for this position.`
            )

            console.log("Creating chain...")
            const chain = prompt.pipe(model).pipe(new StringOutputParser())

            console.log("Invoking chain with page HTML length:", pageHtml.length)
            const result = await chain.invoke({
                pageHtml: pageHtml.substring(0, 50000), // Limit to 50KB to avoid token limits
                cvContent: cvContent || ""
            })

            console.log("CV adaptation completed successfully")
            return result
        } catch (error) {
            console.error("Error in adaptCV:", error)
            if (error.message?.includes("API key")) {
                throw new Error("Invalid API key. Please check your Claude API key.")
            } else if (error.message?.includes("rate limit")) {
                throw new Error("Rate limit exceeded. Please try again later.")
            } else if (error.message?.includes("token")) {
                throw new Error("Content too long. Please try with a shorter page.")
            } else if (error.message?.includes("404") || error.message?.includes("not_found")) {
                throw new Error("Model not found. Please check your API access.")
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

            const model = this.getModel()
            console.log("Model retrieved for cover letter...")

            const prompt = PromptTemplate.fromTemplate(
                `You are an expert cover letter writer. I will provide you with the HTML content of a job posting page. Please write a concise, professional cover letter for this position.

Page HTML Content:
{pageHtml}

Please write a cover letter that:
1. Is 150-200 words maximum
2. Uses simple, clear language
3. Shows enthusiasm for the specific role
4. Mentions 1-2 relevant skills or experiences
5. Has basic formatting only (paragraphs, no fancy styling)
6. Is professional but not overly formal
7. Focuses on why you're interested in this specific position

Write a brief, compelling cover letter that gets straight to the point.`
            )

            console.log("Creating cover letter chain...")
            const chain = prompt.pipe(model).pipe(new StringOutputParser())

            console.log("Invoking cover letter chain with page HTML length:", pageHtml.length)
            const result = await chain.invoke({
                pageHtml: pageHtml.substring(0, 50000) // Limit to 50KB to avoid token limits
            })

            console.log("Cover letter generation completed successfully")
            return result
        } catch (error) {
            console.error("Error in generateCoverLetter:", error)
            if (error.message?.includes("API key")) {
                throw new Error("Invalid API key. Please check your Claude API key.")
            } else if (error.message?.includes("rate limit")) {
                throw new Error("Rate limit exceeded. Please try again later.")
            } else if (error.message?.includes("token")) {
                throw new Error("Content too long. Please try with a shorter page.")
            } else if (error.message?.includes("404") || error.message?.includes("not_found")) {
                throw new Error("Model not found. Please check your API access.")
            } else {
                throw new Error(`Failed to generate cover letter: ${error.message}`)
            }
        }
    }

    isInitialized(): boolean {
        return this.model !== null
    }

    clear(): void {
        this.model = null
    }
}

// Create a singleton instance
let claudeAPI: ClaudeAPI | null = null

export const getClaudeAPI = (): ClaudeAPI | null => {
    return claudeAPI
}

export const initializeClaudeAPI = (apiKey: string): void => {
    claudeAPI = new ClaudeAPI()
    claudeAPI.initialize(apiKey)
}

export const clearClaudeAPI = (): void => {
    if (claudeAPI) {
        claudeAPI.clear()
    }
    claudeAPI = null
}
