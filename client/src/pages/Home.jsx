import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { ServerUrl } from '../Constants';
import axios from 'axios';
import { toast } from 'react-toastify';

const Home = () => {
    const [data, setData] = useState([]);
    const localizer = momentLocalizer(moment);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [faculty, setFaculty] = useState({
        faculty_code: "SYC",
        faculty_name: "Sheetal Choudhary"
    });
    const [facultyList, setFacultyList] = useState([
        {
            faculty_code: "SYC",
            faculty_name: "Sheetal Choudhary"
        },
        {
            faculty_code: "AH",
            faculty_name: "Aparna Halbe"
        },
        {
            faculty_code: "SD",
            faculty_name: "Surekha Dholay"
        },
        {
            faculty_code: "RK",
            faculty_name: "Reeta Koshy"
        },
        {
            faculty_code: "SC",
            faculty_name: "Siddhartha Chandra"
        },
        
    ]);

    useEffect(() => {
        fetchData("SYC");
    }, []);

    const fetchData = (facultyCode) => {
        setLoading(true);
        axios.get(`${ServerUrl}/query/faculty_code/${facultyCode}`)
            .then(res => {
                console.log("Data fetched");
                console.log(res.data);
                setData(res.data);
                const eventList = res.data.map((event) => {
                    const startDateTime = moment(`${event.start_time} ${event.day}`, "HH:mm:ss dddd").toDate();
                    const endDateTime = moment(`${event.end_time} ${event.day}`, "HH:mm:ss dddd").toDate();
                    const eventTitle = event.batch === "N" ? event.subject_code + " " + event.lab_or_lecture + " (" + event.room_num + ")": 
                    event.subject_code + " " + event.lab_or_lecture + " - " + event.batch + " (" + event.room_num + ")";

                    return {
                        title: eventTitle,
                        // title: event.subject_code + " " + event.lab_or_lecture + " - " + event.batch + " (" + event.room_num + ")",
                        start: startDateTime,
                        end: endDateTime,
                        resourceId: event.room_num
                    };
                });
                setEvents(eventList);
                console.log(eventList);
                setLoading(false);
            })
            .catch(err => {
                console.log("Error fetching data");
                console.log(err);
                toast.error("Error fetching data");
                setLoading(false);
            });
    };

    const handleChange = (value) => {
        console.log(value);
        setFaculty(value);
        fetchData(value.faculty_code);
    };

    return (
        <div className='w-full h-full flex items-center justify-center'>
            {loading ?
                (<div className='w-full h-full flex items-center justify-center'>
                    <CircularProgress />
                </div>) :
                (<div className='w-full h-full flex flex-col gap-4 items-center justify-center bg-white shadow-xl p-8'>
                    <Autocomplete
                        value={faculty}
                        onChange={(event, newValue) => {
                            handleChange(newValue);
                        }}
                        options={facultyList}
                        sx={{ width: 300 }}
                        getOptionLabel={(option) => option.faculty_name}
                        renderInput={(params) => <TextField {...params} label="Select Faculty" />}
                    />
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        views={['week', 'day']}
                        defaultView="week"
                        defaultDate={new Date()}
                        style={{ height: 600, width: '100%' }}
                    />
                </div>)}
        </div>
    );
};

export default Home;
