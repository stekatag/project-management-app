import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (date: string, timezone: string = dayjs.tz.guess()) =>
  dayjs.utc(date).tz(timezone).format("MMM DD, YYYY, HH:mm");
