import axios from 'axios';
const AUTH_TOKEN = '39463260-e3e8f658d6ff3e91dda44456f';
const API_BASE_URL = `https://pixabay.com/api/?`;

export async function searchImages(userInput, currentPage) {
  const encodedInput = userInput.split(' ').join('+');
  let searchParams = new URLSearchParams({
    key: AUTH_TOKEN,
    q: encodedInput,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: currentPage,
  });
  try {
    const response = await axios.get(`${API_BASE_URL}&${searchParams}`);
    return response.data;
  } catch (error) {
    errorOutput(error);
  }
}

function errorOutput(error) {
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    console.log(error.request);
  } else {
    console.log('Error', error.message);
  }
  console.log(error.config);
}
