import $ from 'jquery';
import 'normalize.css';
import './index.css';
import { apiKey } from './apikey.js';

// console.log(apiKey);

const formatUrl = function (stateCodes) {
  let endpointUrl = 'https://developer.nps.gov/api/v1/parks';
  let stateCode = stateCodes.join(',');
  return `${endpointUrl}?api_key=${apiKey}&stateCode=${stateCode}`;
};

const formatResponseList = function (responseJson){
  return responseJson.data.map(item => `
  <li>
    <h3><a href="${item.url}">${item.fullName}</a></h3>
    <p>${item.description}</p>
  </li>`).join('');
};

const getParksList = function (stateCodeString){
  let stateCodes = stateCodeString.split(' ');
  let url = formatUrl(stateCodes);
  // console.log(url);
  fetch(url)
    .then(response => {
      if(response.ok)
        return response.json();
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      $('#results').removeClass('hidden');
      $('#result-list').html(formatResponseList(responseJson));
    })
    .catch(error => {
      $('#error-message').append(error.message).removeClass('hidden');
    });
};

const handleFormSubmit = function() {
  $('#search-form').on('submit', event => {
    event.preventDefault();
    $('#error-message').empty().addClass('hidden');
    $('#results').addClass('hidden');
    $('#result-list').empty();
    getParksList($('#state-codes').val());
  });
};

handleFormSubmit();