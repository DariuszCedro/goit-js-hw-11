import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { searchImages } from './handlers';

const input = document.querySelector('#search-form input');
const gallery = document.querySelector('.gallery');
const loadButton = document.querySelector('.load_button');
const searchButton = document.querySelector('.search_button');

let currentPage = 0;

searchButton.addEventListener('click', async e => {
  e.preventDefault();
  currentPage = 0;
  loadButton.classList.add('is-hidden');
  gallery.innerHTML = '';
  await createGallery();
});

loadButton.addEventListener('click', createGallery);

async function createGallery() {
  try {
    currentPage += 1;

    const searchResult = await searchImages(input.value, currentPage);

    if (searchResult.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        {
          timeout: 5000,
          fontSize: '25px',
        }
      );
    } else {
      if (currentPage === 1) {
        Notiflix.Notify.success(
          `Hooray! We found ${searchResult.totalHits} images.`,
          {
            timeout: 5000,
            fontSize: '25px',
          }
        );
      }
      let galleryOfSearchResults = '';
      searchResult.hits.forEach(hit => {
        galleryOfSearchResults += `<div class="photo-card">
        <a href="${hit.largeImageURL}"><img class="img" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" width="400" /></a>
        <div class="info">
          <p class="info_item">
            <b>Likes:</b> ${hit.likes}
          </p>
          <p class="info_item">
            <b>Views:</b> ${hit.views}
          </p>
          <p class="info_item">
            <b>Comments:</b> ${hit.comments}
          </p>
          <p class="info_item">
            <b>Downloads:</b> ${hit.downloads}
          </p>
        </div>
      </div>`;
      });

      gallery.innerHTML += galleryOfSearchResults;

      new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
      }).refresh();

      const lastPage = Math.ceil(searchResult.totalHits / 40);

      if (currentPage === lastPage) {
        loadButton.classList.add('is-hidden');
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results.",
          {
            timeout: 5000,
            fontSize: '25px',
          }
        );
        return;
      } else {
        loadButton.classList.remove('is-hidden');
      }
    }
  } catch (error) {
    console.error(error);
  }
}
