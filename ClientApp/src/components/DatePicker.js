import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DatePicker from '@material-ui/lab/DatePicker';
import { type } from 'jquery';
import { useEffect } from 'react';
import { getDate, setDate } from 'date-fns';
import { Paper, Grid } from "@material-ui/core";
import PickersDay from '@material-ui/lab/PickersDay';
import { styled } from '@material-ui/core/styles';


const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) =>
        prop !== 'haveDay',
})

(({ haveDay }) => ({
    ...(haveDay && {
        borderRadius: 0,
        backgroundColor: "#FFC0CB",
        color: "#FFC00F",
        '&:hover, &:focus': {
            backgroundColor: "#BBCC0F"
        },
    }),
    ...(!haveDay && {
        borderRadius: 0,
        backgroundColor: "#4D4D4D",
        disable: true,
        color: "#212121",
        '&:hover, &:focus': {
            backgroundColor: "#212121"
        },
    })
}));

export default function BasicDatePicker(props) {
    const [value, setValue] = React.useState(Date.now());
    const [dates, setDates] = React.useState([]);

    const handleChange = async (e) => {
        let year = e.getFullYear();
        let day = e.getDate();
        let month = e.getMonth() + 1;
        let myDate = year + "-" + month + "-" + day;
        setValue(e);
        const response = await fetch(`Forecasts/${myDate}`, {
            method: 'GET'
        });
        //const response = await fetch(`Forecasts`);

        try {
            //console.log(response);
            const data = await response.json();
            if (data[0] != null) {
                props.onDateChange({ forecasts: data });

            }
        }
        catch (err) {
            console.log("err", err);
        }
    }

    useEffect(() => {
        async function getDates() {
            console.log("got dates?");
            let response = await fetch(`Forecasts/dates`, {
                method: 'GET'
            });
            response = await response.json()
            console.log(response);
            setDates(response.map(x => new Date(x)));

        }
        getDates()

    }, [])

    function getDayElement(day) {
        let haveDay = dates.includes(day.Date);
        console.log(day.Date);
        console.log(dates)
        console.log(haveDay);
        let dateTile = null;
        if (haveDay) {
            dateTile = (
                <Paper>
                    <Grid item>
                        {day.getDate()}
                    </Grid>
                </Paper>)
        } else {
            dateTile = (<Paper >
                <Grid item>
                    {day.getDate()}
                </Grid>
            </Paper>)
        }
        return dateTile;
    }


    const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {

        console.log("render week picker day baby");
        //console.log(date);

        //console.log(type(date));
        //console.log(dates)
        //console.log(type(dates));
        //console.log(dates[0]);
        //console.log(type(dates[0]));
        const haveDay3 = dates.includes(date);
        //console.log(haveDay3);
        const haveDay = !!dates.find(item => { return item.getTime() == date.getTime() });
        //console.log(haveDay);

        return (
            <CustomPickersDay
                {...pickersDayProps}
                disableMargin
                haveDay={haveDay}
            />
        );
    };


    function haveDayResult(date) {
        return !!!dates.find(item => { return item.getTime() == date.getTime() });
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                label="Date Viewed Below"
                value={value}
                onChange={(newValue) => {
                    handleChange(newValue);
                }}
                renderDay={renderWeekPickerDay}
                shouldDisableDate={haveDayResult}
                renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
    );
}

// this may be deprecated
// renderDay={(day, haveDay) => getDayElement(day)}