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

var Button = React.createClass({displayName: 'Button',
  render: function() {
    return (
      React.DOM.div( {className:"Button"},  this.props.text )
    )
  }
});

var Panel = React.createClass({displayName: 'Panel',
  render: function() {
    return (
      React.DOM.div( {className:"Panel"}, 
         this.props.children 
      )
    )
  }
});

var Header = React.createClass({displayName: 'Header',
  getDefaultProps: function(){
    return {
      username: 'Guest',
      callingAsText: 'Calling as',
      linkText: 'Sign in'
    }
  },
  render: function(){
    return (
      React.DOM.div( {className:"header"}, 
        React.DOM.h6(null, 
           this.props.callingAsText,  " ", React.DOM.span( {className:"bold"}, this.props.username),
          React.DOM.span( {className:"right"}, React.DOM.a(null, this.props.linkText))
        ),
        Button( {text:"New Video Call"} )
      )
    )
  }
});

var BaseState = React.createClass({displayName: 'BaseState',
  getDefaultProps: function(){
    return {
      name: 'Base State'
    }
  },
  render: function(){
    return (
      React.DOM.div(null,  this.props.children )
    )
  }
});

var PrecallAutoSignin = React.createClass({displayName: 'PrecallAutoSignin',
  render: function() {
    return (
        BaseState( {name: this.props.name }, 
          Panel( {items: this.props.items }, 
            Header(null ),
            List( {items:this.props.items} )
          )
        )
    );
  }
});

var states = [
  {
    name: 'Precall',
    view: PrecallAutoSignin
  }
];

setTimeout(function() {
  _.each(states, function(state){
      var el = $('<div/>', {
        class: 'component-wrapper'
      })[0];

      $('#wrapper').append(el);

      var View = state.view

      React.renderComponent(View( {items:_users, name:state.name} ), el);
  })
}, 100);