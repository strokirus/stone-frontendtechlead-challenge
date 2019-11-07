import Router from 'svelte-page';
import Storage from '@mamba/pos/api/storage.js';

const { newApp } = global;

const character = {
  id: '1',
  name: 'Luke Skywalker',
  img: 'https://starwars-visualguide.com/assets/img/characters/1.jpg',
  height: '172cm',
  mass: '77kg',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
  last_view: '2019-11-07T17:46:59.443Z',
};

newApp();

it('should go to home page', () => {
  Router.go('/');
  expect(document.title).toBe('Mazz Bar');
});

it('should go to character page', () => {
  Storage.setItem('len_character', 1);
  Storage.setItem('cache_characters', [character]);

  expect(document.title).toBe('Mazz Bar');
});
