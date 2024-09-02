import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  SvgIcon,
  Typography,
} from "@mui/material";
import Search from "./components/Search/Search";
import WeeklyForecast from "./components/WeeklyForecast/WeeklyForecast";
import TodayWeather from "./components/TodayWeather/TodayWeather";
import { fetchWeatherData } from "./api/OpenWeatherService";
import { transformDateFormat } from "./utilities/DatetimeUtils";
import UTCDatetime from "./components/Reusable/UTCDatetime";
import LoadingBox from "./components/Reusable/LoadingBox";
import { ReactComponent as SplashIcon } from "./assets/splash-icon.svg";
import Logo from "./assets/logo.png";
import ErrorBox from "./components/Reusable/ErrorBox";
import { ALL_DESCRIPTIONS } from "./utilities/DateConstants";
import CloseIcon from "@mui/icons-material/Close";
import {
  getTodayForecastWeather,
  getWeekForecastWeather,
} from "./utilities/DataUtils";
import { format, addSeconds } from "date-fns";

const convertToCityTime = (date, timezoneOffset) => {
  // Convert local date to the city's timezone
  return addSeconds(date, timezoneOffset);
};

const formatDateToYYYYMMDD = (date) => {
  return format(date, "yyyy-MM-dd");
};

const convertToCityTimeFormat = (date, timezoneOffsetInSeconds) => {
  // Get the current time in milliseconds
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60000; // getTimezoneOffset is in minutes
  // Adjust time with the timezone offset (in milliseconds)
  const cityTime = new Date(utcTime + timezoneOffsetInSeconds * 1000);
  return cityTime;
};

