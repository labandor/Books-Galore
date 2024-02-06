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
let wrap2 = 10;
let books = {};
let button2 = document.querySelector(".next");
let url3 = "https://openlibrary.org";

button.addEventListener("click", search);
button2.addEventListener("click",display2);


function search(e) {
	e.preventDefault();
	wrap = 0;
	wrap2 = 10;
	//console.log(input.value);
	let title = input.value;
	const words = title.split(" ");
	let title2 = words.join("+");
	
	fetch(`${url}q=${title2}`)
	.then(res=> {
		//console.log("sup");
		return res.json();
	})
	.then(res=> {
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
	if(wrap2>=res.numFound){
		wrap = 0;
		wrap2 = 10;
	}
	if(wrap2>res.numFound){
		wrap2 = res.numFound;
	}
	let x = document.querySelector(".books");
	x.innerHTML = "";
	for(let i = 0+wrap; i < wrap2; i++){
		let english = true;
		if(res.docs[i]?.language?.length){
			for(let j = 0; j < res.docs[i].language.length; j++) {
				if (res.docs[i].language[j] === "eng") {
					english = true;
				}
				else {
					english = false;
				}
			}
		}
		let y = "";
		if(english && res.docs[i]?.cover_i) {
			fetch(`${url3}${res.docs[i].key}.json`)
			.then(resp=> {
				return resp.json();
			})
			.then(resp=> {
				y = resp?.description?.value;	
				if(y){
					const mockHTML = `
						<h3>${res.docs[i].title}</h3>
						<img src="${url2}id/${res.docs[i].cover_i}-M.jpg" alt="rec book">
						<p>${y}</p>`
					x.insertAdjacentHTML("beforeend", mockHTML);
				}
				else {
					const mockHTML = `
					<h3>${res.docs[i].title}</h3>
					<img src="${url2}id/${res.docs[i].cover_i}-M.jpg" alt="rec book">
					<p>This book does not have a blurb</p>`
					x.insertAdjacentHTML("beforeend", mockHTML);
				}
			})
		}
		else {
			if(wrap2<res.numFound){
				wrap2++;
				wrap++;
			}
		}
	}
	if(wrap+20<=res.numFound) {
		wrap += 10;
		wrap2 += 10;
	}
	else {
		wrap += 10;
		wrap2 = wrap2 + (res.numFound - wrap2);
	}
}

function display2(e) {
	e.preventDefault();
	display(books);
}


//console.log("sup2");
