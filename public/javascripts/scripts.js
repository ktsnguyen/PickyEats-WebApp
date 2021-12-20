
const randomButton = document.querySelector('#randomizer');
const randomRestaurant = document.querySelector('#randomRestaurant');
const tableRestaurant = document.querySelectorAll('#restaurantData');

randomButton.addEventListener('click', function() {
  let item = tableRestaurant[Math.floor(Math.random()*tableRestaurant.length)];
  randomRestaurant.innerText = item.innerText;
  randomRestaurant.style.color = "gold";
});
