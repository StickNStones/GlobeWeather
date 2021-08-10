using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Extensions.Configuration;
using my_new_app.Models;
using Npgsql;
using my_new_app.Services;

namespace my_new_app.Controllers
{
    [ApiController]
    public class ForecastsController : Controller
    {
        private readonly ForecastContext _context;
        private readonly WeatherService _weatherService;

        public ForecastsController(ForecastContext context, WeatherService weatherService)
        {
            _context = context;
            _weatherService = weatherService;
        }


        [HttpPut]
        [Route("[controller]/{forecastCity}")]
        public async Task<ForecastItem[]> GetWeather(String forecastCity)
        {
            /*
                var query = from fi in _context.ForecastItems
                        where fi.Name == "Vancouver"
                        select fi;
            */
            ForecastItem returnedForecast;
            var queryForecast = _context.ForecastItems.Where(n => n.Date.Date == DateTime.Now.Date && n.Name.ToLower() == forecastCity.ToLower()).FirstOrDefault<ForecastItem>();
            //System.Diagnostics.Debug.WriteLine("query forecast below");
            //System.Diagnostics.Debug.WriteLine(queryForecast);

            if (queryForecast == null)
            {
                dynamic response = await _weatherService.AddCityAsync(forecastCity);
                returnedForecast = new ForecastItem
                {
                    Date = DateTime.Now,
                    TemperatureC = response.main.temp_max,
                    Summary = response.weather[0].description,
                    Name = response.name,
                    Wind = response.wind.speed,
                    Long = response.coord.lon,
                    Lat = response.coord.lat
                };

                try
                {
                    _context.Add(returnedForecast);
                    _context.SaveChanges();
                }
                catch (Exception e)
                {
                    System.Diagnostics.Debug.WriteLine(e);
                }
            }
            else
            {
                returnedForecast = null;
            }

            return new[] { returnedForecast };

        }

        [HttpGet]
        [Route("[controller]")]
        public ForecastItem[] GetAsync()
        {
            //var fore = _context.ForecastItems.Where(n => n.Date.Date == DateTime.Now.AddDays(-8).Date && n.Name == theLocale).FirstOrDefault<ForecastItem>();
            var curTemperatureData = _context.ForecastItems.Where(n => n.Date.Date == DateTime.Now.Date).Select(index => new ForecastItem
            {
                Date = index.Date,
                TemperatureC = index.TemperatureC,
                Summary = index.Summary,
                Name = index.Name,
                Wind = index.Wind,
                Long = index.Long,
                Lat = index.Lat
            });


            return curTemperatureData.ToArray();




        }
    }
}
