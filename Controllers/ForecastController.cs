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

namespace my_new_app.Controllers
{
    [ApiController]
    public class ForecastController : Controller
    {
        private const string _API_KEY = "c774bb5e66aa9c7265f60d3d93219462";


        private readonly ForecastContext _context;


        public ForecastController(ForecastContext context)
        {
            _context = context;
        }


        [HttpGet]
        [Route("[controller]/{forecastCity}")]
        public async Task<ForecastItem[]> GetWeather(String forecastCity)
        {
            /*
                var query = from fi in _context.ForecastItems
                        where fi.Name == "Vancouver"
                        select fi;
            */

            var queryForecast = _context.ForecastItems.Where(n => n.Date.Date == DateTime.Now.Date && n.Name.ToLower() == forecastCity.ToLower()).FirstOrDefault<ForecastItem>();
            System.Diagnostics.Debug.WriteLine("query forecast below");
            System.Diagnostics.Debug.WriteLine(queryForecast);

            HttpClient client = new HttpClient();
            HttpResponseMessage response = await client.GetAsync($"https://api.openweathermap.org/data/2.5/weather?q={forecastCity}&units=metric&appid={_API_KEY}");
            var content = await response.Content.ReadAsStringAsync();

            System.Diagnostics.Debug.WriteLine(content);
            dynamic contentJson = JsonConvert.DeserializeObject(content);
            var newForecast = new ForecastItem
            {
                Date = DateTime.Now,
                TemperatureC = contentJson.main.temp_max,
                Summary = contentJson.weather[0].description,
                Name = contentJson.name,
                Wind = contentJson.wind.speed,
                Long = contentJson.coord.lon,
                Lat = contentJson.coord.lat
            };

            if (queryForecast == null)
            {
                try
                {
                    _context.Add(newForecast);
                    _context.SaveChanges();
                } catch (Exception e) {
                    System.Diagnostics.Debug.WriteLine(e);
                }
            } else {
                newForecast = null;
            }

            ForecastItem[] forecastItemNew = new[] { newForecast };


            return forecastItemNew;
            /*
            return Enumerable.Range(1, 1).Select(index => new ForecastItem
            {
                Date = DateTime.Now,
                TemperatureC = contentJson.main.temp_max,
                Summary = contentJson.weather[0].description,
                Name = contentJson.name,
                Wind = contentJson.wind.speed,
                Long = contentJson.coord.lon,
                Lat = contentJson.coord.lat
            })
            .ToArray();
            */


        }

        [HttpGet]
        [Route("[controller]")]
        public ForecastItem[] GetAsync()
        {
            //var fore = _context.ForecastItems.Where(n => n.Date.Date == DateTime.Now.AddDays(-8).Date && n.Name == theLocale).FirstOrDefault<ForecastItem>();
            var fore = _context.ForecastItems.Where(n => n.Date.Date == DateTime.Now.Date).Select(index => new ForecastItem
            {
                Date = index.Date,
                TemperatureC = index.TemperatureC,
                Summary = index.Summary,
                Name = index.Name,
                Wind = index.Wind,
                Long = index.Long,
                Lat = index.Lat
            });
            System.Diagnostics.Debug.WriteLine(DateTime.Now.Date);
            System.Diagnostics.Debug.WriteLine(fore);

            return fore.ToArray();




        }
    }
}
