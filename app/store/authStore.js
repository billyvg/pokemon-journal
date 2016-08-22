import fs from 'fs';
import storage from 'electron-json-storage';
import {
  observable,
  action,
  computed,
} from 'mobx';
import {
  PTCLogin,
  GoogleLogin,
  Client,
} from 'pogobuf';

import POKEMON_META from '../api/pokemons';
import Sort from '../api/sort';
import { calculateCP } from '../api/calculations';

const pogobuf = require('pogobuf');
const FILENAME = 'response.json';

class Auth {
  @observable provider = 'google';
  @observable username;
  @observable sort = 'recent';
  @observable password;
  @observable authed = false;
  @observable _pokemon = [];
  @observable hasSavedData = false;
  @observable notification = {};
  @observable loading = false;

  constructor() {
    this.client = new Client();
    storage.get('pokemonJournal', (err, data) => {
      this.username = data.username;
      this.provider = data.provider || this.provider;
    });
  }

  @computed
  get pokemon() {
    const sorter = Sort[this.sort];
    if (sorter) {
      return sorter(this._pokemon.slice());
    }

    return Sort.recent(this._pokemon.slice());
  }

  @computed
  get journalVisible() {
    return this.authed || this.pokemon.length;
  }

  @action
  setProvider(value) {
    this.provider = value;
  }

  @action
  login() {
    if (this.authed) {
      return new Promise((resolve) => resolve(this.client.init()));
    }

    if (this.username && this.password && this.provider) {
      const {
        username,
        provider,
      } = this;
      const authLib = this.provider === 'google' ? new GoogleLogin() : new PTCLogin();

      storage.set('pokemonJournal', {
        username,
        provider,
      });

      return authLib.login(this.username, this.password).then((token) => {
        this.client.setAuthInfo(this.provider, token);
        // this.client.setPosition(0, 0);
        this.authed = token;
        return this.client.init();
      }).catch((err) => {
        this.setNotification({
          message: `Error logging in: ${err}`,
          type: 'error',
        });
        console.error('Error logging in ', err);
      });
    }

    this.setNotification({
      message: 'Missing login details',
      type: 'error',
    });

    console.error('Cant login, missing authentication details.');
    return new Promise((resolve, reject) => reject('Unable to login'));
  }

  savedFileCheck = action('savedFileCheck', () => {
    this.hasSavedData = fs.existsSync(FILENAME);
  });

  loadData = action('loadExampleData', () => {
    this.loading = true;
    if (fs.existsSync(FILENAME)) {
      requestAnimationFrame(() => {
        this._pokemon = JSON.parse(fs.readFileSync(FILENAME));
        this.loading = false;
      });
    }
  });

  saveData = action('saveData', () => {
    fs.writeFileSync(FILENAME, JSON.stringify(this._pokemon, null, 2));
  });

  getPokemon = action('getPokemon', () => {
    this.loading = true;
    return this.login().then(
      () => this.client.getInventory(0)
    )
    .then((inventory) => {
      if (inventory.inventory_delta && inventory.inventory_delta.inventory_items) {
        const filtered = inventory.inventory_delta.inventory_items.filter((item) =>
          item.inventory_item_data.pokemon_data && item.inventory_item_data.pokemon_data.pokemon_id
        ).map((item) => {
          const pokemon = item.inventory_item_data.pokemon_data;
          const meta = POKEMON_META[pokemon.pokemon_id - 1];
          return {
            ...pokemon,
            ...calculateCP(pokemon),
            meta,
          };
        });
        this._pokemon = filtered;
      }
      this.loading = false;
    })
    .catch((err) => {
      this.loading = false;
      this.setNotification({
        message: `Error fetching inventory: ${err}`,
        type: 'error',
      });
      console.error('Error retrieving inventory', err);
      console.error(err);
    });
  });

  setNotification = action('setNotification', ({ message, type }) => {
    this.notification = {
      message,
      type,
    };
  });
  
  clearNotification = action('clearNotification', () => {
    this.notifcation = {};
  });

  @action transferPokemon(pokemonId) {
    return this.login().then(
      () => {
      this.client.releasePokemon(pokemonId);
    }).then(
      () => { 
      this.getPokemon(); 
    }).catch((err) => {
      console.error('Error release pokemon');
      console.error(err);
    });
  }

  @action toggleFavoritePokemon(pokemonId, favorite) {
    return this.login().then(
      () => {
      this.client.setFavoritePokemon(pokemonId, favorite);
    }).then(
      () => {
      this.getPokemon();
    }).catch((err) => {
      console.error('Error toggle favorite pokemon');
      console.error(err);
    });
  }

  @action powerUpPokemon(pokemonId) {
    return this.login().then(
      () => {
      this.client.upgradePokemon(pokemonId);
    }).then(
      () => {
      this.getPokemon(); 
    }).catch((err) => {
      console.error('Error power up pokemon');
      console.error(err);
    });
  }

  @action evolvePokemon(pokemonId) {
    return this.login().then(
      () => {
      this.client.evolvePokemon(pokemonId);
    }).then(
      () => {
      this.getPokemon(); 
    }).catch((err) => {
      console.error('Error evolve pokemon');
      console.error(err);
    });
  }
}

const authStore = new Auth();

export default authStore;
export { Auth };
