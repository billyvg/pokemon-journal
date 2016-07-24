import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class Login extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div>
          <SelectField
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
          floatingLabelText="Username"
          floatingLabelFixed
        />
        <br />

        <TextField
          hintText="Password"
          floatingLabelText="Password"
          type="password"
        />
        <br />

        <RaisedButton
          label="Login"
          primary
        />

      </div>
    );
  }
}
