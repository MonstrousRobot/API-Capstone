//URL I'm starting at
const baseUrl = 'https://api.petfinder.com/shelter.find'

//The gif that spins while the data loads
const spinner = '<img src="./pictures/spinner.gif" class="spinner">'

//When the user submits the location it will bring a list of
//available shelters in the area.
$('form').submit(function(event){
	event.preventDefault()
	//fading out the landing page
	$('.results').html(spinner)

	//sets the input value(location) to searchPet
	const searchPet = $('#search-pet').val()
	//creating an endpoint for pet API, API requires it be set up this way
	//plugging in searchpet val into EP
	const endPoint = `?format=json&key=5ccf65ce5510a22f460edeec72b873d2&location=${searchPet}&output=full&callback=?`

	// combining baseurl and endpoint to not have a long string
	$.getJSON(baseUrl + endPoint, data => {
		console.log(data)
		//had to work A LOT of kinks in the API setup
		//if there is no data in data.petfinder.shelters return err message
		if (!data.petfinder.shelters) {
			const err = `<h1>Incorrect address entered.
						 <center>Example: Los Angeles, CA</center></h1>`
		//replacing the html with err message
			$('.results').html(err)
			return
		}
		//setting shelters to the array in petfinder
		const shelters = data.petfinder.shelters.shelter

		//toAppend is what I use to display html
		const toAppend = shelters.map(shelter => {
			//looping through shleters(some have 25 shelters)
			//setting consts to arrays of shelter that I will need to display
			const name = shelter.name.$t
			const state = shelter.state.$t
			const city = shelter.city.$t
			const zip = shelter.zip.$t
			const id = shelter.id.$t
			//Displaying html when called.
			return `<li>
						<h1><a href="#" class="shelter" data-id=${id}>${name}</a></h1>
						<h2>Located in ${city}, ${state}, ${zip}</h2>
					</li>`
		})
		//replacing the value of results with toAppend
		$('.results').html(`<ul>${toAppend}</ul>`)
	});
});

//New click event
//on class of results, if you click class of shelter it moves foward.
$('.results').on('click', '.shelter', event => {
	event.preventDefault()
	//shows spinner gif while you wait
	$('.results').html(spinner)
	
	const id = $(event.currentTarget).data('id')
	
	const baseUrl2 = 'https://api.petfinder.com/shelter.getPets'
	const endPoint2 = `?format=json&key=5ccf65ce5510a22f460edeec72b873d2&id=${id}&output=full&callback=?`

	//second api call
	$.getJSON(baseUrl2 + endPoint2, data => {
		console.log(data)
		//if there is no data in data.petfinder.pets return h1 error message
		if (!data.petfinder.pets) {
			$('.results').html(`<h1>No pets found at this shelter</h1>`)
			return
		}

		let pets = data.petfinder.pets.pet
		// Checking to see if pets is an array, if it is, set it equal to pets
		//else puts pets into an array
		//api is set up to look for arrays
		pets = Array.isArray(pets) ? pets : [pets]

		//looping over pets with map
		const toAppend2 = pets.map(pet => {
			//setting const to their respective data
			const age = pet.age.$t
			const animal = pet.animal.$t

			const desc = pet.description.$t
			//description is being set to des if it it equal to des which is pet.description.$t, else its set to to 'No description available'
			const description = desc ? desc : 'No description available'

			const name = pet.name.$t
			//Changes 'M' to Male and 'F' to Female
			//If sex of pet is equal to 'M' return else return 'Female'
			const sex = pet.sex.$t === 'M' ? 'Male' : 'Female'
			
			// //There where instances where the dog was dual breed
			// //and we would get an error trying to display them
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
				//displaying a default photo
				filteredImgs = "<img src='./pictures/pets.jpg' />"
			}

			
			return 		`<div class="inner">
							<h1>${name} is a ${animal} who is a ${age} ${sex} ${finalBreed}</h1>
							<p>${description}</p>
							<div class="polaroid">${filteredImgs}</div>
						</div>`
		}) 

		$('.results').html(toAppend2);

	})
})