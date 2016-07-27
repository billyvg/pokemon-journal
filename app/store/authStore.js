import _ from 'lodash';
import storage from 'electron-json-storage';
import autobind from 'autobind-decorator';
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


class Auth {
  @observable provider = 'google';
  @observable username;
  @observable sort = 'recent';
  @observable locationString;
  @observable password;
  @observable authed = false;
  @observable location;
  @observable _pokemon = [];

  constructor() {
    this.client = new Client();
    storage.get('pokemonJournal', (err, data) => {
      this.username = data.username;
      this.provider = data.provider || this.provider;
      this.locationString = data.locationString;
    });

    this.getLocation();
  }

  @action
  getLocation() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((loc) => {
        this.location = loc.coords;
        resolve(loc);
      }, (err) => {
        console.error('Error getting location', err);
        reject(err);
      });
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
        locationString,
        provider,
      } = this;
      const authLib = this.provider === 'google' ? new GoogleLogin() : new PTCLogin();

      storage.set('pokemonJournal', {
        username,
        provider,
        locationString,
      });

      if (!this.location && !this.locationString) {
        this.getLocation();
      } else {
        let location;

        if (this.location) {
          location = {
            type: 'coords',
            coords: this.location,
          };
        } else if (this.locationString) {
          location = {
            type: 'name',
            name: this.locationString,
          };
        }


        return authLib.login(this.username, this.password).then((token) => {
          this.client.setAuthInfo(this.provider, token);
          this.client.setPosition(0, 0);
          this.authed = token;
          return this.client.init();
        }).catch((err) => {
          console.error('Error logging in ', err);
        });
      }
    } else {
      console.error('Cant login, missing authentication details.');
      return new Promise((resolve, reject) => reject('Unable to login'));
    }
  }

  @action getPokemon() {
    return this.login().then(
      () => this.client.getInventory(0)
    ).then((inventory) => {
      if (inventory.inventory_delta && inventory.inventory_delta.inventory_items) {
        const filtered = inventory.inventory_delta.inventory_items.filter((item) => {
          return item.inventory_item_data.pokemon_data && item.inventory_item_data.pokemon_data.pokemon_id;
        }).map((item) => {
          const pokemon = item.inventory_item_data.pokemon_data;
          const meta = POKEMON_META[pokemon.pokemon_id - 1];
          return {
            ...pokemon,
            ...calculateCP(pokemon),
            meta,
          };
        });

        // const fs = require('fs');
        // fs.writeFileSync('response.json', JSON.stringify(filtered, null, 2));
        this._pokemon = filtered;
      }
    }).catch((err) => {
      console.error('Error retrieving inventory');
    });
  }
}

const authStore = new Auth();

export default authStore;
export { Auth };
