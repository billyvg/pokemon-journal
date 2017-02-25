import React, { Component } from 'react';

import {
  inject,
  observer,
} from 'mobx-react';

import PokemonEntry from './PokemonEntry';
import styles from './PokemonList.css';


type Props = {
  authStore: any;
};

@inject('authStore')
@observer
export default class PokemonList extends Component<Props> {
  props: Props;

  render() {
    const {
      authStore,
    } = this.props;

    return (
      <div className={styles.container}>
        {authStore.pokemon.map((pokemon, i) => (
          <PokemonEntry
            key={i}
            pokemon={pokemon}
          />
            ))}
      </div>
    );
  }
}
