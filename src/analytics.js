const getUtmParameters = () => Object.fromEntries([...new URLSearchParams(window.location.search)].filter(([key]) => key.startsWith('utm_')))

export const track = (name, parameters = {}) => {
  const event = { event: name, ...getUtmParameters(), ...parameters }
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(event)
  window.gtag?.('event', name, event)
  window.fbq?.('trackCustom', name, event)
}

export const initAnalytics = (analytics = {}) => {
  const scripts = []
  if (analytics.ga4MeasurementId) {
    window.dataLayer = window.dataLayer || []
    window.gtag = (...args) => window.dataLayer.push(args)
    window.gtag('js', new Date())
    window.gtag('config', analytics.ga4MeasurementId)
    scripts.push(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analytics.ga4MeasurementId)}`)
  }
  if (analytics.metaPixelId) {
    window.fbq = window.fbq || ((...args) => (window.fbq.queue = window.fbq.queue || []).push(args))
    window.fbq.loaded = true
    window.fbq.version = '2.0'
    window.fbq('init', analytics.metaPixelId)
    window.fbq('track', 'PageView')
    scripts.push('https://connect.facebook.net/en_US/fbevents.js')
  }
  const loadScripts = () => scripts.forEach((src) => {
    if (document.querySelector(`script[src="${src}"]`)) return
    const script = document.createElement('script')
    script.async = true
    script.src = src
    document.head.append(script)
  })
  if (!scripts.length) return
  if ('requestIdleCallback' in window) window.requestIdleCallback(loadScripts, { timeout: 4000 })
  else window.setTimeout(loadScripts, 2000)
}

export const trackLinkClicks = (eventName) => document.addEventListener('click', (event) => {
  const link = event.target.closest('a')
  if (!link) return
  track(eventName, { cta_text: link.textContent.trim(), cta_url: link.href })
})
