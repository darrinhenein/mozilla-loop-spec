/** @jsx React.DOM */

var states = {
  precall: {}
};


var states = React.createClass({displayName: 'states',
  render: function() {
    return (
      React.DOM.div(null, 
        "Test demo."
      )
    );
  }
});

setInterval(function() {
  React.renderComponent(
    Demo1( {date:new Date()} ),
    document.getElementById('demo1')
  );
}, 500);