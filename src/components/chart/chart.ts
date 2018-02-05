import { Component, ViewChild, ElementRef, Input, AfterViewInit, OnChanges } from '@angular/core';
import * as Chart from 'chart.js';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-chart',
  templateUrl: 'chart.html',
})
export class ChartComponent implements AfterViewInit, OnChanges {
  ctx: CanvasRenderingContext2D;
  chart: Chart;

  @ViewChild('canvas') canvas: ElementRef;

  @Input() data: any;

  constructor() {
  }

  private makeData() {
    let padToTwo = number => number <= 9 ? ("0"+number).slice(-2) : number;

    if (!this.data) {
      return {labels: [], data: []};
    }

    const data = Object.keys(this.data).map(key => {
      let [year, week]: any[] = key.split(':');
      week = Number(week)
      return {
        year,
        week,
        data: this.data[key],
      };
    }).sort((a, b) => {
      return a.year - b.year || a.week - b.week;
    }).filter(({ week }) => {
      return week > 0 && week < 53;
    }).map(({ year, week, data }) => {
      return {
        x: `${year}W${padToTwo(week)}`,
        y: data as number,
      };
    });


    const labels = data.map(d => d.x);

    console.log(data, labels);
    return {data, labels};
  }

  ngAfterViewInit() {
    console.log(this.data);
    this.ctx = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');

    const {data, labels} = this.makeData();

    this.chart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Sålda fiskekort',
          data,
          backgroundColor: '#003852',
          borderWidth: 0,
        }, {
          label: 'Sålda fiskekort (linje)',
          data,
          type: 'line',
          borderColor: '#003852',
          backgroundColor: 'rgba(0, 56, 82, 0.1)',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // stacked: true,
        // lineAtYearChange: true,
        // fill: false,

        scales: {
          yAxes: [{
            type: 'linear',
            display: true,
            position: 'left',
          }],
          xAxes: [{
            type: 'time',
            // barPercentage: 1,
            // categoryPercentage: 1 / 12, // since we have 12 weeks, and want each bar to be one week wide
            time: {
              round: 'week',
              // unitStepSize: 12,
              tooltipFormat: '[vecka] W',
              //displayFormats: {
                // week: 'MMM YYYY',
                // month: 'MMM',
              //},
            },
          }],
        },
      },
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const {data, labels} = this.makeData();

    if (!this.chart || !this.chart.data.datasets.length) {
      return;
    }

    this.chart.data.datasets.forEach(dataset => dataset.data = data);

    this.chart.data.labels = labels;

    this.chart.update();
  }

}
