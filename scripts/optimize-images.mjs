import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { join, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const assetDir = join(root, 'src', 'assets')
const reportPath = join(root, 'scripts', 'image-report.json')

// width: chiều ngang tối đa, quality: chất lượng WebP
const images = []

const targetArg = process.argv[2]
if (targetArg) {
  images.push({ file: targetArg, width: 1200, quality: 82 })
} else {
  try {
    const files = await readdir(assetDir)
    for (const file of files) {
      if (/\.(jpe?g|png)$/i.test(file)) {
        const stats = await stat(join(assetDir, file))
        if (stats.size > 300 * 1024) {
          images.push({ file, width: 1200, quality: 82 })
        }
      }
    }
  } catch {}
}

let existingReport = []
try {
  existingReport = JSON.parse(await readFile(reportPath, 'utf8'))
} catch {}

const reportMap = new Map(existingReport.map((entry) => [entry.file, entry]))

if (!images.length) {
  console.log('Không có ảnh nào cần nén (tất cả ảnh đều dưới 300KB hoặc đã nén WebP).')
} else {
  for (const { file, width, quality } of images) {
    const input = join(assetDir, file)
    const outputName = `${basename(file, extname(file))}.webp`
    const output = join(assetDir, outputName)
    try {
      const before = (await stat(input)).size
      await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(output)
      const after = (await stat(output)).size
      const record = { file, output: outputName, beforeKB: Math.round(before / 1024), afterKB: Math.round(after / 1024) }
      reportMap.set(file, record)
      console.log(`Đã nén ${file}: ${record.beforeKB}KB -> ${outputName}: ${record.afterKB}KB`)
    } catch (error) {
      console.error(`Lỗi khi nén ${file}: ${error.message}`)
      process.exitCode = 1
    }
  }
  await mkdir(join(root, 'scripts'), { recursive: true })
  await writeFile(reportPath, JSON.stringify([...reportMap.values()], null, 2), 'utf8')
}
