import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const contentDir = join(root, 'public', 'content')
const assetDir = join(root, 'src', 'assets')
const errors = []
const requireFields = (value, fields, label) => fields.forEach((field) => {
  if (value?.[field] === undefined || value?.[field] === null) errors.push(`${label}: missing ${field}`)
})

const files = (await readdir(contentDir)).filter((file) => file.endsWith('.json'))
for (const file of files) {
  const filePath = join(contentDir, file)
  let content
  try {
    content = JSON.parse(await readFile(filePath, 'utf8'))
  } catch (error) {
    errors.push(`${relative(root, filePath)}: invalid JSON (${error.message})`)
    continue
  }

  if (file === 'site.json') {
    requireFields(content, ['orderUrl', 'hero', 'member', 'about', 'hours', 'menu', 'foodApps', 'locations'], file)
    if (!Array.isArray(content.about?.paragraphs)) errors.push(`${file}: about.paragraphs must be an array`)
    if (!Array.isArray(content.hours?.items)) errors.push(`${file}: hours.items must be an array`)
    if (!Array.isArray(content.foodApps?.branches)) errors.push(`${file}: foodApps.branches must be an array`)
    if (!Array.isArray(content.locations)) errors.push(`${file}: locations must be an array`)
  } else {
    requireFields(content, ['campaignType', 'campaignName', 'orderUrl', 'heroImage', 'productImages', 'steps', 'terms', 'locations'], file)
    const productImages = content.productImages || []
    if (![1, 3, 5].includes(productImages.length)) errors.push(`${file}: productImages must contain 1, 3, or 5 items`)
    if (new Set(productImages.map((product) => product.file)).size !== productImages.length) errors.push(`${file}: productImages must use unique assets`)
    for (const product of productImages) {
      if (!product.file) errors.push(`${file}: product image is missing file`)
      else {
        try {
          const asset = await readFile(join(assetDir, product.file))
          if (asset.length > 400 * 1024) errors.push(`${file}: asset ${product.file} nặng ${Math.round(asset.length / 1024)}KB, hãy nén dưới 400KB (chạy node scripts/optimize-images.mjs)`)
        } catch { errors.push(`${file}: missing asset src/assets/${product.file}`) }
      }
    }
    if (!Array.isArray(content.steps)) errors.push(`${file}: steps must be an array`)
    if (!Array.isArray(content.terms)) errors.push(`${file}: terms must be an array`)
    if (!Array.isArray(content.locations)) errors.push(`${file}: locations must be an array`)
    if (content.posterImage) {
      try { await readFile(join(assetDir, content.posterImage)) } catch { errors.push(`${file}: missing poster asset src/assets/${content.posterImage}`) }
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Validated ${files.length} content files and all referenced campaign assets.`)
}
