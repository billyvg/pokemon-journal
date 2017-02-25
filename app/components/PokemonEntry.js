/* eslint camelcase:0 */
import React, { Component } from 'react';

import Avatar from 'material-ui/Avatar';

import {
  inject,
  observer,
} from 'mobx-react';
import autobind from 'autobind-decorator';

import styles from './PokemonEntry.css';

export type Props = {
  pokemon: Object;
};

@inject('authStore')
@autobind
@observer
export default class PokemonEntry extends Component {
  props: Props;

  render() {
    const {
      pokemon,
    } = this.props;

    const {
      currCP,
      minCP,
      maxCP,
      individual_attack,
      individual_defense,
      individual_stamina,
    } = pokemon;

    const percentMaxCp = Math.floor(((currCP - minCP) / (maxCP - minCP)) * 100);
    const percentMaxIv = Math.floor(
      ((individual_attack || 0) +
        (individual_defense || 0) +
        (individual_stamina || 0)) /
      (45 * 100)
    );

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
        />
        <div>
          {pokemon.meta.name} {pokemon.nickname ? `(${pokemon.nickname})` : ''}
        </div>
        <div>
          <span className={styles.label}>
            IV
          </span>
          <span>
            {individual_attack || 0}/{individual_defense || 0}/{individual_stamina || 0}
            ({percentMaxIv}%)
          </span>
        </div>
      </div>
    );
  }
}
