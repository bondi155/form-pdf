import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import ApexCharts from 'apexcharts'
function Percentage() {
    const [options, setOptions] = useState({
        chart: {
            height: 350,
            type: 'radialBar',
            offsetY: -10
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                dataLabels: {
                    name: {
                        fontSize: '16px',
                        color: undefined,
                        offsetY: 120
                    },
                    value: {
                        offsetY: 76,
                        fontSize: '22px',
                        color: undefined,
                        formatter: function (val) {
                            return val + "%";
                        }
                    }
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'dark',
                shadeIntensity: 0.15,
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 50, 65, 91]
            },
        },
        stroke: {
            dashArray: 4
        },
        labels: ['Asist'],
    });

    const [series, setSeries] = useState([67]);

    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="radialBar" height={350} />
        </div>
    );
}

export default Percentage;