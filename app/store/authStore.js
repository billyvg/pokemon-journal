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
  @observable authed = true;
  @observable location;
  @observable _pokemon = [];
  @observable sort = 'recent';

  constructor() {
    this.api = new Pokeio();

    navigator.geolocation.getCurrentPosition((loc) => {
      this.location = loc.coords;
    });
  }

  @computed
  get pokemon() {
    const sorter = Sort[this.sort];
    return _.sortBy(this._pokemon.slice(), sorter);
  }

  @action
  setProvider(value) {
    this.provider = value;
  }

  @action
  login() {
    if (this.username && this.password && this.provider && this.location) {
      const location = {
        type: 'coords',
        coords: this.location,
      };

      this.api.init(this.username, this.password, location, this.provider, (err) => {
        if (!err) {
          this.authed = true;
        } else {
          console.error(err);
        }
      });
    } else {
      console.error('Cant login');
    }
  }

  @action getPokemon() {
    // XXX Test from local file
    const fs = require('fs');
    this._pokemon = JSON.parse(fs.readFileSync('response.json'));
    return;
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
