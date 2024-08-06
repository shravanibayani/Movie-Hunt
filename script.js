const api_key = "e426a249";

let search = document.querySelector("#search");
const main = document.querySelector("#main");

document.getElementById('movie').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('search').click();
    }
});
const create_ip = (movie) => {
    const ip = document.createElement("div");
    ip.className = "ip";
    main.appendChild(ip);
    ip.innerText = `${movie}`
    ip.scrollIntoView({ behavior: "smooth" });
    document.querySelector("#movie").value = "";
}

const create_op = () => {
    const op = document.createElement("div");
    op.className = "op flex ";
    main.appendChild(op);
    op.scrollIntoView({ behavior: "smooth" });
    return op;
}

const op_inner_html = (op_container, Poster, Title, Released, Runtime, Genre, Plot, Language, Country,Director,Actors,imdbID) => {
    op_container.innerHTML = `<img src = ${Poster} class="img_div">
                        <p><span class="bold">Title:</span> ${Title}</p>
                        <p><span class="bold">Release Date:</span> ${Released}</p>
                        <p><span class="bold">Time:</span> ${Runtime}</p>
                        <p><span class="bold">Genre:</span> ${Genre}</p>
                        <p><span class="bold">Director:</span> ${Director}</p>
                        <p><span class="bold">Actors:</span> ${Actors}</p>
                        <p><span class="bold">Plot:</span> ${Plot}</p>
                        <p><span class="bold">Language:</span> ${Language}</p>
                        <p><span class="bold">Country:</span> ${Country}</p>
                        <a href="https://www.imdb.com/title/${imdbID}/?ref_=fn_al_tt_1" target="_blank" class="link">More Info</a>`
                        op_container.scrollIntoView({ behavior: "smooth" });
}



search.addEventListener("click", async (event) => {
    event.preventDefault();
    const movie = document.querySelector("#movie").value;
    if(movie == ""){
        return;
    }
    try {
        console.log(`Movie: ${movie}`);
        create_ip(movie);
        const url_s = `https://www.omdbapi.com/?apikey=${api_key}&s=${movie}`;
        const response_s = await fetch(url_s);
        const data_s = await response_s.json();
        console.log(data_s);
        const { Response, Search, totalResults } = data_s;
        if (Response == "False") {
            throw new Error("No data found");
        }
        if (parseInt(totalResults, 10) == 1) {
            const url_t = `https://www.omdbapi.com/?apikey=${api_key}&t=${movie}`;
            const response_t = await fetch(url_t);
            const data_t = await response_t.json();
            console.log(data_t);
            const { Poster, Title, Released, Runtime, Genre, Plot, Language, Country,Director,Actors,imdbID} = data_t;
            setTimeout(() => {
                const op_container = create_op();
                op_container.classList.add("flex-col", "fit_content");
                op_inner_html(op_container, Poster, Title, Released, Runtime, Genre, Plot, Language, Country,Director,Actors,imdbID);
            }, 300);
        }
        else if (parseInt(totalResults, 10) > 1) {
            setTimeout(() => {
                const op_container = create_op(movie);
                op_container.classList.add("gap-3","flex-wrap","fit_content");
                Search.forEach(element => {
                    const item = document.createElement("div");
                    item.className = "multiple_mov";
                    if (element.Poster == "N/A") {
                        item.innerHTML = `<p class="flex-1 border p-2 half_height"><span class="bold">Title:</span> ${element.Title}</p>
                        <p class="year">Year: ${element.Year}</p>`
                    }
                    else {
                        item.innerHTML = `<img src = ${element.Poster} class="flex-1">
                        <p class="year">Year: ${element.Year}</p>`
                    }
                    item.addEventListener("click", async (event) => {
                        event.preventDefault();
                        console.log(`Movie: ${element.Title}`);
                        create_ip(element.Title);
                        const url_i = `https://www.omdbapi.com/?apikey=${api_key}&i=${element.imdbID}`;
                        const response_i = await fetch(url_i);
                        const data_i = await response_i.json();
                        console.log(data_i);
                        const { Poster, Title, Released, Runtime, Genre, Plot, Language, Country,Director,Actors,imdbID } = data_i;
                        setTimeout(() => {
                            const op_container = create_op();
                            op_container.classList.add("flex-col", "fit_content");
                            op_inner_html(op_container, Poster, Title, Released, Runtime, Genre, Plot, Language, Country,Director,Actors,imdbID);
                        }, 300);
                    })
                    op_container.appendChild(item);
                });
                const para = create_op();
                para.innerText = "Pick up yours";
                para.scrollIntoView({ behavior: "smooth" });
            }, 300);
        }
    }
    catch (error) {
        console.error(error);
        const op_container = create_op();
        op_container.innerText = error;
        op_container.scrollIntoView({ behavior: "smooth" });
    }

});