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
      React.DOM.div( {className:"Profile"},  this.props.user.name )
    )
  }
})

var List = React.createClass({displayName: 'List',
  render: function(){

    viewForItem = function(item, index){
      return Profile( {key:index, user:item} )
    };

    return (
      React.DOM.ul( {className:"List"},  " ", this.props.items.map(viewForItem))
    )
  }
})

var Panel = React.createClass({displayName: 'Panel',
  getDefaultProps: function(){
    return {
      username: 'Guest',
      callingAsText: 'Calling as'
    }
  },
  render: function() {
    return (
      React.DOM.div( {className:"Panel"}, 
        React.DOM.div( {className:"header"},  this.props.callingAsText,  " ", React.DOM.span(null, this.props.username)),
        List( {items:this.props.items} )
      )
    )
  }
});

var PrecallAutoSignin = React.createClass({displayName: 'PrecallAutoSignin',
  render: function() {
    return (
      React.DOM.div(null, 
        Panel( {items: this.props.items })
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