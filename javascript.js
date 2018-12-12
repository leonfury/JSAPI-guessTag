//JS guess the tag Challenge
const guessContainer = document.getElementById('guessContainer');
const btnGuess = document.querySelectorAll('.btnGuess');
const gridItems = document.querySelectorAll('.gridItems');
const photoGrid = document.getElementById('photoGrid');
let buttons = guessContainer.children; //short form
let masonry;

//1. have array of tags
	let tagNames = ["food", "pizza", "coding", "cats", "dogs", "marvel", "laughter", "landscape", "hiking", "monkeys", "zoo", "fishes", "surfing", "italy","turtle", "nature", "snow"];
	//let tagNames = ["food", "pizza", "singapore", "cats", "dogs"];
	let tagChosen;
	let cloneTagNames = [];

	newGame(); //execute game onload

	for (let i = 0; i < buttons.length; i++) {
		btnGuess[i].onclick = function () {
			let click = event.target.innerHTML;
			console.log(click);
			if (click == tagChosen) window.alert("That's right!");
			if (click != tagChosen) window.alert("Wrong! The answer is " + tagChosen.toUpperCase());
			newGame();
		}
	}

// 2. randomly select a tag from array
	function newGame () {
		console.log('----------------------------------------')
		console.log('>> function newGame executed')
		tagChosen = random(tagNames);
					// console.log('chosen tag : ' + tagChosen);
		cloneTagNames = [];
		photoGrid.innerHTML = " ";
		cloneArray();
		fillButtons();
		fillGrid(tagChosen);
		console.log(tagNames);
		console.log(cloneTagNames);
		console.log('chosen word : ' + tagChosen);
		// let childrenCount = photoGrid.children
		// console.log(childrenCount);
	}

	function random (array) {
		let i = Math.floor (Math.random() * array.length);
		//console.log('random array index ' + i + ' = ' + array[i]);
		return array[i];
	}

// 5b. clone tag names array, randomize and push to guess buttons, pop from clone array
	function cloneArray () { //exclude chosen word
		console.log('>> function cloneArray executed');
		for (let item of tagNames) {
			if (item != tagChosen) cloneTagNames.push(item);
		}
					// console.log('main array');
					// console.log(tagNames);
					// console.log('cloned array');
					// console.log(cloneTagNames);
	}

// 3. assign random tag to the answer
// 4. random tag is placed to guess buttons in a random position
// 5. remaining guess buttons are filled with other random tags, 
// 5a. tag names cannot be repeated!
	function fillButtons () {
		console.log('>> function fillButtons executed ');
		for (i=0; i < buttons.length; i++) {
			buttons[i].innerHTML = " ";
		}

		random(buttons).innerHTML = tagChosen; //assigning answer to button

		for (i=0; i < buttons.length; i++) {
			if (buttons[i].innerHTML != tagChosen) {
				buttons[i].innerHTML = random(cloneTagNames);
				cloneTagNames.splice( cloneTagNames.indexOf(buttons[i].innerHTML) , 1);
			}
		}
	}

// 6. take random tag input to APi
// 7. API returns photo items
	function fillGrid (tag) {
		console.log('>> function fillGrid executed with tag: ' + tag);

		fetch("https://api.tumblr.com/v2/tagged?type=photo&tag=" + tagChosen + "&api_key=qRnT4BW9URZhGhosGCFkTY7pahYxkKUFCxpSe38wEoOlF2oas3")
			.then( function(response) {
				if(!response.ok) window.alert('invalid API URL');
				return response.json();
			}).then(function(result) {
				let items = result.response;
				
				for (let i = 0; i < items.length; i++) {
					if (items[i].type == "photo") {
						let photos = items[i].photos[0].alt_sizes[0].url;

						const li = document.createElement('li');
						const img = document.createElement('img');

						li.classList.add('gridItems');
						img.setAttribute('src', photos);

						li.appendChild(img);
						photoGrid.appendChild(li);

						imagesLoaded(photoGrid).on('progress', function () {
							masonry.layout();
						});
					}
					
					//console.log(photoGrid.children.length)
				}

				masonry = new Masonry ( photoGrid, {
					//options
					itemSelector: '.gridItems',
				});

	
			}).catch(function(err) {
				window.alert('Error Message API offline : ' + err);
			});	
	}

// 8. guess bottons clicked
// 8a. correct answer then alert congrats -> new game / repeat from step 2
// 8b. wrong answer then alert right answer -> new game / repeat from step 2