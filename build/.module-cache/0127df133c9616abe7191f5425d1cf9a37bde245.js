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
      React.DOM.div(null, "My name is ",  this.props.user.name )
    )
  }
})

var List = React.createClass({displayName: 'List',

  viewForItem: function(item){
    return Profile( {user:item} )
  },

  render: function(){
    return (
      React.DOM.ul(null,  " ", this.items.map(viewForItem))
    )
  }
})

var Panel = React.createClass({displayName: 'Panel',
  render: function() {
    return (
      List( {items:this.props.items} )
    )
  }
});

var PrecallAutoSignin = React.createClass({displayName: 'PrecallAutoSignin',
  render: function() {
    return (
      React.DOM.div(null, 
        Panel( {items: this.props.items } )
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

      React.renderComponent(state( {items:_users} ), el);
  })
}, 100);