import fs from 'fs'
import path from 'path'

// legal/ 폴더의 마크다운을 읽어 아주 단순한 HTML 로 바꾼다.
// 문서를 코드에 복붙하지 않고 파일 하나만 고치면 페이지가 따라 바뀌게 하려는 것.
export function readLegal(name) {
  const file = path.join(process.cwd(), 'legal', `${name}.md`)
  try {
    return fs.readFileSync(file, 'utf8')
  } catch {
    return null
  }
}

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const inline = (s) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[\[(.+?)\]\]/g, '<mark class="blank">[$1]</mark>')
    .replace(/\[(.+?)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

export function mdToHtml(md) {
  const out = []
  const lines = md.split('\n')
  let i = 0
  let inList = false

  const closeList = () => { if (inList) { out.push('</ul>'); inList = false } }

  while (i < lines.length) {
    const line = lines[i]

    // 표
    if (line.startsWith('|') && lines[i + 1]?.match(/^\|[\s:|-]+\|$/)) {
      closeList()
      const head = line.split('|').slice(1, -1).map((c) => c.trim())
      i += 2
      const rows = []
      while (i < lines.length && lines[i].startsWith('|')) {
        rows.push(lines[i].split('|').slice(1, -1).map((c) => c.trim()))
        i++
      }
      out.push('<div class="table-wrap"><table><thead><tr>')
      head.forEach((h) => out.push(`<th>${inline(h)}</th>`))
      out.push('</tr></thead><tbody>')
      rows.forEach((r) => {
        out.push('<tr>')
        r.forEach((c) => out.push(`<td>${inline(c.replace(/<br>/g, ' '))}</td>`))
        out.push('</tr>')
      })
      out.push('</tbody></table></div>')
      continue
    }

    if (line.startsWith('### ')) { closeList(); out.push(`<h3>${inline(line.slice(4))}</h3>`) }
    else if (line.startsWith('## ')) { closeList(); out.push(`<h2>${inline(line.slice(3))}</h2>`) }
    else if (line.startsWith('# ')) { closeList(); out.push(`<h1>${inline(line.slice(2))}</h1>`) }
    else if (line.startsWith('> ')) { closeList(); out.push(`<blockquote>${inline(line.slice(2))}</blockquote>`) }
    else if (line.startsWith('---')) { closeList(); out.push('<hr />') }
    else if (line.match(/^[-*] /)) {
      if (!inList) { out.push('<ul>'); inList = true }
      out.push(`<li>${inline(line.slice(2))}</li>`)
    }
    else if (line.match(/^\d+\. /)) {
      if (!inList) { out.push('<ul>'); inList = true }
      out.push(`<li>${inline(line.replace(/^\d+\.\s/, ''))}</li>`)
    }
    else if (line.trim() === '') { closeList() }
    else { closeList(); out.push(`<p>${inline(line)}</p>`) }

    i++
  }
  closeList()
  return out.join('\n')
}
