import { Box, Typography } from "@mui/material";
import React from "react";

const CityDateDetail = (props) => {
  function getCurrentTimeFromTimezone(timezoneOffset) {
    // Get the current UTC time in milliseconds
    const currentUtcTimeMs = new Date().getTime();

    // Calculate the local time by adding the timezone offset to the UTC time
    const localTime = new Date(currentUtcTimeMs + timezoneOffset * 1000);

    // Format the date to "MMM DD" (e.g., "Aug 30") based on the given timezone
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      timeZone: `UTC`,
      month: "short",
      day: "numeric",
    }).format(localTime);

    return formattedDate;
  }

  // Get the formatted date
  const formattedDate = getCurrentTimeFromTimezone(props.date);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        height: "100%",
      }}
    >
      <Typography
        variant="h3"
        component="h3"
        sx={{
          fontFamily: "Poppins",
          fontWeight: "600",
          fontSize: { xs: "12px", sm: "14px", md: "16px" },
          color: "white",
          textTransform: "uppercase",
          lineHeight: 1,
          marginBottom: "8px",
        }}
      >
        {props.city}
      </Typography>
      <Typography
        variant="h4"
        component="h4"
        sx={{
          fontSize: { xs: "10px", sm: "12px", md: "14px" },
          color: "rgba(255,255,255, .7)",
          lineHeight: 1,
          letterSpacing: { xs: "1px", sm: "0" },
          fontFamily: "Roboto Condensed",
        }}
      >
        Today, {formattedDate}
      </Typography>
    </Box>
  );
};

export default CityDateDetail;
