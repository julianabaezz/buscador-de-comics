const baseUrl: string = "https://gateway.marvel.com:443/v1/public/"

const apiKey: string = "21e9721ecd3caa5524429be6d8c1e57d"
const hash: string = "ec72458ece65a340f304d0411e0fe2a4"


const urlComics: string = `${baseUrl}comics?ts=1&apikey=${apiKey}&hash=${hash}&offset=${0}`
const urlCharacters: string = `${baseUrl}characters?ts=1&apikey=${apiKey}&hash=${hash}`

const params: URLSearchParams = new URLSearchParams(window.location.search)
const page = Number(params.get("page"))

const nextButton = document.getElementById("NextButton")
const backButton = document.getElementById("BackButton")
const comicList = document.getElementById("comicList")
const linkButton = document.getElementById("link")
const firstPageBtn = document.getElementById("firstPageBtn")
const lastPageBtn = document.getElementById("lastPageBtn")
const search = <HTMLInputElement> document.getElementById("search");
const type = <HTMLInputElement> document.getElementById("type")
const orderBy = <HTMLInputElement> document.getElementById("orderBy")
const filterBtn = document.getElementById("filterBtn")

let limit = 20
let total = 0
let offset = page * limit

const createTable = (comics) => {
	comicList.innerHTML = ""
	document.body.appendChild(comicList)
	comics.forEach((item, i) => {
		const Items = document.createElement("li")
		const itemsText = document.createTextNode(item.title)
		const itemsImg = document.createElement("img")
		const itemsA = document.createElement("a")
		const itemsDiv = document.createElement("div")
		itemsImg.src = `${item.thumbnail.path}.${item.thumbnail.extension}`
		let urlComics = item.urls[0].url
		itemsA.href = urlComics
		itemsDiv.appendChild(itemsText)
		itemsA.appendChild(itemsImg)
		itemsDiv.appendChild(itemsA)
		Items.appendChild(itemsDiv)
		comicList.appendChild(Items)
	})

}

const nextPage = () => {
	if (!page) {
		params.set("page", JSON.stringify(2))
	} else {
		if (page < Math.round(total / limit)) {
			params.set("page", JSON.stringify(page + 1))
		}
	}
	window.location.href = "index.html?" + params

}

const backPage = () => {
	if (page) {
		params.set("page", JSON.stringify(page - 1))
		window.location.href = "index.html?" + params
	}
}

const firstPage = () => {
	params.set("page", JSON.stringify(1))
	window.location.href = "/index.html?" + params
}

const lastPage = () => {
	params.set("page", JSON.stringify(Math.round(total / limit)))
	window.location.href = "/index.html?" + params
}
const defaultOrder= (queryType, queryOrder) =>{
	// Hacer un switch con todos los casos de orderBy , y por defecto tenga el valor de A-Z
	if(queryOrder = "A-Z"){
		if(queryType==="comics"){
			return "title"
		}
		else{
			return"name"
		}
	}	
}



const fetchData = () => {
	const queryParams = new URLSearchParams(window.location.search)
	const selectType = queryParams.get("type") ? queryParams.get("type") : "comics"
	queryParams.delete("type")	
	queryParams.delete("page")
	
	
	console.log(selectType)
	
	const calcOffset = offset - limit === -limit ? 0 : offset - limit
	return fetch(`${baseUrl}${selectType}?ts=1&apikey=${apiKey}&hash=${hash}&offset=${calcOffset}&${queryParams.toString()}`)
		.then((response) => {
			// console.log(response.json)
			return response.json()
		})
		.then((rta) => {
			const comics = rta.data.results
			limit = rta.data.limit
			total = rta.data.total
			createTable(comics)
		})
}

const init = async () => {
	await fetchData()
	disableBtns()
}

const disableBtns = () => {
	if(!page || page === 1){
		backButton.setAttribute("disabled", "true")
		firstPageBtn.setAttribute("disabled", "true")
	}
	if(page == Math.round(total / limit)){
		nextButton.setAttribute("disabled", "true")
		lastPageBtn.setAttribute("disabled", "true")
	}
}

const filter = () => {
	// 1.Obtener datos de los inputs
	
	const paramsObj = {
		title: search.value,
		type: type.value,
		orderBy: orderBy.value,		
	}
	
	  
	for (const key of Object.keys(paramsObj)) {
		if (paramsObj[key] === "") {
			delete paramsObj[key];
		}
	}
	debugger
	console.log(paramsObj);
	// 2.Cambiar la url 
	
	// ¿¿??
	
	// 3. Generar url de la API
	offset = 0;
	const urlApi = generateUrl(paramsObj);
	window.location.href = "/index.html?" + urlApi;
	
	
	// 4. Hacer fetch
	// 5. Renderizar
	
}

const generateUrl = (paramsObj) => {
	// Verificar que los parametro sean validos
	const searchParams: URLSearchParams = new URLSearchParams()
	searchParams.set("titleStartsWith", paramsObj.title)
	searchParams.set("type", paramsObj.type)
	searchParams.set("orderBy", defaultOrder(paramsObj.type, paramsObj.orderBy))
	
	const prueba = searchParams.get("orderBy")
	console.log(prueba);
	return searchParams.toString()
	// return `${baseUrl}comics?ts=1&apikey=${apiKey}&hash=${hash}&orderBy=title&${searchParams.toString()}&offset=${offset}`


}

init()

backButton.addEventListener('click', backPage)
nextButton.addEventListener('click', nextPage)
firstPageBtn.addEventListener('click', firstPage)
lastPageBtn.addEventListener('click', lastPage)
filterBtn.addEventListener('click', filter)

	// fetch(urlCharacters)
	// .then((response) => {
   // 	return response.json()
	// })
	// .then((rta) => {
	// 	console.log(rta)
	// 	const characters = rta.data.results
    //     console.log(characters)

	// })