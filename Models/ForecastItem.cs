using System;

namespace my_new_app
{
    public class ForecastItem
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }

        public int TemperatureC { get; set; }

        public string Summary { get; set; }

        public string Name { get; set; }

        public string Wind { get; set; }

        public string Long { get; set; }

        public string Lat { get; set; }

    }
}
