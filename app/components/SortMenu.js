import React, { Component } from 'react';

import {
  inject,
  observer,
} from 'mobx-react';
import autobind from 'autobind-decorator';

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import SortIcon from 'material-ui/svg-icons/content/sort';
import ScheduleIcon from 'material-ui/svg-icons/action/schedule';
import AlphaIcon from 'material-ui/svg-icons/av/sort-by-alpha';

import TextIcon from './TextIcon';

export type Props = {
  authStore: Object;
  iconColor: string;
};

@inject('authStore')
@autobind
@observer
export default class SortMenu extends Component {
  props: Props;

  handleChangeSort(e, child) {
    const {
      authStore,
    } = this.props;

    authStore.sort = child.props.value;
  }

  render() {
    const {
      authStore,
      iconColor,
    } = this.props;

    const sortOptions = {
      recent: {
        icon: <ScheduleIcon />,
        label: 'Recent',
      },
      id: {
        icon: <TextIcon title="#" />,
        label: 'Number',
      },
      name: {
        icon: <AlphaIcon />,
        label: 'Name',
      },
      cp: {
        icon: <TextIcon title="CP" />,
        label: 'Combat Power',
      },
      iv: {
        icon: <TextIcon title="IV" />,
        label: 'IV',
      },
    };

    if (authStore.journalVisible) {
      return (
        <IconMenu
          iconButtonElement={
            <IconButton
              iconStyle={{ color: iconColor }}
            >
              {sortOptions[authStore.sort].icon || <SortIcon />}
            </IconButton>
          }
          onItemTouchTap={this.handleChangeSort}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          autoWidth
        >
          {Object.keys(sortOptions).map((key) => {
            const {
              label,
              icon,
            } = sortOptions[key];

            return (
              <MenuItem
                key={key}
                value={key}
                primaryText={label}
                rightIcon={icon}
              />
            );
          })}
        </IconMenu>
      );
    }

    return null;
  }
}
