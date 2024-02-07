let url = "https://openlibrary.org/search.json?";
let id = 0;
let url2 = "https://covers.openlibrary.org/b/";
let button = document.querySelector(".button");
let input = document.querySelector(".input");
let h2 = document.querySelector(".title");
let author = "Brandon Sanderson";
let authorTest = "";
let authorKey = "";
let wrap = 0;
let wrap2 = 9;
let books = {};
let button2 = document.querySelector(".next");
let url3 = "https://openlibrary.org";
let titleArr = [];
let og = "";

button.addEventListener("click", search);
button2.addEventListener("click", display2);

search();

function search(e) {
	e?.preventDefault();
	wrap = 0;
	wrap2 = 9;
	//console.log(input.value);
	let title = input.value;
	input.value = "";
	const words = title.split(" ");
	let title2 = words.join("+");
	
	fetch(`${url}q=${title2}`)
	.then(res=> {
		//console.log("sup");
		return res.json();
	})
	.then(res=> {
		titleArr.push(res.docs[0].title);
		fetch(`${url3}${res.docs[0].key}.json`)
		.then(res => {
			return res.json();
		})
		.then(res=> {
			let z = document.querySelector(".main");
			if(res?.description?.value) {
				z.innerText = res.description.value; 
			}
			else if(res?.description) {
				z.innerText = res.description;
			}
			else {
				z.innerText = "This book has no blurb on file, but I do hope you have a most wonderful day!"
			}
		})
		og = res.docs[0].title;
		//console.log(res.docs[0].cover_i);
		id = res.docs[0].cover_i;
		document.querySelector(".here").src=`${url2}id/${id}-L.jpg`;
		//console.log(document.querySelector(".here"));
		h2.innerText = res.docs[0].title;
		author = res.docs[0].author_name;
		//console.log(author);
		const words2 = author[0].split(" ");
		authorTest = words2.join("+");
		authorKey = res.docs[0].author_key;
		fetch(`${url}author=${authorTest}&sort=rating`) 
		.then(res=> {
			return res.json();
		})
		.then(res=> {
			display(res);	
			books = res;
		})
	})

}

function display(res) {
	//console.log(res);
	button2.style.display = "block";
	document.querySelector(".author").innerText = `More Books By ${author[0]}`
	if(wrap2 >= res.numFound && wrap >= res.numFound){
		wrap = 0;
		wrap2 = 9;
		titleArr = [og];
	}
	if(wrap2 >= res.numFound && wrap < res.numFound){
		wrap2 = res.numFound;
	}
	let x = document.querySelector(".books");
	x.innerHTML = "";
	for(let i = wrap; i < wrap2; i++){
		let english = false;
		if(res.docs[i]?.language?.length){
			for(let j = 0; j < res.docs[i].language.length; j++) {
				if (res.docs[i].language[j] === "eng") {
					english = true;
				}
			}
		}
		let y = "";
		if(english && res.docs[i]?.cover_i && !titleArr.includes(res.docs[i].title)) {
			titleArr.push(res.docs[i].title);
			fetch(`${url3}${res.docs[i].key}.json`)
			.then(resp=> {
				return resp.json();
			})
			.then(resp=> {
				y = resp?.description?.value;	
				if(y){
					const mockHTML = `
					<div class="rec">
						<h3>${res.docs[i].title}</h3>
						<img src="${url2}id/${res.docs[i].cover_i}-M.jpg" alt="rec book">
						<p>${y}</p>
					</div>`
					x.insertAdjacentHTML("beforeend", mockHTML);
				}
				else if(resp?.description) {
					const mockHTML = `
					<div class = "rec">
						<h3>${res.docs[i].title}</h3>
						<img src="${url2}id/${res.docs[i].cover_i}-M.jpg" alt="rec book">
						<p>${resp.description}</p>
					</div>`
					x.insertAdjacentHTML("beforeend", mockHTML);
				}
				else {
					const mockHTML = `
					<div class="rec">
						<h3>${res.docs[i].title}</h3>
						<img src="${url2}id/${res.docs[i].cover_i}-M.jpg" alt="rec book">
						<p>This book does not have a blurb, and thus I have decided to add some text here purely for the sake of asthetics. So now that I have your attention, what shall we discuss? Anthing in mind? Oooo, good point. We should in fact talk about how great of a website this is. How smart of you.</p>
					</div>`
					x.insertAdjacentHTML("beforeend", mockHTML);
				}
			})
		}
		else if(wrap2<=res.numFound){
				wrap2++;
				wrap++;
		}
	}
	wrap += 9;
	wrap2 += 9;
}

function display2(e) {
	e.preventDefault();
	display(books);
}

//console.log("sup2");
