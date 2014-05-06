/** @jsx React.DOM */

var Demo1 = React.createClass({displayName: 'Demo1',
  render: function() {
    return (
      React.DOM.p(null, 
        "Hello, ", React.DOM.input( {type:"text", placeholder:"Your name here"} ),"!"+' '+
        "It is ", this.props.date.toTimeString()
      )
    );
  }
});

setInterval(function() {
  React.renderComponent(
    HelloWorld( {date:new Date()} ),
    document.getElementById('demo1')
  );
}, 500);