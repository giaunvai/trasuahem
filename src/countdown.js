import { lunarDateForYear } from './lunar-calendar.js'

const DAY_IN_MS = 86400000
const HOUR_IN_MS = 3600000
const MINUTE_IN_MS = 60000

const parseCampaignDate = (date) => {
  if (!date) return null
  const parsed = new Date(`${date}T23:59:59+07:00`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const atStartOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
const addDays = (date, days) => new Date(date.getTime() + days * DAY_IN_MS)
const parseSolarDate = (date) => {
  if (!date) return null
  const parsed = new Date(`${date}T00:00:00+07:00`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

const getNextRecurringDate = (recurringDate, now) => {
  const [month, day] = String(recurringDate || '01-01').split('-').map(Number)
  if (!month || !day) return null
  const target = new Date(now.getFullYear(), month - 1, day, 23, 59, 59)
  if (target < now) target.setFullYear(now.getFullYear() + 1)
  return target
}

export const getCampaignTargetDate = ({ endDate, recurringDate } = {}, now = new Date()) => parseCampaignDate(endDate) || getNextRecurringDate(recurringDate, now)

const getSolarSchedule = (campaign, now) => {
  let eventStart
  if (campaign.eventDate) {
    eventStart = parseSolarDate(campaign.eventDate)
  } else {
    const [month, day] = String(campaign.recurringDate || '').split('-').map(Number)
    if (!month || !day) return null
    eventStart = parseSolarDate(`${now.getFullYear()}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
    if (addDays(eventStart, campaign.eventDurationDays || 3) <= now) eventStart = parseSolarDate(`${now.getFullYear() + 1}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
  }
  if (!eventStart) return null
  const eventEnd = addDays(eventStart, campaign.eventDurationDays || 3)
  const noticeStart = addDays(eventStart, -(campaign.noticeLeadDays || 10))
  const noticeEnd = addDays(eventStart, campaign.noticeEndOffsetDays ?? 7)
  return { eventStart, eventEnd, noticeStart, noticeEnd }
}

const getTetSchedule = (campaign, now) => {
  const eventDay = campaign.eventLunarStartDay || 1
  const eventMonth = campaign.eventLunarStartMonth || 1
  let lunarYear = now.getFullYear()
  let eventStart = lunarDateForYear(eventDay, eventMonth, lunarYear)
  let eventEnd = eventStart
  while (eventEnd <= atStartOfDay(now)) {
    lunarYear += 1
    eventStart = lunarDateForYear(eventDay, eventMonth, lunarYear)
    eventEnd = eventStart
  }
  const noticeStart = addDays(eventStart, -(campaign.noticeLeadDays || 35))
  return { eventStart, eventEnd, noticeStart, noticeEnd: eventEnd }
}

export const getCampaignSchedule = (campaign = {}, now = new Date()) => campaign.campaignType === 'tet' ? getTetSchedule(campaign, now) : getSolarSchedule(campaign, now)

export const isCampaignPopupActive = (campaign, now = new Date()) => {
  const schedule = getCampaignSchedule(campaign, now)
  return Boolean(schedule && campaign.active !== false && now >= schedule.noticeStart && now < schedule.noticeEnd)
}

export const getCampaignState = (campaign, now = new Date()) => {
  const schedule = getCampaignSchedule(campaign, now)
  if (!schedule || campaign.active === false) return { state: 'inactive', schedule }
  if (campaign.campaignType === 'tet' && now >= schedule.noticeStart && now < schedule.eventStart) return { state: 'live', schedule, target: schedule.eventEnd }
  if (now >= schedule.eventStart && now < schedule.eventEnd) return { state: 'live', schedule, target: schedule.eventEnd }
  if (campaign.displayMode === 'on' && now < schedule.eventStart) return { state: 'notice', schedule, target: schedule.eventStart }
  if (now >= schedule.noticeStart && now < schedule.eventStart) return { state: 'notice', schedule, target: schedule.eventStart }
  if (now < schedule.noticeStart) return { state: 'upcoming', schedule, target: schedule.noticeStart }
  return { state: 'ended', schedule, target: campaign.eventDate ? null : getCampaignSchedule(campaign, new Date(now.getTime() + 370 * DAY_IN_MS)).noticeStart }
}

export const mountCountdown = (element, campaign) => {
  if (!element) return () => {}

  const update = () => {
    const state = getCampaignState(campaign)
    const target = state.target
    if (!target) {
      element.textContent = state.state === 'ended' ? 'Đã kết thúc' : 'Đang cập nhật'
      return
    }
    const remaining = Math.max(0, target - new Date())
    const remainingDays = Math.floor(remaining / DAY_IN_MS)
    const remainingHours = Math.floor((remaining % DAY_IN_MS) / HOUR_IN_MS)
    const remainingMinutes = Math.floor((remaining % HOUR_IN_MS) / MINUTE_IN_MS)
    const remainingSeconds = Math.floor((remaining % MINUTE_IN_MS) / 1000)
    const pad = (value) => String(value).padStart(2, '0')
    element.textContent = `${remainingDays} ngày ${pad(remainingHours)}:${pad(remainingMinutes)}:${pad(remainingSeconds)}`
  }

  update()
  const intervalId = window.setInterval(update, 1000)
  return () => window.clearInterval(intervalId)
}
