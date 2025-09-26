const fileInput = document.getElementById("moviefile");
const yearFilter = document.getElementById("movie-year");
const directorFilter = document.getElementById("movie-director");
const orderFilter = document.getElementById("movie-order");
const searchInput = document.getElementById("movie-search");
const movieContainer = document.getElementById("movie-posters");

let allMovies = [];

class Pixar {
    constructor(title, director, releaseDate, imdbRating, posterUrl) {
        this.title = title;
        this.director = director;
        this.releaseDate = releaseDate;
        this.imdbRating = imdbRating;
        this.posterUrl = posterUrl;
    }
}

/* 
fileInput.addEventListener("change", function (e) {
    const fileReader = new FileReader();
    fileReader.onload = function () {
        const jsonData = JSON.parse(fileReader.result);
        const movies = [];
        const yearSet = new Set();
        const directorSet = new Set();

        for (let i = 0; i < jsonData.movies.length; i++) {
            const movie = jsonData.movies[i];
            movies.push(new Pixar(movie.title, movie.director, movie.releaseDate, movie.imdbRating, movie.posterUrl));
            const year = new Date(movie.releaseDate).getFullYear();
            yearSet.add(year);
            directorSet.add(movie.director);
        }

        allMovies = movies;
        displayMovies(movies);
        yearSelectBox(Array.from(yearSet).sort((a, b) => a - b));
        directorSelectBox(Array.from(directorSet).sort());
    };

    fileReader.readAsText(e.target.files[0]);
});
*/

document.addEventListener("DOMContentLoaded", () => {
    fetch("pixar.json")
        .then(response => {
            if (!response.ok) throw new Error("Failed to load JSON file");
            return response.json();
        })
        .then(jsonData => {
            const movies = [];
            const yearSet = new Set();
            const directorSet = new Set();

            for (let i = 0; i < jsonData.movies.length; i++) {
                const movie = jsonData.movies[i];
                movies.push(new Pixar(movie.title, movie.director, movie.releaseDate, movie.imdbRating, movie.posterUrl));
                const year = new Date(movie.releaseDate).getFullYear();
                yearSet.add(year);
                directorSet.add(movie.director);
            }

            allMovies = movies;
            displayMovies(movies);
            yearSelectBox(Array.from(yearSet).sort((a, b) => a - b));
            directorSelectBox(Array.from(directorSet).sort());
        })
        .catch(error => {
            console.error("Error loading JSON:", error);
            movieContainer.innerHTML = `<p style="color:red;">❌ Failed to load pixar.json</p>`;
        });
});


function displayMovies(movies) {
    movieContainer.innerHTML = "";

    if (movies.length === 0) {
        const noMatch = document.createElement("p");
        noMatch.className = "no-match";
        noMatch.textContent = "No movies found!";
        movieContainer.appendChild(noMatch);
        return;
    }

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = "movie";

        const img = document.createElement("img");
        img.src = `images/${movie.posterUrl}`;
        img.alt = movie.title;

        const year = new Date(movie.releaseDate).getFullYear();

        const info = document.createElement("div");
        info.className = "movie-info";

        const title = document.createElement("h3");
        title.className = "movie-title";
        title.textContent = movie.title;

        const director = document.createElement("p");
        director.className = "movie-director";
        director.textContent = movie.director;

        const yearRating = document.createElement("p");
        yearRating.className = "movie-year-rating";
        yearRating.textContent = `${year} | IMDB ${movie.imdbRating}`;

        info.appendChild(title);
        info.appendChild(director);
        info.appendChild(yearRating);
        card.appendChild(img);
        card.appendChild(info);
        movieContainer.appendChild(card);
    });
}


// Filters
yearFilter.addEventListener("change", combinedFilter);
directorFilter.addEventListener("change", combinedFilter);
orderFilter.addEventListener("change", combinedFilter);

// Search
searchInput.addEventListener("input", combinedFilter);

//reset
function resetSearch() {
    yearFilter.value = "All Years";
    directorFilter.value = "All Directors";
    orderFilter.value = "Ascending";

    combinedFilter();
}

function resetFilter() {
    searchInput.value = "";
    combinedFilter();
}


//combined filter
function combinedFilter() {
    let copyMovies = [...allMovies];

    //year filter
    const selectedYear = yearFilter.value;
    if (selectedYear != "All Years") {
        copyMovies = copyMovies.filter(yearFilter => {
            const movieYear = new Date(yearFilter.releaseDate).getFullYear();
            return movieYear == selectedYear;
        });
    }

    //director filter
    const selectedDirector = directorFilter.value;
    if (selectedDirector != "All Directors") {
        copyMovies = copyMovies.filter(filterDirector => filterDirector.director == selectedDirector);
    }

    //order filter
    const orderMethod = orderFilter.value;
    if (orderMethod != "") {
        copyMovies.sort((a, b) =>
            orderMethod == "Ascending"
                ? new Date(a.releaseDate) - new Date(b.releaseDate)
                : new Date(b.releaseDate) - new Date(a.releaseDate)
        );
    }

    //search filter
    const keyword = searchInput.value.toLowerCase();
    if (keyword != "") {
        copyMovies = copyMovies.filter(filterSearch => filterSearch.title.toLowerCase().includes(keyword));
    }

    displayMovies(copyMovies);
}

function yearSelectBox(years) {
    yearFilter.innerHTML = "<option>All Years</option>";

    years.forEach(year => {
        const yearOption = document.createElement('option');
        yearOption.value = year;
        yearOption.textContent = year;
        yearFilter.appendChild(yearOption);
    });
}

function directorSelectBox(directors) {
    directorFilter.innerHTML = "<option>All Directors</option>";

    directors.forEach(director => {
        const directorOption = document.createElement('option');
        directorOption.value = director;
        directorOption.textContent = director;
        directorFilter.appendChild(directorOption);
    });
}
