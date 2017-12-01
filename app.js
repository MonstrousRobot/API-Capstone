const baseUrl = 'https://api.petfinder.com/shelter.find'

const spinner = '<img src="./pictures/spinner.gif" class="spinner">'

//When the user submits the location it will bring a list of available shelters in the area
$('form').submit(function(event){
	event.preventDefault()
	//fading out the landing page
	$('.results').html(spinner)

	// 
	const searchPet = $('#search-pet').val()
	const endPoint = `?format=json&key=5ccf65ce5510a22f460edeec72b873d2&location=${searchPet}&output=full&callback=?`
	// combining baseurl and endpoint to not have a long string
	$.getJSON(baseUrl + endPoint, function(data) {
		
		if (!data.petfinder.shelters) {
			const err = `<h1>Incorrect address entered</h1>
						 <p><center>Example Los Angeles, CA</center></p>`
			$('.results').html(err)
			return
		}

		//looping through api(baseurl)
		const shelters = data.petfinder.shelters.shelter
		const toAppend = shelters.map(shelter => {
			const name = shelter.name.$t
			const state = shelter.state.$t
			const city = shelter.city.$t
			const zip = shelter.zip.$t
			const id = shelter.id.$t
			//Displaying 
			return `<ul><li>
						<h1><a href="#" class="shelter" data-id=${id}>${name}</a></h1>
						<h2>Located in ${city}, ${state}, ${zip}</h2>
					</li></ul>`
		})
		$('.results').html(toAppend)
	});
});

$('.results').on('click', '.shelter', event => {
	event.preventDefault()
	// console.log('event.currentTarget', event.currentTarget)
	$('.results').html(spinner)
	
	const id = $(event.currentTarget).data('id')
	
	const baseUrl2 = 'https://api.petfinder.com/shelter.getPets'
	const endPoint2 = `?format=json&key=5ccf65ce5510a22f460edeec72b873d2&id=${id}&output=full&callback=?`

	$.getJSON(baseUrl2 + endPoint2, data => {

		if (!data.petfinder.pets) {
			$('.results').html(`<h1>No pets found at this shelter</h1>`)
			return
		}

		let pets = data.petfinder.pets.pet
		pets = Array.isArray(pets) ? pets : [pets]

		const toAppend2 = pets.map(pet => {
			const age = pet.age.$t
			const animal = pet.animal.$t

			const desc = pet.description.$t
			const description = desc ? desc : 'No description available'

			const name = pet.name.$t

			//Changes 'M' to Male and 'F' to Female
			const sex = pet.sex.$t === "M" ? "Male" : "Female"
			
			const breeds = pet.breeds.breed
			
			const finalBreed = Array.isArray(breeds) 
							   	? breeds.map(breed => breed.$t).join(' / ') 
								: breeds.$t
			
			let filteredImgs

			if (pet.media.photos) {
				filteredImgs = pet.media.photos.photo.filter(photo => {
					return photo['@size'] === 'x'
				}).map(photo => {
					return `<img src=${photo.$t} />`
				})

			} else {
				filteredImgs = "<img src='./pictures/pets.jpg' />"
			}

			
			return 		`<div class="inner">
							<h1>${name} is a ${animal} who is a ${age} ${sex}</h1>
							<p>${description}</p>
							<div class="polaroid">${filteredImgs}</div>
						</div>`
		}) 

		$('.results').html(toAppend2);

	})
})


//		RESEARCH THIS!
// click hanlder on links
	// use event delegation (research this!!)
	// use .data() from jQuery to get the id
	// make new API call to endpoint with id

