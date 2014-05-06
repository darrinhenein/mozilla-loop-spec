/** @jsx React.DOM */

var _users = [
  {
    name: 'Ally Avocado'
  },
  {
    name: 'Bob Banana'
  },
  {
    name: 'Caitlin Cantaloupe'
  }
];

var Profile = React.createClass({displayName: 'Profile',
  render: function(){
    return (
      React.DOM.div(null,  this.props.name )
    )
  }
})

var Panel = React.createClass({displayName: 'Panel',
  render: function() {
    return (
      Profile( {name: this.props.name } )
    )
  }
});

var PrecallAutoSignin = React.createClass({displayName: 'PrecallAutoSignin',
  render: function() {
    return (
      React.DOM.div(null, 
        Panel( {name: this.props.users[0].name } )
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

      React.renderComponent(state( {users:_users} ), el);
  })
}, 100);