import './css/styles.css';
// import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputNameCountry = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const infoCountry = document.querySelector('.country-info');

inputNameCountry.addEventListener(
  'input',
  debounce(inputChange, DEBOUNCE_DELAY)
);

function inputChange() {
  let inputValue = inputNameCountry.value.trim();
  if (inputValue === '') {
    clearAll();
    return;
  } else {
    fetchCountries(inputValue);
  }
}

function fetchCountries(name) {
  fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => {
      if (data.length < 2) {
        createElement(data);
        Notiflix.Notify.success('This is your result');
      } else if (data.length < 10 && data.length > 1) {
        createElementItem(data);
        Notiflix.Notify.success('This is your result');
      } else {
        clearAll();
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(error => {
      clearAll();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createElement(data) {
  clearAll();
  infoCountry.innerHTML = data.map(infoCard => {
    return `<div class ="country-card"><img src="${
      infoCard.flags.svg
    }" alt="Country flags" width="40" height="30"/>
         <h2>${infoCard.name.official}</h2></div>
        <p><b>Capital:</b> ${infoCard.capital}</p>
        <p><b>Population:</b> ${infoCard.population}</p>
        <p><b>Languages:</b> ${Object.values(infoCard.languages).join(
          ','
        )}</p>`;
  });
}
function clearAll() {
  list.innerHTML = '';
  infoCountry.innerHTML = '';
}

function createElementItem(data) {
  clearAll();
  list.innerHTML = data
    .map(infoCard => {
      return `<li class = "country-list--item">
       <img src="${infoCard.flags.svg}" alt="Country flags" width="40", height="30"/>
         <p class = "country-list--name">${infoCard.name.official}<p> </li>
        `;
    })
    .join('');
}
