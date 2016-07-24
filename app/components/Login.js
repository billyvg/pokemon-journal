import React, { Component } from 'react';
import { Link } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import autobind from 'autobind-decorator';
import {
  observer,
  inject,
} from 'mobx-react';
import styles from './Home.css';

@inject('authStore')
@autobind
@observer
export default class Login extends Component {
  login(e) {
    const {
      authStore,
    } = this.props;
    e.preventDefault();
    authStore.login();
  }

  handleSelect(e, index, value) {
    const {
      authStore,
    } = this.props;

    authStore.setProvider(value);
  }

  handleUsername(e, value) {
    const {
      authStore,
    } = this.props;

    authStore.username = e.target.value;
  }

  handlePassword(e, value) {
    const {
      authStore,
    } = this.props;

    authStore.password = e.target.value;
  }

  render() {
    const {
      authStore,
    } = this.props;

    return (
      <form
        className={styles.container}
        onSubmit={this.login}
      >
        <div>
          <SelectField
            value={authStore.provider}
            onChange={this.handleSelect}
            autowidth
          >
            <MenuItem
              value="google"
              primaryText="Google"
            />
            <MenuItem
              value="ptc"
              primaryText="Pokemon Trainer Club"
            />
          </SelectField>
        </div>

        <TextField
          hintText="Username"
          onChange={this.handleUsername}
          value={authStore.username}
          name="username"
          floatingLabelText="Username"
        />
        <br />

        <TextField
          hintText="Password"
          onChange={this.handlePassword}
          value={authStore.password}
          floatingLabelText="Password"
          type="password"
          name="password"
        />
        <br />

        <RaisedButton
          type="submit"
          label="Login"
          primary
        />
      </form>
    );
  }
}
