import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const Occupancy = ({ occupiedRooms, totalRooms }) => {
  const data = [
    { name: 'Occupied', value: occupiedRooms.length },
    { name: 'Free', value: totalRooms - occupiedRooms.length },
  ];

  const COLORS = ['#EF4444', '#22C55E']; // Colors for occupied and free

  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx={200}
        cy={200}
        labelLine={false}
        outerRadius={150}
        fill="#8884d8"
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default Occupancy;
