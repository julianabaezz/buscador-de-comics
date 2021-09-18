const baseUrl: string = "https://gateway.marvel.com:443/v1/public/";
const apiKey: string = "21e9721ecd3caa5524429be6d8c1e57d";
const hash: string = "ec72458ece65a340f304d0411e0fe2a4"

const urlComics: string = `${baseUrl}comics?ts=1&apikey=${apiKey}&hash=${hash}`;
const urlCharacters: string = `${baseUrl}characters?ts=1&apikey=${apiKey}&hash=${hash}`;



fetch(urlComics)
	.then((response) => {
        // console.log(response.json)
		return response.json();
	})
	.then((rta) => {
		console.log(rta);
		const comics = rta.data.results;
        console.log(comics)
		// const table = document.getElementById("movies");
		// const tbody = table.getElementsByTagName("tbody")[0];
		comics.forEach((item, i) => {
		// 	const tr = document.createElement("tr");
		// 	const td = document.createElement("td");
		// 	const td2 = document.createElement("td");
		// 	const img = document.createElement("img");
		// 	const a = document.createElement("a");
		// 	a.href = `https://image.tmdb.org/t/p/w370_and_h556_bestv2/${item.poster_path}`;
		// 	img.src = `https://image.tmdb.org/t/p/w370_and_h556_bestv2/${item.poster_path}`;
		// 	img.alt = "Imagen de portada";
		// 	img.height = 200;
		// 	const text = document.createTextNode(item.title);
		// 	a.appendChild(img);
		// 	tr.appendChild(td2);
		// 	tr.appendChild(td);
		// 	td.appendChild(text);
		// 	td2.appendChild(a);
		// 	tbody.appendChild(tr);
		});
	})