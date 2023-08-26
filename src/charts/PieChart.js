import React from 'react';
import ReactApexChart from 'react-apexcharts';

function PieChart({seriesValues, labelsValue, colorsValue}) {
  const options = {
    labels: labelsValue,
    colors : colorsValue,
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom',
          
        },
      }
    }]
  };

  const series = seriesValues;

  return (
    <ReactApexChart 
      options={options} 
      series={series} 
      type="pie" 
      width={380} 
    />
  );
}

export default PieChart;