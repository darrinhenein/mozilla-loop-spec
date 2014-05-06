/** @jsx React.DOM */

var PrecallAutoSignin = React.createClass({displayName: 'PrecallAutoSignin',
  render: function() {
    return (
      React.DOM.div(null, 
        "Test demo."
      )
    );
  }
});

var states = [
  PrecallAutoSignin,
];

setTimeout(function() {
  _.each(states, function(state, name){
      var el = $('<div/>', {
        class: 'component-wrapper'
      })[0];

      $('#wrapper').append(el);

      React.renderComponent(state(null ), el);
  })
}, 100);