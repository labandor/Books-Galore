let url = "https://openlibrary.org/search.json?q=";
let id = 0;
let url2 = "https://covers.openlibrary.org/b/";
let button = document.querySelector(".button");
let input = document.querySelector(".input");
let h2 = document.querySelector(".title");

button.addEventListener("click", search);


function search(e) {
	e.preventDefault();
	//console.log(input.value);
	let title = input.value;
	const words = title.split(" ");
	let title2 = words.join("+");
	
	fetch(`${url}${title2}`)
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
	})
}

console.log("sup2");
