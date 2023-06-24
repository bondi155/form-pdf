import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useRecoilValue } from 'recoil';
import { queryResults } from '../storage/GlobalStates';
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

    const personalData = useRecoilValue(queryResults);

  // Acceder a 'asist' en 'personalData'
  const asistValues = personalData.map(item => item.asist);

   

    const [series, setSeries] = useState([asistValues]);



    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="radialBar" height={350} />
        </div>
    );
}

export default Percentage;