import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ActivityChart = ({ data, type = 'bar', width = '100%', height = 300 }) => {
  const defaultData = [
    { name: 'Mon', analyses: 12, threats: 3 },
    { name: 'Tue', analyses: 19, threats: 5 },
    { name: 'Wed', analyses: 15, threats: 2 },
    { name: 'Thu', analyses: 22, threats: 7 },
    { name: 'Fri', analyses: 18, threats: 4 },
    { name: 'Sat', analyses: 25, threats: 6 },
    { name: 'Sun', analyses: 20, threats: 3 },
  ];

  const chartData = data || defaultData;

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="analyses" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="threats" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        );
      
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="analyses"
            />
            <Tooltip />
          </PieChart>
        );
      
      default:
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="analyses" fill="#8884d8" />
            <Bar dataKey="threats" fill="#82ca9d" />
          </BarChart>
        );
    }
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width={width} height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;
