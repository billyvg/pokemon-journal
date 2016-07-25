import _ from 'lodash';
import autobind from 'autobind-decorator';
import {
  observable,
  action,
  computed,
} from 'mobx';
import { Pokeio } from 'pokemon-go-node-api';
import POKEMON_META from '../api/pokemons';
import Sort from '../api/sort';

class Auth {
  @observable provider = 'google';
  @observable username;
  @observable password;
  @observable authed = false;
  @observable location;
  @observable _pokemon = [];
  @observable sort = 'recent';
  @observable locationString = 'San Francisco';

  constructor() {
    this.api = new Pokeio();

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
    return _.reverse(
      _.sortBy(this._pokemon.slice(), sorter)
    );
  }

  @action
  setProvider(value) {
    this.provider = value;
  }

  @action
  login() {
    if (this.username && this.password && this.provider) {
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

        this.api.init(this.username, this.password, location, this.provider, (err) => {
          if (!err) {
            this.authed = true;
            this.getPokemon();
          } else {
            console.error(err);
          }
        });
      }
    } else {
      console.error('Cant login, missing authentication details.');
    }
  }

  @action getPokemon() {
    this.api.GetInventory((err, res) => {
      if (!err) {
        if (res && res.inventory_delta && res.inventory_delta.inventory_items) {
          const filtered = res.inventory_delta.inventory_items.filter((item) => {
            return item.inventory_item_data.pokemon && item.inventory_item_data.pokemon.pokemon_id;
          }).map((item) => item.inventory_item_data.pokemon)
            .map((pokemon) => {
              console.log(pokemon.pokemon_id);
              const meta = POKEMON_META[pokemon.pokemon_id - 1];
              return {
                ...pokemon,
                name: meta.name,
                img: meta.img,
                type: meta.type,
              };
            })


          const fs = require('fs');
          fs.writeFileSync('response.json', JSON.stringify(filtered, null, 2));
          this._pokemon = filtered;
        }
      } else {
        console.error(err);
      }
    });
  }
}

const authStore = new Auth();

export default authStore;
export { Auth };
