const TIME_ZONE = 7
const PI = Math.PI

const jdFromDate = (day, month, year) => {
  const value = Math.floor((14 - month) / 12)
  const adjustedYear = year + 4800 - value
  const adjustedMonth = month + 12 * value - 3
  let julianDay = day + Math.floor((153 * adjustedMonth + 2) / 5) + 365 * adjustedYear + Math.floor(adjustedYear / 4) - Math.floor(adjustedYear / 100) + Math.floor(adjustedYear / 400) - 32045
  if (julianDay < 2299161) julianDay = day + Math.floor((153 * adjustedMonth + 2) / 5) + 365 * adjustedYear + Math.floor(adjustedYear / 4) - 32083
  return julianDay
}

const jdToDate = (julianDay) => {
  let adjustedDay
  let adjustedMonth
  let adjustedYear
  if (julianDay > 2299160) {
    const value = julianDay + 32044
    const century = Math.floor((4 * value + 3) / 146097)
    const dayOfCentury = value - Math.floor((146097 * century) / 4)
    const yearOfCentury = Math.floor((4 * dayOfCentury + 3) / 1461)
    const dayOfYear = dayOfCentury - Math.floor((1461 * yearOfCentury) / 4)
    const monthOfYear = Math.floor((5 * dayOfYear + 2) / 153)
    adjustedDay = dayOfYear - Math.floor((153 * monthOfYear + 2) / 5) + 1
    adjustedMonth = monthOfYear + 3 - 12 * Math.floor(monthOfYear / 10)
    adjustedYear = century * 100 + yearOfCentury - 4800 + Math.floor(monthOfYear / 10)
  } else {
    const value = julianDay + 32082
    const yearValue = Math.floor((4 * value + 3) / 1461)
    const dayValue = value - Math.floor((1461 * yearValue) / 4)
    const monthValue = Math.floor((5 * dayValue + 2) / 153)
    adjustedDay = dayValue - Math.floor((153 * monthValue + 2) / 5) + 1
    adjustedMonth = monthValue + 3 - 12 * Math.floor(monthValue / 10)
    adjustedYear = yearValue - 4800 + Math.floor(monthValue / 10)
  }
  return { day: adjustedDay, month: adjustedMonth, year: adjustedYear }
}

const newMoon = (k) => {
  const time = k / 1236.85
  const time2 = time * time
  const time3 = time2 * time
  let value = 2415020.75933 + 29.53058868 * k + 0.0001178 * time2 - 0.000000155 * time3
  value += 0.00033 * Math.sin((166.56 + 132.87 * time - 0.009173 * time * time) * PI / 180)
  const meanAnomaly = (359.2242 + 29.10535608 * k - 0.0000333 * time2 - 0.00000347 * time3) * PI / 180
  const sunAnomaly = (306.0253 + 385.81691806 * k + 0.0107306 * time2 + 0.00001236 * time3) * PI / 180
  const moonArgument = (21.2964 + 390.67050646 * k - 0.0016528 * time2 - 0.00000239 * time3) * PI / 180
  const correction = (0.1734 - 0.000393 * time) * Math.sin(meanAnomaly) + 0.0021 * Math.sin(2 * meanAnomaly) - 0.4068 * Math.sin(sunAnomaly) + 0.0161 * Math.sin(2 * sunAnomaly) - 0.0004 * Math.sin(3 * sunAnomaly) + 0.0104 * Math.sin(2 * moonArgument) - 0.0051 * Math.sin(meanAnomaly + sunAnomaly) - 0.0074 * Math.sin(meanAnomaly - sunAnomaly) + 0.0004 * Math.sin(2 * moonArgument + meanAnomaly) - 0.0004 * Math.sin(2 * moonArgument - meanAnomaly) - 0.0006 * Math.sin(2 * moonArgument + sunAnomaly) + 0.0010 * Math.sin(2 * moonArgument - sunAnomaly) + 0.0005 * Math.sin(meanAnomaly + 2 * sunAnomaly)
  if (time < -11) value += 0.0000032 * Math.sin((140.0 + 21.2964 * time) * PI / 180)
  else value += 0.000325 * Math.sin((299.77 + 0.107408 * time - 0.009173 * time2) * PI / 180) + 0.000165 * Math.sin((251.88 + 0.016321 * time) * PI / 180) + 0.000164 * Math.sin((251.83 + 26.651886 * time) * PI / 180) + 0.000126 * Math.sin((349.42 + 36.412478 * time) * PI / 180) + 0.000110 * Math.sin((84.66 + 18.206239 * time) * PI / 180) + 0.000062 * Math.sin((141.74 + 53.303771 * time) * PI / 180) + 0.000060 * Math.sin((207.14 + 2.453732 * time) * PI / 180) + 0.000056 * Math.sin((154.84 + 7.306860 * time) * PI / 180) + 0.000047 * Math.sin((34.52 + 27.261239 * time) * PI / 180) + 0.000042 * Math.sin((207.19 + 0.121824 * time) * PI / 180) + 0.000040 * Math.sin((291.34 + 1.844379 * time) * PI / 180) + 0.000037 * Math.sin((161.72 + 24.198154 * time) * PI / 180) + 0.000035 * Math.sin((239.56 + 25.513099 * time) * PI / 180) + 0.000023 * Math.sin((331.55 + 3.592518 * time) * PI / 180)
  value += correction
  return value
}

