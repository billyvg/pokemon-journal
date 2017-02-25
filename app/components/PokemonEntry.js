import React, { Component } from 'react';
import { Link } from 'react-router';

import Avatar from 'material-ui/Avatar';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { Card, CardHeader, CardTitle, CardText, CardMedia } from 'material-ui/Card';
import { getMoveName } from '../api/moves';

import {
  inject,
  observer,
} from 'mobx-react';
import autobind from 'autobind-decorator';

import styles from './PokemonEntry.css';

@inject('authStore')
@autobind
@observer
export default class PokemonEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();
   
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
      });
  };

  handleTransfer = (id) => {
    const {
      authStore,
    } = this.props;

    authStore.transferPokemon(id);
    this.handleRequestClose();
  };

  toggleFavorite = (id, isFavorite) => {
    const {
      authStore,
    } = this.props;

    authStore.toggleFavoritePokemon(id, isFavorite);
    // console.log(authStore.pokemon_settings);
    this.handleRequestClose();
  };

  handlePowerUp = (id) => {
    const {
      authStore,
    } = this.props;
    
    authStore.powerUpPokemon(id);
    this.handleRequestClose();
  };

  handleEvolve = (id) => {
    const {
      authStore,
    } = this.props;

    authStore.evolvePokemon(id);
    this.handleRequestClose();
  };
  
  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  getCurrentCandies(pokemon) {
    const {
      authStore,
    } = this.props;

    var pokemon_setting = authStore.pokemon_settings.find(x => x.pokemon_id === pokemon.pokemon_id);
    var candy_data = authStore.candies.find(x => x.family_id === pokemon_setting.family_id);

    return candy_data.candy;
  }

  getCandyToEvolve(pokemon) {
    const {
      authStore,
    } = this.props;

    var pokemon_setting = authStore.pokemon_settings.find(x => x.pokemon_id === pokemon.pokemon_id);
    return (pokemon_setting.candy_to_evolve == 0) ? "-" : pokemon_setting.candy_to_evolve;
  }

  render() {
    const {
      pokemon,
      authStore,
    } = this.props;

    const {
      currCP,
      minCP,
      maxCP,
    } = pokemon;

    const percentMaxCp = Math.floor(((currCP - minCP) / (maxCP - minCP)) * 100);
    const percentMaxIv = Math.floor(((pokemon.individual_attack || 0) + (pokemon.individual_defense || 0) + (pokemon.individual_stamina || 0)) / 45 * 100);

    const move1 = getMoveName(pokemon.move_1);
    const move2 = getMoveName(pokemon.move_2);

    const favoriteText = (pokemon.favorite == 1) ? "Unfavorite" : "Favorite";
    const setFavorite = (pokemon.favorite == 1) ? false : true;

    const current_candies = this.getCurrentCandies(pokemon);
    const evolve_candies = this.getCandyToEvolve(pokemon);

    return (
      <div className={styles.container}>
        <div>
          <span className={styles.label}>
            CP
          </span>
          <span>
            {pokemon.cp} ({percentMaxCp}%) {pokemon.favorite ? '\u2605' : ''}
          </span>
        </div>
        <Avatar
          backgroundColor="white"
          size={50}
          src={`./images/${pokemon.meta.num}.png`}
          onTouchTap={this.handleTouchTap}
        />
        <div>
          {pokemon.meta.name} {pokemon.nickname ? `(${pokemon.nickname})` : ''}
        </div>
        <div>
          <span className={styles.label}>
            IV
          </span>
          <span>
            {pokemon.individual_attack || 0}/{pokemon.individual_defense || 0}/{pokemon.individual_stamina || 0} ({percentMaxIv}%)
          </span>
        </div>
        <div>
          <span className={styles.label}>
            Candies: 
          </span>
          <span className={styles.value}>
            {current_candies}/{evolve_candies}
          </span>
        </div>
        <div>
          <span className={styles.label}>
            Fast Move:
          </span>
          <span className={styles.value}>
            {move1}
          </span>
        </div>
        <div>
          <span className={styles.label}>
            Charge Move:
          </span>
          <span className={styles.value}>
            {move2}
          </span>
        </div>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
          <Menu>
            <MenuItem primaryText="Transfer" onClick={() => this.handleTransfer(pokemon.id)} />
            <MenuItem primaryText={favoriteText} onClick={() => this.toggleFavorite(pokemon.id, setFavorite)} />
            <MenuItem primaryText="Power Up" onClick={() => this.handlePowerUp(pokemon.id)} />
            <MenuItem primaryText="Evolve" onClick={() => this.handleEvolve(pokemon.id)} />
          </Menu>
        </Popover>
      </div>
    );
  }
}

