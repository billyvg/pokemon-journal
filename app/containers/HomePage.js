import React, { Component } from 'react';
import Home from '../components/Home';
import Journal from '../components/Journal';
import {
  inject,
  observer,
} from 'mobx-react';

@inject('authStore')
@observer
export default class HomePage extends Component {
  render() {
    const {
      authStore,
    } = this.props;

    if (authStore.authed) {
      return <Journal />;
    }

    return <Home />;
  }
}
