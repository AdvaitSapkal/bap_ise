import React, { useState, useEffect } from "react";
import { TextField, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import axios from "axios";
import Occupancy from '../components/Occupancy'; 

import { ServerUrl } from '../Constants'; 
const rooms = [
  "601", "410B", "406A", "404", "407", "606B", "408", "406B", "308",
  "606A", "608", "410A", "203", "702", "008", "604", "405", "503",
  "603B", "411", "409", "605", "509", "online", "506B", "702B",
  "603C", "603", "606", "603A", "702A", "609", "801", "607B", "703",
  "606-5", "606-4", "603-3", "603-2", "309", "410C", "412",
];

const daysOfWeek = [
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
];

function Room() {
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [occupiedRooms, setOccupiedRooms] = useState([]);

  useEffect(() => {
    if (day && startTime && endTime) {
      axios.get(`${ServerUrl}/query/availability/${startTime}/${endTime}/${day}`)
        .then(response => {
          // Assume the response contains an array of room names that are occupied
          setOccupiedRooms(response.data);
          console.log('Fetched occupied rooms:', response.data);
        })
        .catch(error => {
          console.error('Error fetching room availability:', error);
          setOccupiedRooms([]); // Handle error or show a message
        });
    }
  }, [day, startTime, endTime]); // Dependency array to re-fetch when these values change

  const checkIfOccupied = (room) => {
    return occupiedRooms.includes(room);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="p-4 w-full max-w-4xl">
        <div className="flex justify-center space-x-4 mb-8">
          <FormControl variant="outlined" >
            <InputLabel id="day-label">Day</InputLabel>
            <Select
              labelId="day-label"
              label="Day"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              sx={{ width: '160px',marginTop: '10px'}}
            >
              {daysOfWeek.map((day) => (
                <MenuItem key={day} value={day}>{day}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Start Time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            variant="filled"
            sx={{ padding: '10px' }}
          />
          <TextField
            label="End Time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            variant="filled"
            sx={{ padding: '10px' }}
          />
        </div>
        <div className="grid grid-cols-4 gap-5">
          {rooms.map((room) => (
            <div
              key={room}
              className={`p-10 rounded shadow-md font-semibold ${
                checkIfOccupied(room) ? "bg-red-500" : "bg-green-500"
              }`}
            >
              Room {room}
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center mt-10">
        <h1 className="text-2xl font-bold mt-4">Percentage occupancy of rooms</h1>
        <Occupancy occupiedRooms={occupiedRooms} totalRooms={rooms.length} />
        </div>
      </div>
    </div>
  );
}

export default Room;
