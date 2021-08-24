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
            ForecastItem queryForecast = _context.ForecastItems.Where(n => n.Date.Date == DateTime.Now.Date && n.Name.ToLower() == forecastCity.ToLower()).FirstOrDefault<ForecastItem>();
            //System.Diagnostics.Debug.WriteLine("query forecast below");
            //System.Diagnostics.Debug.WriteLine(queryForecast);

            var response = await _weatherService.AddCityAsync(forecastCity);
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
            if (queryForecast == null)
            {
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
                try
                {
                    queryForecast.Date = returnedForecast.Date;
                    queryForecast.TemperatureC = returnedForecast.TemperatureC;
                    queryForecast.Summary = returnedForecast.Summary;
                    queryForecast.Wind = returnedForecast.Wind;
                    _context.Update(queryForecast);
                    _context.SaveChanges();
                    returnedForecast = queryForecast;
                }
                catch (Exception e)
                {
                    System.Diagnostics.Debug.WriteLine(e);
                }
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

        [HttpGet]
        [Route("[controller]/{date}")]
        public ForecastItem[] GetAsync(DateTime date)
        {
            System.Diagnostics.Debug.WriteLine("date is here");
            System.Diagnostics.Debug.WriteLine(date);
            //var fore = _context.ForecastItems.Where(n => n.Date.Date == DateTime.Now.AddDays(-8).Date && n.Name == theLocale).FirstOrDefault<ForecastItem>();
            var curTemperatureData = _context.ForecastItems.Where(n => n.Date.Date == date.Date).Select(index => new ForecastItem
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


        [HttpGet]
        [Route("[controller]/dates")]
        public DateTime[] GetAsyncDates()
        {
            System.Diagnostics.Debug.WriteLine("dates r us");

            // .tolist() will do lazy loading. This could result in performance issues or overflowed memory if db large
            //var allDistinctDates = _context.ForecastItems.ToList().Select(n => n.Date.Date).Distinct();

            // LINQ to query
            var allDistinctDates = (from t in _context.ForecastItems
                                   select t.Date.Date).Distinct();

            System.Diagnostics.Debug.WriteLine(allDistinctDates);
            System.Diagnostics.Debug.WriteLine(allDistinctDates.ToArray());
            System.Diagnostics.Debug.WriteLine(allDistinctDates.ToArray()[0]);
            foreach (DateTime element in allDistinctDates.ToArray())
            {
                System.Diagnostics.Debug.WriteLine(element);
            }


            return allDistinctDates.ToArray();




        }
    }
}
