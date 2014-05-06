/** @jsx React.DOM */

var states = {
  precall: {}
};

states.precall['auto-sign-in'] = React.createClass({
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

      React.renderComponent(state(null ), el);

    })
  })
}, 500);