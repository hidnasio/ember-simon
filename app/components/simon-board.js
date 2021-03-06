import Ember from 'ember';
import { task, timeout } from 'ember-concurrency';
import { EKMixin, getCode, keyDown } from 'ember-keyboard';

const { Component, inject: { service }, computed, observer } = Ember;

export default Component.extend(EKMixin, {
  tagName: '',
  simon: service(),
  sequence: computed.alias('simon.sequence'),
  gameOver: computed.alias('simon.isGameOver'),

  animateMovement: task(function * (value) {
    let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    let animElement = Ember.$(`#btn-${value}`);

    Ember.$('body').addClass(`color-${value}`);
    animElement
      .addClass('simon-btn__active')
      .one(animationEnd, function() {
        animElement.removeClass('simon-btn__active');
        Ember.$('body').removeClass(`color-${value}`);
      });
    yield timeout(500);
    this.get('simon').checkMovement(value);
  }).enqueue(),

  didSequenceChange: observer('simon.sequence.[]', function() {
    this.get('onSequenceChange')();
  }),

  didGameOver: observer('simon.isGameOver', function() {
    this.get('onGameOver')();
  }),

  move: Ember.on(
    keyDown('KeyH'),
    keyDown('KeyJ'),
    keyDown('KeyK'),
    keyDown('KeyL'),
    keyDown('Enter'),
    function(e) {
      switch (getCode(e)) {
        case 'KeyH':
          this.get('animateMovement').perform(1);
          break;
        case 'KeyJ':
          this.get('animateMovement').perform(2);
          break;
        case 'KeyK':
          this.get('animateMovement').perform(3);
          break;
        case 'KeyL':
          this.get('animateMovement').perform(4);
          break;
      }
    }
  ),

  init() {
    this._super(...arguments);
    this.set('keyboardActivated', true);
  }
});
