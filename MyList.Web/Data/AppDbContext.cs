using Microsoft.EntityFrameworkCore;
using MyList.Web.Models; // Upewnij się, że przestrzeń nazw jest poprawna

namespace MyListServer.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // DbSet dla każdej tabeli w bazie danych
        public DbSet<Movie> Movies { get; set; }
        public DbSet<TvSeries> TvSeries { get; set; }
        public DbSet<Book> Books { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Konfiguracja tabel
            modelBuilder.Entity<Movie>(entity =>
            {
                entity.Property(e => e.Title).HasMaxLength(255).IsRequired();
                entity.Property(e => e.Category).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Rating).IsRequired();
                entity.Property(e => e.Date).IsRequired();
            });

            modelBuilder.Entity<TvSeries>(entity =>
            {
                entity.Property(e => e.Title).HasMaxLength(255).IsRequired();
                entity.Property(e => e.Category).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Rating).IsRequired();
                entity.Property(e => e.Date).IsRequired();
            });

            modelBuilder.Entity<Book>(entity =>
            {
                entity.Property(e => e.Title).HasMaxLength(255).IsRequired();
                entity.Property(e => e.Category).HasMaxLength(100).IsRequired();
                entity.Property(e => e.Rating).IsRequired();
                entity.Property(e => e.Date).IsRequired();
            });
        }
    }
}
