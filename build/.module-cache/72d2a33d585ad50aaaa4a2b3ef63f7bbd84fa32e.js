/** @jsx React.DOM */

var Demo1 = React.createClass({displayName: 'Demo1',
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