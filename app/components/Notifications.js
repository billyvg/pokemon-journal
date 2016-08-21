import React, { Component } from 'react';
import Snackbar from 'material-ui/Snackbar';

import autobind from 'autobind-decorator';
import {
  observer,
  inject,
} from 'mobx-react';

export type Props = {
  authStore: Object;
};

@inject('authStore')
@autobind
@observer
export default class Notifications extends Component {
  props: Props;

  render() {
    const {
      authStore,
    } = this.props;

    const notification = authStore.notification;

    return (
      <Snackbar
        open={!!notification.message}
        message={notification.message}
        autoHideDuration={4000}
        onRequestClose={authStore.resetNotification}
      />
    );
  }
}
