using my_new_app.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace my_new_app.Services
{
    public class WeatherService
    {
        private const string _API_KEY = "c774bb5e66aa9c7265f60d3d93219462";
        private readonly HttpClient _client;
        private readonly ForecastContext _context;
        public WeatherService(ForecastContext context, HttpClient client)
        {
            _context = context;
            _client = client;
        }

        public async Task<dynamic> AddCityAsync(String city)
        {
            HttpResponseMessage response = await _client.GetAsync($"https://api.openweathermap.org/data/2.5/weather?q={city}&units=metric&appid={_API_KEY}");
            var content = await response.Content.ReadAsStringAsync();

            System.Diagnostics.Debug.WriteLine(content);
            dynamic contentJson = JsonConvert.DeserializeObject(content);

            return contentJson;
        }


    }
}
