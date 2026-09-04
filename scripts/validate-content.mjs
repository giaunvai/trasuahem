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
  } else if (file === 'lucky-wheel.json' || file === 'li-xi-tet.json') {
    requireFields(content, ['title', 'description', 'captureInstruction', 'prizes', 'terms'], file)
    if (file === 'li-xi-tet.json' && Number(content.totalPrizeCount) !== 1000) errors.push(`${file}: totalPrizeCount must be 1000`)
    if (file === 'li-xi-tet.json' && Number(content.cooldownSeconds) < 60) errors.push(`${file}: cooldownSeconds must be at least 60`)
    if (!Array.isArray(content.prizes) || content.prizes.length < 2) errors.push(`${file}: prizes must contain at least 2 items`)
    if (!Array.isArray(content.terms)) errors.push(`${file}: terms must be an array`)
    const prizeIds = new Set()
    for (const prize of content.prizes || []) {
      requireFields(prize, ['id', 'label', 'detail', 'notice', 'weight', 'color', 'textColor'], `${file}: prize`)
      if (prize.redemption && prize.redemption !== 'next-order') errors.push(`${file}: prize ${prize.id || prize.label || ''} redemption must be next-order`)
      if (prize.id) prizeIds.add(prize.id)
      if (!(Number(prize.weight) > 0)) errors.push(`${file}: prize ${prize.id || prize.label || ''} weight must be greater than 0`)
    }
    if (prizeIds.size !== (content.prizes || []).length) errors.push(`${file}: prizes must use unique ids`)
    const totalWeight = (content.prizes || []).reduce((sum, prize) => sum + Number(prize.weight || 0), 0)
    if (Math.abs(totalWeight - 100) > 0.001) errors.push(`${file}: prize weights should total 100`)
    if (file === 'li-xi-tet.json') {
      const pools = new Map()
      for (const prize of content.prizes || []) {
        requireFields(prize, ['poolId', 'quantity'], `${file}: prize`)
        if (prize.poolId && !pools.has(prize.poolId)) pools.set(prize.poolId, Number(prize.quantity))
      }
      if ([...pools.values()].reduce((sum, quantity) => sum + quantity, 0) !== content.totalPrizeCount) errors.push(`${file}: pool quantities must total totalPrizeCount`)
    }
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
