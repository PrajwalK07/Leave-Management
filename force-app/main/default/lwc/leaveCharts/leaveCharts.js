import { LightningElement, api, track } from 'lwc';
import chartjs from '@salesforce/resourceUrl/ChartJs';
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

//https://anothersalesforceblog.com/2021/02/24/creating-dynamic-charts-with-chart-js-part-two/
export default class ChartExample extends LightningElement {
    @api total
    @api consumed
    @api remaining
    @api type
    @track isChartJsInitialized;
    //chartData=[]

    

    
   
   
    chart;
    data = {
        labels: [
          'Consumed Leave',
          'Remaining Leave' 
        ],
        datasets: [
            {
                data: [],
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)'
                   
                ],
          hoverOffset: 4
        }]
      }

       config = {
        type: 'doughnut',
        data: this.data,
        options: {
            plugins: {
              datalabels: {
                display: true,
                backgroundColor: '#ccc',
                borderRadius: 3,
                font: {
                  color: 'red',
                  weight: 'bold',
                },
              },
              doughnutlabel: {
                labels: [
                  {
                    text: '550',
                    font: {
                      size: 20,
                      weight: 'bold',
                    },
                  },
                  {
                    text: 'total',
                  },
                ],
              },
            },
          },
        
      };

    /*config = {
        type: 'doughnut',
        data: {
            datasets: [{
                fill: false,
                label: 'Line Dataset',
                data: [],
                backgroundColor: [
                    '#80aaff'
                ],
                borderColor: [
                    'blue'
                ],
                pointBackgroundColor: '#80aaff',
                pointBorderColor: 'blue'
            }
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Sand Samples Against Comm Weight %.'
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 140,
                        stepSize: 10
                    }
                }],
                yAxes: [{
                    type: 'linear',
                    ticks: {
                        autoSkip: true,
                        suggestedMin: 0,
                        suggestedMax: 100,
                        stepSize: 5,
                        callback: function (value) {
                            return value + '%';
                        }
                    }
                }]
            },
        }
    };*/

    renderedCallback() {
        if (this.isChartJsInitialized) {
            return;
        }
        this.isChartJsInitialized = true;

        Promise.all([
            loadScript(this, chartjs)
        ]).then(() => {
            //this.chartData=[this.consumed,this.remaining]
            //console.log('this.chartData'+this.chartData)
            console.log('this.cons'+this.consumed)
            console.log('this.ren'+this.remaining)
            this.config.data.datasets[0].data.push(this.consumed);
            this.config.data.datasets[0].data.push(this.remaining);
            console.log('this.config'+JSON.stringify(this.config) )
            const ctx = this.template.querySelector('canvas.linechart').getContext('2d');
            this.chart = new window.Chart(ctx, this.config);
            this.chart.canvas.parentNode.style.height = '100%';
            this.chart.canvas.parentNode.style.width = '100%';
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading ChartJS',
                    message: error.message,
                    variant: 'error',
                }),
            );
        });
    }



    updateChart(count,label)
    {

        this.chart.data.labels.push(label);
        this.chart.data.datasets.forEach((dataset) => {
        dataset.data.push(count);
        });
        this.chart.update();
 }
}