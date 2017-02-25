import _ from 'lodash';

export default {
  recent(items) {
    return _.reverse(
      _.sortBy(items, (v) => v && v.creation_time_ms)
    );
  },

  iv(items) {
    return _.reverse(
      _.sortBy(items, (v) => {
        let i = 0;
        let sum = 0;
        _.forEach(['individual_attack', 'individual_defense', 'individual_stamina'], (key) => {
          if (typeof v[key] !== 'undefined') {
            sum += v[key];
            i++;
          }
        });

        return sum / i;
      })
    );
  },

  id(items) {
    return _.sortBy(
      _.sortBy(items, (v) => -v.cp),
      (v) => v.pokemon_id
    );
  },

  cp(items) {
    return _.sortBy(items, (v) => -v.cp);
  },

  name(items) {
    return _.sortBy(
      _.sortBy(items, (v) => -v.cp),
      (v) => {
        if (typeof v.nickname !== 'undefined' && v.nickname !== '') {
          return v.nickname;
        }
        return v.meta.name;
      }
    );
  },

};