const sunLongitude = (julianDay) => {
  const time = (julianDay - 2451545.5 - TIME_ZONE / 24) / 36525
  const time2 = time * time
  const meanAnomaly = (357.52910 + 35999.05030 * time - 0.0001559 * time2 - 0.00000048 * time * time2) * PI / 180
  const meanLongitude = (280.46645 + 36000.76983 * time + 0.0003032 * time2) * PI / 180
  const equation = (1.914600 - 0.004817 * time - 0.000014 * time2) * Math.sin(meanAnomaly) + (0.019993 - 0.000101 * time) * Math.sin(2 * meanAnomaly) + 0.000290 * Math.sin(3 * meanAnomaly)
  let longitude = meanLongitude + equation * PI / 180
  longitude -= 2 * PI * Math.floor(longitude / (2 * PI))
  return Math.floor((longitude / PI) * 6)
}

const newMoonDay = (k) => Math.floor(newMoon(k) + 0.5 + TIME_ZONE / 24)
const lunarMonth11 = (year) => {
  const off = jdFromDate(31, 12, year) - 2415021
  const k = Math.floor(off / 29.530588853)
  let month11 = newMoonDay(k)
  if (sunLongitude(month11) >= 9) month11 = newMoonDay(k - 1)
  return month11
}
const leapMonthOffset = (a11) => {
  const k = Math.floor(0.5 + (a11 - 2415021.076998695) / 29.530588853)
  let last = 0
  let i = 1
  let arc = sunLongitude(newMoonDay(k + i))
  do {
    last = arc
    i += 1
    arc = sunLongitude(newMoonDay(k + i))
  } while (arc !== last && i < 15)
  return i - 1
}

const lunarFormatter = new Intl.DateTimeFormat('en-u-ca-chinese', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: 'numeric', day: 'numeric' })
const lunarParts = (date) => Object.fromEntries(lunarFormatter.formatToParts(date).filter(({ type }) => ['day', 'month', 'relatedYear'].includes(type)).map(({ type, value }) => [type, Number(value)]))

export const solarToLunar = (date) => {
  const parts = lunarParts(date)
  return { day: parts.day, month: parts.month, year: parts.relatedYear, leap: false }
}

export const lunarToSolar = (day, month, year, leap = false) => {
  let month11
  let month11Previous
  month11 = lunarMonth11(month >= 11 ? year : year - 1)
  month11Previous = lunarMonth11(month >= 11 ? year - 1 : year - 2)
  let offset = month - 11
  if (offset < 0) offset += 12
  const leapOffset = month >= 11 && month11 - month11Previous > 365 ? leapMonthOffset(month11Previous) : 0
  let leapMonth = leapOffset - 2
  if (leapMonth < 0) leapMonth += 12
  if (leap && month !== leapMonth) return null
  if (leap || offset >= leapOffset) offset += 1
  const monthStart = newMoonDay(Math.floor(0.5 + (month11 - 2415021.076998695) / 29.530588853) + offset)
  return jdToDate(monthStart + day - 1)
}

const dateFromParts = ({ day, month, year }) => new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T00:00:00+07:00`)
export const lunarDateForYear = (day, month, year) => {
  const start = Date.UTC(year - 1, 0, 1, 12)
  for (let offset = 0; offset < 800; offset += 1) {
    const candidate = new Date(start + offset * 86400000)
    const parts = lunarParts(candidate)
    if (parts.relatedYear === year && parts.month === month && parts.day === day) {
      const solar = { day: candidate.getUTCDate(), month: candidate.getUTCMonth() + 1, year: candidate.getUTCFullYear() }
      return dateFromParts(solar)
    }
  }
  return null
}
export const getNextLunarDate = ({ day, month }, now = new Date()) => {
  const currentLunar = solarToLunar(now)
  let year = currentLunar.year
  if (currentLunar.month > month || (currentLunar.month === month && currentLunar.day >= day)) year += 1
  return lunarDateForYear(day, month, year)
}
