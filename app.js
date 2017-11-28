const baseUrl = 'http://api.petfinder.com/shelter.find'
//const endPoint2 = `?format=json&key=5ccf65ce5510a22f460edeec72b873d2&id=CA2477&output=full&callback=?`

//When the user submits the location it will bring a list of available shelters in the area
$('form').submit(function(event){
	event.preventDefault()
	//user input
	const searchPet = $('#search-pet').val()
	const endPoint = `?format=json&key=5ccf65ce5510a22f460edeec72b873d2&location=${searchPet}&output=full&callback=?`
	//combining baseurl and endpoint to not have a long string
	$.getJSON(baseUrl + endPoint, function(data) {
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

$('.results').on('click', '.shelter', function(event){
	event.preventDefault()
	// console.log('event.currentTarget', event.currentTarget)
	
	
	const id = $(this).data('id')
	const baseUrl2 = 'http://api.petfinder.com/shelter.getPets'
	const endPoint2 = `?format=json&key=5ccf65ce5510a22f460edeec72b873d2&id=${id}&output=full&callback=?`

	$.getJSON(baseUrl2 + endPoint2, function(data) {
		const pets = data.petfinder.pets.pet
		const toAppend2 = pets.map(pet => {
			const age = pet.age.$t
			const animal = pet.animal.$t
			const description = pet.description.$t
			const name = pet.name.$t
			const sex = pet.sex.$t
			return `<div>
							<h1>${name} is a ${animal} who is ${age}</h1>
							<h3>${description}</h3>

						</div>`
			
			//console.log(pets)
			const breeds = pet.breeds.breed
			let finalBreed
			if (Array.isArray(breeds)) {
				finalBreed = breeds.map(breed => breed.$t).join(' / ')
			} else {
				finalBreed = breeds.$t
			}
			
			const filteredImgs = pet.media.photos.photo.filter(photo => {
				return photo['@size'] === 'x'
			}).map(photo => photo.$t)
		}) 
	})
	$('.pics').append(toAppend2)
})

//		RESEARCH THIS!
// click hanlder on links
	// use event delegation (research this!!)
	// use .data() from jQuery to get the id
	// make new API call to endpoint with id

