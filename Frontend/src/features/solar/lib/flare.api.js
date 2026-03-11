import {
  SOLAR_API_BASE,
  DEFAULT_START_DATE,
  DEFAULT_END_DATE,
  NASA_API_KEY,
} from "./flare.constants";

export async function fetchSolarFlares({
  startDate = DEFAULT_START_DATE,
  endDate = DEFAULT_END_DATE,
} = {}) {
  const url = new URL(SOLAR_API_BASE);

  url.searchParams.set("startDate", startDate);
  url.searchParams.set("endDate", endDate);
  url.searchParams.set("api_key", NASA_API_KEY);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Solar flare request failed: ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Unexpected solar flare response format.");
  }

  return data;
}