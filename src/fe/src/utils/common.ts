export const formatDate = (isoString: string): string => {
  const inputDate = new Date(isoString);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - inputDate.getTime();
  const secondsDifference = Math.floor(timeDifference / 1000);

  const timeUnits = [
    { unit: "hour", value: Math.floor(secondsDifference / 3600) },
    { unit: "minute", value: Math.floor(secondsDifference / 60) },
    { unit: "second", value: secondsDifference },
  ];

  if (timeDifference < 24 * 60 * 60 * 1000) {
    for (const { unit, value } of timeUnits) {
      if (value > 0) {
        return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
      }
    }
  }

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return inputDate.toLocaleString("en-US", options);
};
