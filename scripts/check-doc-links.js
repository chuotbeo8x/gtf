#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const repoRoot = process.cwd()
const docsDir = path.join(repoRoot, 'docs')

const markdownFiles = fs.readdirSync(docsDir)
  .filter(file => file.endsWith('.md'))
  .map(file => path.join(docsDir, file))

const markdownLinkRegexp = /\[[^\]]+\]\(([^)]+)\)/g
const brokenLinks = []

function isExternalLink (link) {
  return /^(https?:|mailto:|#)/.test(link)
}

function normalizeLinkPath (sourceFile, linkTarget) {
  const cleanTarget = linkTarget.split('#')[0].split('?')[0]
  return path.resolve(path.dirname(sourceFile), cleanTarget)
}

markdownFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8')
  const links = [...content.matchAll(markdownLinkRegexp)].map(match => match[1])

  links.forEach(link => {
    if (isExternalLink(link)) return

    const resolvedPath = normalizeLinkPath(filePath, link)

    if (!fs.existsSync(resolvedPath)) {
      brokenLinks.push({
        file: path.relative(repoRoot, filePath),
        link
      })
    }
  })
})

if (brokenLinks.length) {
  console.error('Found broken local markdown links:')
  brokenLinks.forEach(item => {
    console.error(`- ${item.file} -> ${item.link}`)
  })
  process.exit(1)
}

console.log(`OK: checked ${markdownFiles.length} docs markdown files, no broken local links.`)
