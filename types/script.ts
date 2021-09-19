const baseUrl: string = "https://gateway.marvel.com:443/v1/public/";
const apiKey: string = "21e9721ecd3caa5524429be6d8c1e57d";
const hash: string = "ec72458ece65a340f304d0411e0fe2a4";

const urlComics: string = `${baseUrl}comics?ts=1&apikey=${apiKey}&hash=${hash}&offset=${0}`;
const urlCharacters: string = `${baseUrl}characters?ts=1&apikey=${apiKey}&hash=${hash}`;

const params = new URLSearchParams(window.location.search);

const nextButton = document.getElementById("NextButton");
const backButton = document.getElementById("BackButton");
const comicList = document.getElementById("comicList");

const createTable = (comics) =>{
	comicList.innerHTML= ""
		document.body.appendChild(comicList)
		comics.forEach((item, i) => {
			console.log(item.title)
			const Items = document.createElement("li");
			const itemsText= document.createTextNode(item.title);
			Items.appendChild(itemsText);
			comicList.appendChild(Items);
		});

	}

	const nextPage = () =>{
		const page = Number(params.get("page")) || 1;
		
		params.set("page", JSON.stringify(page + 1));
		fetchComics(page);
		
		
		console.log(page)	
	}

	const backPage = () =>{
		const page = Number(params.get("page")) || 1;
		if(page > 1){	
		
		params.set("page", JSON.stringify(page - 1))
		}
		
		console.log(page)	
	}
	backButton.addEventListener('click', backPage)
	nextButton.addEventListener('click', nextPage)



	const fetchComics = (offset) =>{
	fetch(`${baseUrl}comics?ts=1&apikey=${apiKey}&hash=${hash}&offset=${offset}`)
	.then((response) => {
		// console.log(response.json)
		return response.json();
	})
	.then((rta) => {
		// console.log(rta);
		const comics = rta.data.results;
		createTable(comics)
        // console.log(comics)
		// const table = document.getElementById("movies");
		// const tbody = table.getElementsByTagName("tbody")[0];

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
}
fetchComics(0)

	// fetch(urlCharacters)
	// .then((response) => {
   // 	return response.json();
	// })
	// .then((rta) => {
	// 	console.log(rta);
	// 	const characters = rta.data.results;
    //     console.log(characters)

	// })