const openai = require('openai');
const fs = require('fs');

// 设置 OpenAI API 密钥
const OPENAI_API_KEY = 'your-openai-api-key';
openai.api_key = OPENAI_API_KEY;

// 将文本分段
function splitText(text, chunkSize) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

// 翻译一段文本
async function translateChunk(chunk) {
  const model = 'text-davinci-003';
  const prompt = `翻译以下文本到英语：\n${chunk}\n---\n`;
  const completions = await openai.complete({
    engine: model,
    prompt: prompt,
    max_tokens: 2048,
    n: 1,
    stop: ['---'], // 结束标记，用于分割多个结果
  });
  const { choices } = completions.data;
  const translation = choices[0].text.trim();
  return translation;
}

// 翻译整本书
async function translateBook(bookPath) {
  const book = fs.readFileSync(bookPath, 'utf8'); // 读取整本书
  const paragraphs = book.split('\n').filter(p => p.length > 0); // 将书中的段落提取出来

  let translatedBook = '';
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const chunks = splitText(paragraph, 1900); // 每个 chunk 不超过 1900 个字符
    let translatedParagraph = '';
    for (let j = 0; j < chunks.length; j++) {
      const chunk = chunks[j];
      const translation = await translateChunk(chunk);
      translatedParagraph += translation;
    }
    translatedBook += `${translatedParagraph}\n`;    
  }

  console.log(translatedBook);
}

translateBook('book.txt'); // 替换成你要翻译的古籍文件路径

