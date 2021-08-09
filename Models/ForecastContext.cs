using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;


namespace my_new_app.Models
{
    public class ForecastContext : DbContext
    {
        public ForecastContext(DbContextOptions<ForecastContext> options) : base(options)
        {
        }
        public DbSet<ForecastItem> ForecastItems { get; set; }
    }

} 

