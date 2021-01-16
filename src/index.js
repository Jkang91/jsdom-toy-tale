let addToy = false;
//constants


document.addEventListener("DOMContentLoaded", ()=> {
  loadToys();
  const form = document.querySelector('form');
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", function(e) {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  }); 
  /***********GRABBING THE INFO FROM FIELDS*********/
  form.addEventListener("submit", function(e){
    e.preventDefault();
    const toyName = document.querySelector('input[name="name"]').value;
    //const name = e.target.name.value
    const toyURL = document.querySelector('input[name="image"]').value;
    //const image = e.target.image.value
    const numOfCurrentToy = document.querySelectorAll(".card").length;
    let toyLikes = 0;
    let toyObject = {
      "id": numOfCurrentToy + 1,
      "name": toyName,
      "image": toyURL,
      "likes": toyLikes
    }
    renderToys(toyObject);
    addToDb(toyObject);
    e.target.reset();
  })
  const toyCollection = document.querySelector("div#toy-collection")
  toyCollection.addEventListener("click", function(e){
    if(e.target.className === "like-button"){
      const card = e.target.closest(".card");
      let numOfLikesTag = card.querySelector('p');
      numOfLikesTag.textContent = parseInt(numOfLikesTag.textContent) + 1 + " Likes";
      let likeCount = numOfLikesTag.textContent;
      let toyId = card.dataset.id
      updateDb(toyId, likeCount)
    }
  })
});

/**********NETWORK REQUEST************/
function loadToys(){
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(arrayOfToys => {
      arrayOfToys.forEach(toyObj => renderToys(toyObj))
    });
}

/********RENDERING EACH TOY***********/
function renderToys(toyObj){
  const divCollection = document.querySelector("#toy-collection");
  const div = document.createElement("div");
  const h2 = document.createElement('h2');
  const img = document.createElement('img');
  img.className = "toy-avatar";
  const p = document.createElement('p');
  const btn = document.createElement('button');
  
  div.className = "card";
  div.dataset.id = toyObj.id
  divCollection.append(div);
  btn.className = "like-button";
  h2.textContent = toyObj.name;
  img.src = toyObj.image; 
  p.textContent = toyObj.likes;
  btn.textContent = "Like";
  div.append(h2, img, p, btn);
  divCollection.append(div);
}
/**************POST REQUEST***********/
function addToDb(toyObject){
  fetch('http://localhost:3000/toys', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(toyObject),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data)
  })
}

/**********UPDATING REQUEST************/
function updateDb(toyId, numOfLikes){
  fetch(`http://localhost:3000/toys/${toyId}`, {
    method: 'PATCH', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "likes": numOfLikes
    })
  })
}
