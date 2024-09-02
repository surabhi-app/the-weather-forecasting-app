import { Typography } from "@mui/material";
import React from "react";

const UTCDatetime = ({ timezoneOffset }) => {
  const getDatetimeFromTimezone = (timezoneOffset) => {
    // Create a new Date object in UTC
    const currentUtcTimeMs = new Date().getTime();

    // Get the time in milliseconds and adjust by the timezone offset
    const localTime = new Date(currentUtcTimeMs + timezoneOffset * 1000);

    // Format the local time to "MMM DD, YYYY HH:MM AM/PM"
    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
      timeZone: `UTC`,
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(localTime);

    return formattedDateTime;
  };

  const localFullDate = getDatetimeFromTimezone(timezoneOffset);

  return (
    <Typography
      variant="h3"
      component="h3"
      sx={{
        fontWeight: "400",
        fontSize: { xs: "10px", sm: "12px" },
        color: "rgba(255, 255, 255, .7)",
        lineHeight: 1,
        paddingRight: "2px",
        fontFamily: "Poppins",
      }}
    >
      {localFullDate}
    </Typography>
  );
};

export default UTCDatetime;
