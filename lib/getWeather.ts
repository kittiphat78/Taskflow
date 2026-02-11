export default async function getWeather(city: string) {
  const key = process.env.WEATHER_KEY
  if (!key) throw new Error('Missing environment variable WEATHER_KEY')

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&appid=${key}&units=metric`
  )

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Failed to fetch weather: ${res.status} ${res.statusText} - ${body}`)
  }

  return res.json()
}
