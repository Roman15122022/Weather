import {Component, OnInit} from '@angular/core';
import {WeatherService} from "../services/weather.service";
import {interval, startWith} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {WeatherWidget} from "../interfaces/weatherwidget";
import {Factorysrc} from "./factorysrc";
import {Icon} from "./enum.icon";


@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.css']
})
export class WidgetComponent implements OnInit {
  weatherWidgets: WeatherWidget[] = [
    {city: '', weatherData: null, cityTemp: 0, cityMaxTemp: 0, cityMinTemp: 0, IconSrc: Icon.DEFAULT},
    {city: '', weatherData: null, cityTemp: 0, cityMaxTemp: 0, cityMinTemp: 0, IconSrc: Icon.DEFAULT},
    {city: '', weatherData: null, cityTemp: 0, cityMaxTemp: 0, cityMinTemp: 0, IconSrc: Icon.DEFAULT},
  ];
  formStates: { [key: string]: boolean } = {};

  constructor(private weatherService: WeatherService, private factorySrc: Factorysrc) {
  }

  ngOnInit() {
    interval(3000).subscribe(() => {
      this.getIcon();
    });
  }

  getIcon() {
    this.weatherWidgets.forEach((widget, index) => {
      if (widget.weatherData) {
        widget.IconSrc = this.factorySrc.settingIconBasedOnTimeAndWeather(widget.weatherData);
      }
    });
  }

  getWeather(index: number) {
    const widget = this.weatherWidgets[index];
    interval(3000)
      .pipe(
        startWith(0),
        switchMap(() => this.weatherService.getWeather(widget.city))
      )
      .subscribe(data => {
        widget.weatherData = data;
        widget.cityTemp = Math.round(data.main.temp);
        widget.cityMinTemp = Math.round(data.main.temp_min);
        widget.cityMaxTemp = Math.round(data.main.temp_max);

        console.log(data);
      });
    this.formStates[widget.city] = true;
  }


}

