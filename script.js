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
let titleDes = "";
let descriptions = [];
let counter = 0;
let button3 = document.querySelector(".big");

button.addEventListener("click", search);
button2.addEventListener("click", display2);
button3.addEventListener("click", bigExpand);

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
				z.innerText = res.description.value.substr(0, 1425) + "..."; 
				titleDes = res.description.value;
			}
			else if(res?.description) {
				z.innerText = res.description.substr(0, 1425) + "...";
				titleDes = res.description;
			}
			else {
				z.innerText = "This book has no blurb on file, but I do hope you have a most wonderful day!"
				titleDes = z.innerText;
			}
		})
		og = res.docs[0].title;
		//console.log(res.docs[0].cover_i);
		id = res.docs[0].cover_i;
		let b = document.querySelector(".here");
		b.src=`${url2}id/${id}-L.jpg`;
		//console.log(b.style);
		//console.log(b);
		b.style.display = "flex";
		document.querySelector(".start").style.display = "none";
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
	counter = 0;
	descriptions = [];
	//console.log(res);
	button2.style.display = "block";
	document.querySelector(".big").style.display = "block";
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
					descriptions.push(y);
					const mockHTML = `
					<div class="rec">
						<h3>${res.docs[i].title}</h3>
						<img src="${url2}id/${res.docs[i].cover_i}-M.jpg" alt="rec book">
						<p class="p${counter}">${y.substr(0, 423)}...</p>
						<button class="b${counter}">More</button>
					</div>`
					x.insertAdjacentHTML("beforeend", mockHTML);
					counter ++;
				}
				else if(resp?.description) {
					descriptions.push(resp.description);
					const mockHTML = `
					<div class = "rec">
						<h3>${res.docs[i].title}</h3>
						<img src="${url2}id/${res.docs[i].cover_i}-M.jpg" alt="rec book">
						<p class="p${counter}">${resp.description.substr(0, 423)}...</p>
						<button class="b${counter}">More</button>
					</div>`
					x.insertAdjacentHTML("beforeend", mockHTML);
					counter ++;
				}
				else {
					const mockHTML = `
					<div class="rec">
						<h3>${res.docs[i].title}</h3>
						<img src="${url2}id/${res.docs[i].cover_i}-M.jpg" alt="rec book">
						<p>This book does not have a blurb, and thus I have decided to add some text here purely for the sake of asthetics. So now that I have your attention, what shall we discuss? Anything in mind? Oooo, good point. We should in fact talk about how great of a website this is. How smart of you.</p>
					</div>`
					x.insertAdjacentHTML("beforeend", mockHTML);
				}
				for (let i = 0; i < counter; i++) {
					document.querySelector(`.b${i}`).addEventListener("click", expand);
					console.log("added" + i);
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

function expand(e) {
	e.preventDefault();
//	console.log(e.target);
//	console.log(e.target.className);
	let u = document.querySelector(`.p${e.target.className[1]}`);
	let t = u.innerText;
//	console.log(u);
//	console.log(t);
	u.innerText = descriptions[parseInt(e.target.className[1])];
	descriptions[parseInt(e.target.className[1])] = t;
	let q = document.querySelector(`.${e.target.className}`);
//	console.log(q);
//	console.log(parseInt(e.target.className[1]));
	if(q.innerText == "More") {
		q.innerText = "Collapse";
	}
	else {
		q.innerText = "More";
	}
}

function bigExpand(e){
	e.preventDefault();
	let n = document.querySelector(".main");
	let d = n.innerText;
	n.innerText = titleDes;
	titleDes = d;
	if(button3.innerText == "More") {
		button3.innerText = "Collapse";
	}
	else {
		button3.innerText = "More";
	}
}

function display2(e) {
	e.preventDefault();
	display(books);
}

//console.log("sup2");
