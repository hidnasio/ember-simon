import Ember from 'ember';

const { Controller } = Ember;

export default Controller.extend({
  actions: {
    transitionToPlay() {
      this.transitionToRoute('play');
    }
  }
});
