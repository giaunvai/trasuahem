import { mkdir, stat, writeFile } from 'node:fs/promises'
import { join, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const assetDir = join(root, 'src', 'assets')
const reportPath = join(root, 'scripts', 'image-report.json')

// width: chiều ngang tối đa (đủ nét cho màn hình retina), quality: chất lượng WebP
const images = [
  { file: 'P1220686.JPG', width: 1200, quality: 82 },
  { file: 'P1230758.JPG', width: 1200, quality: 82 },
  { file: 'P1240267.JPG', width: 1200, quality: 82 },
  { file: 'P1240308.JPG', width: 1200, quality: 82 },
  { file: 'tra_sua_hem_noPhone.png', width: 1200, quality: 82 },
  { file: 'Tra_Sua_Kem_Muoi.png', width: 1200, quality: 82 },
  { file: 'popup_tet.png', width: 1200, quality: 82 },
  { file: 'menu.jpg', width: 1600, quality: 82 },
]

const report = []
for (const { file, width, quality } of images) {
  const input = join(assetDir, file)
  const outputName = `${basename(file, extname(file))}.webp`
  const output = join(assetDir, outputName)
  try {
    const before = (await stat(input)).size
    await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality }).toFile(output)
    const after = (await stat(output)).size
    report.push({ file, output: outputName, beforeKB: Math.round(before / 1024), afterKB: Math.round(after / 1024) })
    console.log(`${file}: ${Math.round(before / 1024)}KB -> ${outputName}: ${Math.round(after / 1024)}KB`)
  } catch (error) {
    console.error(`Lỗi khi nén ${file}: ${error.message}`)
    process.exitCode = 1
  }
}
await mkdir(join(root, 'scripts'), { recursive: true })
await writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8')
