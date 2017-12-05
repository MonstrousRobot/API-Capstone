const baseUrl = 'https://api.petfinder.com/shelter.find'

//The gif that spins while the data loads
const spinner = '<img src="./pictures/spinner.gif" class="spinner">'

//When the user submits the location it will bring a list of
//available shelters in the area.
$('form').submit(function(event){
	event.preventDefault()
	//fading out the landing page
	$('.results').html(spinner)

	//sets the input value to searchPet
	const searchPet = $('#search-pet').val()
	//Not sure how to sum this up
	const endPoint = `?format=json&key=5ccf65ce5510a22f460edeec72b873d2&location=${searchPet}&output=full&callback=?`

	// combining baseurl and endpoint to not have a long string

	//Need explanation of (data)***
	//**Look up $.getJSON() if I stil dont get it.
	$.getJSON(baseUrl + endPoint, data => {
		
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
		//toAppend is what I will display in the html,
		const toAppend = shelters.map(shelter => {
			//looping through shleters
			//setting consts to arrays of shelter that will make development faster
			const name = shelter.name.$t
			const state = shelter.state.$t
			const city = shelter.city.$t
			const zip = shelter.zip.$t
			const id = shelter.id.$t
			//Displaying html when called.
			//lost on why data-id=${id} is in here?
			//explained it
			return `<li>
						<h1><a href="#" class="shelter" data-id=${id}>${name}</a></h1>
						<h2>Located in ${city}, ${state}, ${zip}</h2>
					</li>`
		})
		//replacing the value of results with toAppend
		$('.results').html(`<ul>${toAppend}</ul>`)
	});
});

//on class of results, if you click class of shelter it moves foward.
$('.results').on('click', '.shelter', event => {
	event.preventDefault()
	//shows spinner gif while you wait
	$('.results').html(spinner)
	
	//need clarification on this
	//thoughts: const id is equal to .shelter
	const id = $(event.currentTarget).data('id')
	
	const baseUrl2 = 'https://api.petfinder.com/shelter.getPets'
	const endPoint2 = `?format=json&key=5ccf65ce5510a22f460edeec72b873d2&id=${id}&output=full&callback=?`
	//if I were to switch baseUrl,endPoint and add query, would i just combined them all?
	$.getJSON(baseUrl2 + endPoint2, data => {
		//if there is no data in data.petfinder.pets return h1 error message
		if (!data.petfinder.pets) {
			$('.results').html(`<h1>No pets found at this shelter</h1>`)
			return
		}

		let pets = data.petfinder.pets.pet
		// Checking to see if pets is an array, if it is, set it equal to pets
		//else puts pets into an array
		//Could I see another example of this?
		pets = Array.isArray(pets) ? pets : [pets]

		//looping over pets with map
		const toAppend2 = pets.map(pet => {
			//setting const to their respective data
			const age = pet.age.$t
			const animal = pet.animal.$t

			const desc = pet.description.$t
			//description is being set to des if it it equal to deswhich is pet.description.$t, else its set to to 'No description available'
			const description = desc ? desc : 'No description available'

			const name = pet.name.$t

			//Changes 'M' to Male and 'F' to Female
			//If sex of pet is equal to 'M' return else return 'Female'
			const sex = pet.sex.$t === 'M' ? 'Male' : 'Female'
			
			const breeds = pet.breeds.breed
			
			//explain this 
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

//write snippets of map, filter, ternary on slack for Jesse.
//See if i can chain them together. 
//Fully explain id ${id}. 


//		RESEARCH THIS!
	// use event delegation (research this!!)
	// use .data() from jQuery to get the id

