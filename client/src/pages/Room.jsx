import React, { useState, useEffect } from "react";
import { TextField, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import axios from "axios";
import Occupancy from '../components/Occupancy'; 

import { ServerUrl } from '../Constants'; 

const rooms = [
  { name: "601", floor: "6th" }, { name: "410B", floor: "4th" }, { name: "406A", floor: "4th" }, { name: "404", floor: "4th" }, { name: "407", floor: "4th" },
  { name: "606B", floor: "6th" }, { name: "408", floor: "4th" }, { name: "406B", floor: "4th" }, { name: "308", floor: "3rd" }, { name: "606A", floor: "6th" },
  { name: "608", floor: "6th" }, { name: "410A", floor: "4th" }, { name: "203", floor: "2nd" }, { name: "702", floor: "7th" }, { name: "008", floor: "0th" },
  { name: "604", floor: "6th" }, { name: "405", floor: "4th" }, { name: "503", floor: "5th" }, { name: "603B", floor: "6th" }, { name: "411", floor: "4th" },
  { name: "409", floor: "4th" }, { name: "605", floor: "6th" }, { name: "509", floor: "5th" }, { name: "online", floor: "online" }, { name: "506B", floor: "5th" },
  { name: "702B", floor: "7th" }, { name: "603C", floor: "6th" }, { name: "603", floor: "6th" }, { name: "606", floor: "6th" }, { name: "603A", floor: "6th" },
  { name: "702A", floor: "7th" }, { name: "609", floor: "6th" }, { name: "801", floor: "8th" }, { name: "607B", floor: "6th" }, { name: "703", floor: "7th" },
  { name: "606-5", floor: "6th" }, { name: "606-4", floor: "6th" }, { name: "603-3", floor: "6th" }, { name: "603-2", floor: "6th" }, { name: "309", floor: "3rd" },
  { name: "410C", floor: "4th" }, { name: "412", floor: "4th" },
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
    return occupiedRooms.includes(room.name);
  };

  // Separate rooms by floor
  const floors = rooms.reduce((acc, room) => {
    if (!acc[room.floor]) {
      acc[room.floor] = [];
    }
    acc[room.floor].push(room);
    return acc;
  }, {});

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
        {/* Render rooms by floor */}
        {Object.entries(floors).map(([floor, roomsOnFloor]) => (
          <div key={floor}>
            <h1 className="text-xl font-bold mt-6 mb-2">{floor} floor</h1>
            <div className="grid grid-cols-4 gap-5">
              {roomsOnFloor.map((room) => (
                <div
                  key={room.name}
                  className={`p-10 rounded shadow-md font-semibold ${
                    checkIfOccupied(room) ? "bg-red-300" : "bg-green-400"
                  }`}
                >
                  <h1 className="text-lg font-semibold mb-2">{room.name}</h1>
                  <p className="text-sm text-gray-500">{room.floor} floor</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="flex flex-col items-center justify-center mt-10">
          <h1 className="text-2xl font-bold mt-4">Percentage occupancy of rooms</h1>
          <Occupancy occupiedRooms={occupiedRooms} totalRooms={rooms.length} />
        </div>
      </div>
    </div>
  );
}

export default Room;