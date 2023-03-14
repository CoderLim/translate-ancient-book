import dotenv from 'dotenv-safe'
import { oraPromise } from 'ora'

import { ChatGPTAPI } from 'chatgpt';

dotenv.config()

/**
 * Demo CLI for testing basic functionality.
 *
 * ```
 * // node v18
 * 
 * npx tsx demos/demo.ts
 * ```
 */
async function main() {
  const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_API_KEY,
    debug: false
  })

  const prompt =
    '介绍一下康德的主张'

  const res = await oraPromise(api.sendMessage(prompt), {
    text: prompt
  })
  console.log(res.text)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
