import fs from 'fs';
import iconv from 'iconv-lite';
import { ChatGPTAPI } from 'chatgpt';

const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY!,
  debug: false
})

function readGb2312File(filePath: string) {
  const content = fs.readFileSync(filePath); // 读取文件内容

  return iconv.decode(content, 'gb2312').toString(); // 将内容从 GB2312 转换为 UTF-8
  // const newFilename = 'utf8.txt'; // 新的 UTF-8 编码的文件名
  // fs.writeFileSync(newFilename, utf8Content); 
}

// 将文本分段
function splitText(text: string, chunkSize: number) {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

// 翻译一段文本
async function translateChunk(chunk) {
  // return '\n<!--\n' + chunk + '--!>\n';

  const prompt = `将以下文本翻译成白话文：\n${chunk}\n---\n`;
  const res = await api.sendMessage(prompt);
  console.log(res.text);
  return res.text;
}

// 翻译整本书
async function translateBook(bookPath: string) {
  const book = readGb2312File(bookPath); // 读取整本书
  const paragraphs = book.split('\n').filter(p => p.length > 0); // 将书中的段落提取出来

  const promises: Promise<any>[] = [];
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const chunks = splitText(paragraph, 1900); // 每个 chunk 不超过 1900 个字符
    const chunkPromises:Promise<any>[] = [];
    for (let j = 0; j < chunks.length; j++) {
      const chunk = chunks[j];
      chunkPromises.push(translateChunk(chunk));
    }
    promises.push(...chunkPromises);
  }

  const translatedTexts = await Promise.all(promises);
  fs.writeFileSync('trans_' + bookPath, translatedTexts.join('\n'));
  // console.log(translatedBook);
}

translateBook('book.txt'); // 替换成你要翻译的古籍文件路径

// (async function () {
//   console.log(await translateChunk('弃为儿时，屹如巨人之志。其游戏，好种树麻、菽，麻、菽美。及为成人，遂好耕农，相地之宜，宜穀者稼穑焉，民皆法则之。'));
// })();

