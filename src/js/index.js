import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;
let name = '';
const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const input = event => {
  name = event.target.value.trim();
  reset();
  if (name === '') {
    return 0;
  }

  fetchCountries(name)
    .then(countries => {
      if (countries.length === 1) {
        refs.countryInfo.insertAdjacentHTML('beforeend', renderInfo(countries));
      } else if (countries.length >= 10) {
        alertTooManyMatches();
      } else {
        refs.countryList.insertAdjacentHTML('beforeend', renderList(countries));
      }
    })
    .catch(alertWrongName);
};
const renderList = countries => {
  const markup = countries
    .map(({ name, flags }) => {
      return `
        <li class="country-list__item">
            <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 30px height = 30px>
            <h2 class="country-list__name">${name.official}</h2>
        </li>
        `;
    })
    .join('');
  return markup;
};
function reset() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
const renderInfo = countries => {
  const markup = countries
    .map(({ name, flags, capital, population, languages }) => {
      return `
        <div class="country-info__item">
            <img class="country-info__flag" src="${flags.svg}" alt="Flag of ${
        name.official
      }" width = 30px height = 30px>
            <h2 class="country-info__name">${name.official}</h2>
            <p class="country-info__capital"><b>Capital:</b> ${capital}</p>
            <p class="country-info__population"><b>Population:</b> ${population}</p>
            <p class="country-info__languages"><b>Languages:</b> ${Object.values(
              languages
            ).join(', ')}</p>
        </div>
        `;
    })
    .join('');
  return markup;
};
const alertWrongName = () =>
  Notiflix.Notify.failure('Oops, there is no country with that name');

const alertTooManyMatches = () =>
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );

refs.input.addEventListener('input', debounce(input, DEBOUNCE_DELAY));