const formatDateToYYYYMMDDFormat = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function App() {
  const [todayWeather, setTodayWeather] = useState(null);
  const [clear, setClear] = useState(false);
  const [todayForecast, setTodayForecast] = useState([]);
  const [weekForecast, setWeekForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [cityTime, setCityTime] = useState("");

  const searchChangeHandler = async (enteredData) => {
    const [latitude, longitude] = enteredData.value.split(" ");

    setIsLoading(true);

    try {
      const [todayWeatherResponse, weekForecastResponse] =
        await fetchWeatherData(latitude, longitude, enteredData.label);
      const timezoneOffset = todayWeatherResponse.timezone;

      const cityTime = convertToCityTimeFormat(new Date(), timezoneOffset);
      setCityTime(cityTime);

      // Format the city time to YYYY-MM-DD for date matching
      const currentDate = formatDateToYYYYMMDDFormat(cityTime);
      const cityUnixTime = Math.floor(cityTime.getTime() / 1000);

      const all_today_forecasts_list = getTodayForecastWeather(
        weekForecastResponse,
        currentDate,
        cityUnixTime
      );

      const all_week_forecasts_list = getWeekForecastWeather(
        weekForecastResponse,
        ALL_DESCRIPTIONS
      );

      setTodayForecast([...all_today_forecasts_list]);
      setTodayWeather({ city: enteredData.label, ...todayWeatherResponse });
      setWeekForecast({
        city: enteredData.label,
        list: all_week_forecasts_list,
      });
      setClear(true);
      setTimeout(() => setClear(false), 1000);
    } catch (error) {
      setError(true);
    }

    setIsLoading(false);
  };
  const [backgroundImage, setBackgroundImage] = useState("");

  let appContent = (
    <Box
      xs={12}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: "100%",
        minHeight: "500px",
      }}
    >
      <SvgIcon
        component={SplashIcon}
        inheritViewBox
        sx={{ fontSize: { xs: "100px", sm: "120px", md: "140px" } }}
      />
      <Typography
        variant="h4"
        component="h4"
        sx={{
          fontSize: { xs: "12px", sm: "14px" },
          color: "rgba(255,255,255, .85)",
          fontFamily: "Poppins",
          textAlign: "center",
          margin: "2rem 0",
          maxWidth: "80%",
          lineHeight: "22px",
        }}
      >
        Explore current weather data and 5-day forecast of more than 200,000
        cities!
      </Typography>
    </Box>
  );

  if (todayWeather && todayForecast && weekForecast) {
    appContent = (
      <React.Fragment>
        <Grid item xs={12} md={todayWeather ? 6 : 12}>
          <Grid item xs={12}>
            <TodayWeather data={todayWeather} forecastList={todayForecast} />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <WeeklyForecast data={weekForecast} time={cityTime} />
        </Grid>
      </React.Fragment>
    );
  }

  if (error) {
    appContent = (
      <ErrorBox
        margin="3rem auto"
        flex="inherit"
        errorMessage="Something went wrong"
      />
    );
  }

  if (isLoading) {
    appContent = (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          minHeight: "500px",
        }}
      >
        <LoadingBox value="1">
          <Typography
            variant="h3"
            component="h3"
            sx={{
              fontSize: { xs: "10px", sm: "12px" },
              color: "rgba(255, 255, 255, .8)",
              lineHeight: 1,
              fontFamily: "Poppins",
            }}
          >
            Loading...
          </Typography>
        </LoadingBox>
      </Box>
    );
  }

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Container
      sx={{
        maxWidth: { xs: "95%", sm: "80%", md: "1100px" },
        width: "100%",
        minHeight: "80vh",
        padding: "1rem 0 3rem",
        marginBottom: "1rem",
        borderRadius: {
          xs: "none",
          sm: "0 0 1rem 1rem",
        },
      }}
    >
      <Grid container columnSpacing={2}>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              width: "100%",
              marginBottom: "1rem",
            }}
          >
            <Box
              component="img"
              sx={{
                height: { xs: "16px", sm: "22px", md: "26px" },
                width: "auto",
              }}
              alt="logo"
              src={Logo}
            />
            {todayWeather && (
              <UTCDatetime timezoneOffset={todayWeather.timezone} />
            )}
          </Box>
          <Search onSearchChange={searchChangeHandler} clear={clear} />
        </Grid>
        {appContent}
      </Grid>
      <Box
        display={"flex"}
        height={"10vh"}
        justifyContent={"center"}
        alignItems={"end"}
      >
        <Box>
          <Button onClick={handleClickOpen}>Info</Button>
          <Typography
          variant="body1"
         component="p"
          sx={{
          fontSize: { xs: "10px", sm: "12px" },
          color: "rgba(255,255,255, .85)",
          fontStyle: "italic",
          textAlign: "center",
          lineHeight: "12px",
      }}
      >
      ***developed by Surabhi Acharjee***
      </Typography>
        </Box>
      </Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"About PM Accelarator"}</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          The Product Manager Accelerator Program is designed to support PM professionals through every stage of their career. From students looking for entry-level jobs to Directors looking to take on a leadership role, our program has helped over hundreds of students fulfill their career aspirations. Our Product Manager Accelerator community are ambitious and committed. Through our program they have learnt, honed and developed new PM and leadership skills, giving them a strong foundation for their future endeavours. Learn product management for free today on our YouTube channel https://www.youtube.com/c/drnancyli?sub_confirmation=1 
          Interested in PM Accelerator Pro? 
          Step 1️⃣: Attend the Product Masterclass to learn more about the program details, price, different packages, and stay until the end to get FREE AI Course. Learn how to create a killer product portfolio 2 two weeks that will help you land any PM job( traditional or AI) even if you were laid off or have zero PM experience https://www.drnancyli.com/masterclass 
          Step 2️⃣: Reserve your early bird ticket and submit an application to talk to our Head of Admission 
          Step 3️⃣: Successful applicants join our PMA Pro community to receive customized coaching!

Website
http://www.drnancyli.com

Phone
+1 6176106855

Industry
E-Learning Providers

Company size
2-10 employees
54 associated members 

Headquarters
Boston, MA

Founded
2020

Specialties
Product Management, Product Manager, Product Management Training, Product Management Certification, Product Lead, Product Executive, Associate Product Manager, product management coaching, product manager resume, Product Management Interview, VP of Product, Director of Product, and Chief Product Officer.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

export default App;
