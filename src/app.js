import { Octokit } from "@octokit/core"
import express from "express"
import { Readable } from "node:stream"
import { getCopilotResponse, handleConversation } from "./modules/common.js"

const APP = express()
const PORT = Number(process.env.PORT || '3000')

APP.post("/", express.json(), async (req, res) => {
  const tokenForUser = req.get("X-GitHub-Token")
  const octokit = new Octokit({ auth: tokenForUser })
  const user = await octokit.request("GET /user")
  const messages = req.body.messages
  const conversation = handleConversation(user.data.login, messages)
  const copilotResponse = await getCopilotResponse(tokenForUser, conversation)
  Readable.from(copilotResponse.body).pipe(res)
})

APP.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})