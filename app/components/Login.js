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

@inject('authStore')
@autobind
@observer
export default class Login extends Component {
  login(e) {
    const {
      authStore,
    } = this.props;
    e.preventDefault();
    authStore.login().then(() => authStore.getPokemon());
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

        <div>
          <TextField
            hintText="Username"
            onChange={this.handleUsername}
            value={authStore.username}
            name="username"
            floatingLabelText="Username"
          />
        </div>

        <div>
          <TextField
            hintText="Password"
            onChange={this.handlePassword}
            value={authStore.password}
            floatingLabelText="Password"
            type="password"
            name="password"
          />
        </div>

        <RaisedButton
          type="submit"
          label="Login"
          primary
        />
      </form>
    );
  }
}
