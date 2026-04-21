using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace LibraryFIFA
{
    public class Game
    {
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int GameId { get; set; }
        public int Year { get; set; }

        public string? Gender { get; set; }

        public string? City { get; set; }

        public string? Country { get; set; }

        public string? Continent { get; set; }

        public string? Winner { get; set; }
    }
}