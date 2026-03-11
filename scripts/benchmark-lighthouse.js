#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const baseUrl = process.env.BENCHMARK_BASE_URL || 'http://localhost:2368'
const urls = [
  `${baseUrl}/`,
  `${baseUrl}/p1-sample-post/`
]

const outputDir = path.join(process.cwd(), 'tmp', 'lighthouse')
fs.mkdirSync(outputDir, { recursive: true })

const flags = [
  '--quiet',
  '--chrome-flags="--headless=new --no-sandbox"',
  '--only-categories=performance,accessibility,best-practices,seo',
  '--output=json',
  `--output-path=${path.join(outputDir, 'report')}`
]

console.log('Running Lighthouse benchmark...')
console.log(`Base URL: ${baseUrl}`)
console.log(`Output dir: ${outputDir}`)

urls.forEach((url, index) => {
  const out = path.join(outputDir, `report-${index + 1}.json`)
  const cmd = `npx --yes lighthouse "${url}" ${flags.join(' ')} --output-path="${out}"`

  try {
    execSync(cmd, { stdio: 'inherit' })
  } catch (error) {
    console.error(`Lighthouse failed for ${url}`)
    console.error('Tip: start Ghost locally or set BENCHMARK_BASE_URL to a reachable environment.')
    process.exit(1)
  }
})

console.log('Lighthouse benchmark completed successfully.')
