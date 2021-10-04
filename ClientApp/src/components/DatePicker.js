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
        backgroundColor: "#e2ddde",
        color: "#080707",
        '&:hover, &:focus': {
            color: "#e2ddde",
            backgroundColor: "#080707"
        },
    }),
    ...(!haveDay && {
        borderRadius: 0,
        backgroundColor: "#4D4D4D",
        disable: true,
        color: "#929292",
        '&:hover, &:focus': {
            backgroundColor: "#929292"
        },
    })
}));

export default function ForecastDatePicker(props) {
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

        try {
            const data = await response.json();
            if (data[0] != null) {
                props.onDateChange({ forecasts: data });
            } else {
                props.onDateChange({ forecasts: [] });
            }
        }
        catch (err) {
            console.log("err", err);
        }
    }

    useEffect(() => {
        async function getDates() {
            let response = await fetch(`Forecasts/dates`, {
                method: 'GET'
            });
            response = await response.json()
            setDates(response.map(x => new Date(x)));
        }
        getDates()
    }, [])



    const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
        const haveDay = !!dates.find(item => { return item.getTime() == date.getTime() });

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