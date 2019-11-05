export const formatCharacter = character => ({
  id: character.url.split('/')[5],
  name: character.name,
  img: `https://starwars-visualguide.com/assets/img/characters/${
    character.url.split('/')[5]
  }.jpg`,
  height:
    character.height !== 'unknown'
      ? character.height.concat('cm')
      : character.height,
  mass:
    character.mass !== 'unknown' ? character.mass.concat('kg') : character.mass,
  hair_color: character.hair_color,
  skin_color: character.skin_color,
  eye_color: character.eye_color,
  birth_year: character.birth_year,
  gender: character.gender,
});

export const formatRequest = (id = undefined) => {
  return {
    url: `https://swapi.co/api/people/${id || ''}`,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Cache-Control': 'no-cache',
      Authorization:
        'CDBDE4E6DC4E6AC1845606D0720BAFA557FA046347876CAA3986872AC1123852',
    },
    method: 'GET',
    proxy: false,
  };
};

export const requestApi = (request, storage, http, saveLen = false) => {
  return http
    .send(request)
    .then(result => {
      let formatedCharacters = [];
      if (saveLen) {
        storage.setItem('len_character', JSON.parse(result.body).count);
      }

      const parsedResponse = JSON.parse(result.body);

      if (saveLen) {
        formatedCharacters = parsedResponse.results.map(e =>
          formatCharacter(e),
        );
      } else {
        formatedCharacters = storage.getItem('cache_characters');
        formatedCharacters.push(formatCharacter(parsedResponse));
      }

      storage.setItem('cache_characters', formatedCharacters);

      return true;
    })
    .catch(error => {
      console.error(error.status);
      console.error(error.msg);
    });
};

export const getCharacters = async (
  auxLenCharacther,
  storage,
  http,
  random,
) => {
  if (auxLenCharacther == null) {
    return requestApi(formatRequest(), storage, http, true);
  }
  return requestApi(formatRequest(random), storage, http, false);
};

export const selectCharacter = async (storage, http) => {
  try {
    const cache = storage.getItem('cache_characters') || [];
    const allLengthCharacters = storage.getItem('len_character');
    const history = storage.getItem('history_characters') || [];

    if (cache.length === 0) {
      // eslint-disable-next-line no-throw-literal
      throw 'no Cache';
    }

    let randNumber = Math.floor(Math.random() * cache.length);
    let alreadyHas = [];
    const character = cache[randNumber];
    character.last_view = new Date();

    history.push(character);

    const newCache = cache.filter(e => e.id !== character.id);

    storage.setItem('cache_characters', newCache);

    do {
      randNumber = Math.floor(Math.random() * allLengthCharacters);
      // eslint-disable-next-line
      alreadyHas = cache.filter(e => e.id === randNumber.toString());
    } while (alreadyHas.length !== 0);

    getCharacters(allLengthCharacters, storage, http, randNumber);

    storage.setItem('selected_character', character);
    storage.setItem('history_characters', history);

    return character;
  } catch (err) {
    console.error(err);
    getCharacters(null, storage, http);
  }
};

export const getInfoLanguage = (storage, languagesDefault) => {
  const language = storage.getItem('language') || 'en';

  storage.setItem('language', language);

  const languages = languagesDefault.map(e => {
    return {
      title: e.title,
      icon: e.icon,
      compact: e.compact,
      selected: language === e.compact,
    };
  });

  return { language, languages };
};

export default {
  formatCharacter,
  getCharacters,
  getInfoLanguage,
  selectCharacter,
};
