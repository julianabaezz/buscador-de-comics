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
const search = <HTMLInputElement>document.getElementById("search");	
const type = <HTMLInputElement>document.getElementById("type")
const orderBy = <HTMLInputElement>document.getElementById("orderBy")
const filterBtn = document.getElementById("filterBtn")

let limit = 20
let total = 0
let offset = page * limit

const comicsOrderBy = [
	"A-Z",
	"Z-A",
	"Más nuevo",
	"Más viejo"
]

const charactersOrderBy = [
	"A-Z",
	"Z-A",
]

const consultInfoParams = () => {
	const typeOrder = params.get("type")
	const order = params.get("orderBy")
	const title = params.get("titleStartsWith")
	if(typeOrder !== ""){
		type.value = typeOrder;	
	}
	if(order !== ""){
		orderBy.value = order
	}
	if(title !== ""){
		search.value = title
	}
}

consultInfoParams()

const createOptions = (type) => {
	orderBy.innerHTML = ""
	if(type === "comics"){
		comicsOrderBy.forEach(element => {
			const comicOption = document.createElement("option")
			const optionText = document.createTextNode(element)
			comicOption.appendChild(optionText);
			orderBy.appendChild(comicOption)
			
		})		
	}else{
		charactersOrderBy.forEach(element => {
			const characterOption = document.createElement("option")
			const optionText = document.createTextNode(element)
			characterOption.appendChild(optionText);
			orderBy.appendChild(characterOption)
			
		})
	}
}



createOptions(type.value)



const createTable = (comics) => {
	comicList.innerHTML = ""
	document.body.appendChild(comicList)
	comics.forEach((item, i) => {
		const Items = document.createElement("li")
		const itemsText = document.createTextNode(item.title)
		const itemsImg = document.createElement("img")
		const itemsDiv = document.createElement("div")
		itemsImg.src = `${item.thumbnail.path}.${item.thumbnail.extension}`
		itemsDiv.appendChild(itemsText)
		itemsDiv.appendChild(itemsImg)
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

const defaultOrder = (queryType, queryOrder) => {
	let orderValue;
	switch(queryType){
		case "comics":
			if (queryOrder === "Z-A") {
				orderValue = "-title"
			}else if(queryOrder === "Más nuevo"){
				orderValue = "-modified"
			}else if(queryOrder === "Más viejo"){
				orderValue = "modified"
			}else{
				orderValue = "title"
			}
			break;
		case "characters":
			if (queryOrder === "Z-A") {
				orderValue = "-name"
			}else{
				orderValue = "name"
			}
			break;
	}
	return orderValue
	
}

const fetchData = () => {
	const queryParams = new URLSearchParams(window.location.search)
	const selectType = queryParams.get("type") ? queryParams.get("type") : "comics"
	const order = queryParams.get("orderBy") ? queryParams.get("orderBy") : selectType === "comics" ? "title" : "name"
	queryParams.delete("type")
	queryParams.delete("page")

	const calcOffset = offset - limit === -limit ? 0 : offset - limit
	return fetch(`${baseUrl}${selectType}?ts=1&apikey=${apiKey}&hash=${hash}&offset=${calcOffset}&${queryParams.toString()}&orderBy=${order}`)
		.then((response) => {
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
	if (!page || page === 1) {
		backButton.setAttribute("disabled", "true")
		firstPageBtn.setAttribute("disabled", "true")
	}
	if (page == Math.round(total / limit)) {
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
	for (const key of Object.keys(paramsObj)) {
		if (paramsObj[key] !== "") {
			if(key === "orderBy"){
				searchParams.set(key, defaultOrder(paramsObj.type, paramsObj.orderBy))
			}else if(key === "title"){
				searchParams.set("titleStartsWith", paramsObj.title)
			}else{
				searchParams.set(key, paramsObj[key])
			}
		}else{
			delete paramsObj[key];
		}
	}
	return searchParams.toString()
	

}

init()

backButton.addEventListener('click', backPage)
nextButton.addEventListener('click', nextPage)
firstPageBtn.addEventListener('click', firstPage)
lastPageBtn.addEventListener('click', lastPage)
filterBtn.addEventListener('click', filter)
type.addEventListener('change', (e) => {
	createOptions(e.target.value)
})

	// fetch(urlCharacters)
	// .then((response) => {
   // 	return response.json()
	// })
	// .then((rta) => {
	// 	console.log(rta)
	// 	const characters = rta.data.results
    //     console.log(characters)

	// })