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

setTimeout(function() {
  _.each(states, function(state, name){
    _.each(state, function(substate, name){

      var el = $('<div/>', {
        class: 'component-wrapper'
      });

      $('#wrapper').append(el);

      React.renderComponent(PrecallAutoSignin(null ), el);

    })
  })
}, 500);