import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';
import { Chart, pattern } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  socket = io.connect('127.0.0.1:8000');
  //  socket = io.connect('192.168.50.4:8000');
  memChart = undefined;
  cpuChart = undefined;
  cpuType = '';
  noOfCpu = '';

  ngOnInit() {
    const ctx = document.getElementById('mChart');
    const doughnutGraphData = {
      datasets: [{
        data: [1, 0],
        backgroundColor: ['#36a2eb', '#ff6384'],
      }],
      labels: [
        'Free',
        'Used',
      ]
    };
    this.memChart = new Chart(ctx, {
      type: 'doughnut',
      data: doughnutGraphData,
      options: {}
    });

    const ctx2 = document.getElementById('cChart');
    const cpuLoadGraphData = {
      datasets: [{
        label: '15 min average',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.4)',
      }],
      labels: ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],

    };
    this.cpuChart = new Chart(ctx2, {
      type: 'line',
      data: cpuLoadGraphData,
      options: {}
    });




    this.socket.on('os-update', (event) => this.updateCharts(event));
    this.socket.on('connected', (connectData) => this.connected(connectData));
  }

  updateCharts(event) {
    // console.log(event.loadavg);
    this.memChart.data.labels.pop();
    this.memChart.data.labels.pop();
    this.memChart.data.labels.push(`Free:${this.formatBytes(event.freemem, 2)}`);
    this.memChart.data.labels.push(`Used:${this.formatBytes(event.totalmem - event.freemem, 2)}`);

    this.memChart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
      dataset.data.pop();
      dataset.data.push(event.freemem);
      dataset.data.push(event.totalmem - event.freemem);
    });
    this.memChart.update(0);

    this.cpuChart.data.datasets.forEach((dataset) => {
      if ( dataset.data.length > 9) {
        dataset.data.shift();
      }
      dataset.data.push(event.loadavg[2]);
    });
    this.cpuChart.update(0);
  }

  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1000,
      dm = decimals || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  connected(connectData) {
    this.cpuType = connectData.types;
    this.noOfCpu = connectData.cpus;
  }
}
