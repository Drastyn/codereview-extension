const contextsLanguages = {
    "python": "If the files is Python code, use the information from https://peps.python.org/pep-0008/"
}

const setContextLanguage = (language) => {
    return contextsLanguages[language] || "No context available for this language"
}

const handleConversation = (userName, messages) => {
    const lastMessage = messages[messages.length - 1]
    if(lastMessage.copilot_references !== null) {
        const language = lastMessage.copilot_references[0].data.language
        const file = lastMessage.copilot_references[0].data.content
        const contextLanguage = setContextLanguage(language)
        messages.unshift({ role: "system", context: `${contextLanguage}` })
        messages.unshift({ role: "system", context: `If the user asking for code review, review this code:\n${file} and provide feedback` })
      }
    messages.unshift({ role: "system", context: "You are a helpful assistant for code review" })
    messages.unshift({ role: "system", content: `Start every response with the user's name, which is @${userName}` })
    return messages
}

const getCopilotResponse = (tokenForUser, messages) => {
    return fetch(
        "https://api.githubcopilot.com/chat/completions",
        {
            method: "POST",
            headers: {
                authorization: `Bearer ${tokenForUser}`,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                messages,
                stream: true,
            }),
        }
    )
}

export { getCopilotResponse, handleConversation }