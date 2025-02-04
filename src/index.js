let addToy = false;
let divCollect = document.querySelector('#toy-collection');
const toyFormContainer = document.querySelector(".container");

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      toyFormContainer.addEventListener('submit', event => {
        event.preventDefault();
        postToy(event.target)
      })
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});


function getToys() {
  return fetch('http://localhost:3000/toys')
  .then(result => result.json())
}

function buildToys(toy) {
  let h2 = document.createElement('h2');
  h2.innerText = toy.name;

  let img = document.createElement('img');
  img.setAttribute('src', toy.image);
  img.setAttribute('class', 'toy-avatar');

  let p = document.createElement('p');
  p.innerText = `${toy.likes} likes`;

  let btn = document.createElement('button');
  btn.setAttribute('class', 'like-btn');
  btn.setAttribute('id', toy.id);
  btn.innerText = 'like';
// add button click logic
  btn.addEventListener('click', (e) => {
    console.log(e.target.dataset);
    likes(e)
  })

let divCard = document.createElement('div');
divCard.setAttribute('class', 'card');
divCard.append(h2, img, p, btn);
divCollect.append(divCard);

}

function postToy(toy_data) {
  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      "name": toy_data.name.value,
      "image": toy_data.image.value,
      "likes": 0
    })
  })
  .then(result => result.json())
  .then((obj_toy) => {
    buildToys(obj_toy)
  })
}

function likes(e) {
  e.preventDefault()
  let addLike = parseInt(e.target.previousElementSibling.innerText)+1

  fetch(`http://localhost:3000/toys/${e.target.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accepts": "application/json"
    },
    body: JSON.stringify({
      "likes": addLike
    })
  })
  .then(result => result.json())
  .then((like_obj => {
    e.target.previousElementSibling.innerText = `${addLike} likes`;
  }))
}


getToys()
.then(toys => {
  toys.forEach(toy => {buildToys(toy)
  })
})