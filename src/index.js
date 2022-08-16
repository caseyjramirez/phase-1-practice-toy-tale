const d = document;
let addToy = false;
const toyURL = 'http://localhost:3000/toys'
const toyList = d.getElementById('toy-collection');
const toyForm = d.querySelector('.add-toy-form');


const addBtn = d.querySelector("#new-toy-btn");
const toyFormContainer = d.querySelector(".container");
addBtn.addEventListener("click", () => {
  // hide & seek with the form
  addToy = !addToy;
  if (addToy) {
    toyFormContainer.style.display = "block";
  } else {
    toyFormContainer.style.display = "none";
  }
});

/*
--------------------- FETCH CODE ---------------------
*/


// GET ALL TOYS
function fetchResource(url) {
  return fetch(url)
  .then(res => res.json())
}

// UPDATE TOY
function updateResource(url, body) {
  return fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}

// POST NEW TOY
function postResource(url, body) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  .then(res => res.json())
  .then(() => getAllToys())
  .catch(err => console.log(err))
}

/*
--------------------- HANDLE LIKE ---------------------
*/

function renderToy(data) {
  // create elements
  const wrapper = d.createElement('div');
  const title = d.createElement('h2');
  const img = d.createElement('img');
  const likeCount = d.createElement('p')
  const likeButton = d.createElement('button');

  // assign classes / src
  wrapper.classList.add('card');
  img.src = data.image
  img.classList.add('toy-avatar');
  likeButton.classList.add('like-btn')
  likeButton.id = data.id
  
  // assign text content
  title.textContent = data.name;
  likeCount.textContent = `${data.likes} Likes`;
  likeButton.textContent = 'Like ❤️';

  // add event listener
  likeButton.addEventListener('click', (e) => {
    handleLike(e, data.likes, () => {
      const newNumberOfLikes = data.likes + 1;
      likeCount.textContent = `${newNumberOfLikes} Likes`;
    })
  })

  // append
  wrapper.append(title, img, likeCount, likeButton);
  toyList.append(wrapper);
}


function handleLike(e, numberOfLikes, callBack) {
  body = {likes: numberOfLikes + 1};
  updateResource(`${toyURL}/${e.target.id}`, body)
  
  callBack()
}

function getAllToys() {
  fetchResource(toyURL)
  .then(data => data.forEach(renderToy));
}

/*
--------------------- HANDLE FORM SUBMIT ---------------------
*/


function handleToySubmit(e) {
  e.preventDefault()
  
  const name = e.target.name.value;
  const image = e.target.image.value;

  const body = {
    name, 
    image,
    likes: 0
  }

  postResource(toyURL, body)
}




/*
--------------------- Function Invocation ---------------------
*/

getAllToys();
toyForm.addEventListener('submit', handleToySubmit)