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
      React.DOM.div( {class:"Profile"},  this.props.user.name )
    )
  }
})

var List = React.createClass({displayName: 'List',
  render: function(){

    viewForItem = function(item){
      return Profile( {user:item} )
    };

    return (
      React.DOM.ul( {class:"List"},  " ", this.props.items.map(viewForItem))
    )
  }
})

var Panel = React.createClass({displayName: 'Panel',
  render: function() {
    return (
      React.DOM.div( {class:"Panel"}, 
        List( {items:this.props.items} )
      )
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