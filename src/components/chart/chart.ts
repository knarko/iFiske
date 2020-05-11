import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as Chart from 'chart.js';
import * as moment from 'moment';

export interface ChartOptions {
  accumulate?: boolean;
  type: string;
}

@Component({
  selector: 'app-chart',
  templateUrl: 'chart.html',
})
export class ChartComponent implements AfterViewInit, OnChanges {
  timeSettings: any;
  ctx: CanvasRenderingContext2D;
  chart: Chart;

  @ViewChild('canvas')
  canvas: ElementRef;

  @Input()
  data: any;
  @Input()
  options: ChartOptions = {
    type: 'line',
    accumulate: false,
  };

  constructor() {}

  private makeData() {
    if (!this.data) {
      return { labels: [], data: [] };
    }

    const data = Object.keys(this.data)
      .map((key) => {
        let [year, week]: any[] = key.split(':');
        year = Number(year);
        week = Number(week);
        return {
          year,
          week,
          data: this.data[key],
        };
      })
      .sort((a, b) => a.year - b.year || a.week - b.week)
      .map(({ year, week, data }) => {
        return {
          x: `${year}W${('' + week).padStart(2, '0')}`,
          y: data as number,
        };
      })
      .filter(({ x }) => moment(x).isValid());

    const labels = data.map((d) => d.x);

    console.log(data, labels);

    if (this.options.accumulate) {
      let acc = 0;
      data.forEach((d) => (d.y = acc = d.y + acc));
    }

    return { data, labels };
  }

  ngAfterViewInit() {
    this.ctx = (this.canvas.nativeElement as HTMLCanvasElement).getContext(
      '2d',
    );

    const { data, labels } = this.makeData();

    this.chart = new Chart(this.ctx, {
      type: this.options.type,
      data: {
        labels,
        datasets: [
          {
            backgroundColor: '#003852',
            borderWidth: 0,
            data,
            label: 'Sålda fiskekort',
            type: 'bar',
          },
          {
            backgroundColor: 'rgba(0, 56, 82, 0.2)',
            borderColor: '#003852',
            data,
            label: 'Sålda fiskekort',
            spanGaps: true,
            type: 'line',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },

        scales: {
          yAxes: [
            {
              type: 'linear',
              display: true,
              position: 'left',
              ticks: {
                min: 0,
              },
            },
          ],
          xAxes: [
            {
              type: 'time',
              time: {
                min: moment(data[0] && data[0].x)
                  .subtract(1, 'week')
                  .toISOString(),
                max: moment(data[data.length - 1] && data[data.length - 1].x)
                  .add(1, 'week')
                  .toISOString(),
                round: 'week',
                tooltipFormat: '[vecka] W',
              },
            },
          ],
        },
      },
    });
  }

  ngOnChanges(_changes: SimpleChanges) {
    const { data, labels } = this.makeData();

    if (!this.chart || !this.chart.data.datasets.length) {
      return;
    }

    this.chart.data.datasets.forEach((dataset) => {
      dataset.data = data;
      if (dataset.type !== this.options.type) {
        dataset.hidden = true;
      } else {
        dataset.hidden = false;
      }
    });

    const timeSettings = this.chart.config.options.scales.xAxes[0].time;
    timeSettings.min = moment(data[0] && data[0].x)
      .subtract(1, 'week')
      .toISOString();
    timeSettings.max = moment(data[data.length - 1] && data[data.length - 1].x)
      .add(1, 'week')
      .toISOString();

    this.chart.data.labels = labels;

    console.log(
      this.timeSettings,
      this.chart.config.options.scales.xAxes[0].time,
    );

    this.chart.update();
  }
}
