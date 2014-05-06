/** @jsx React.DOM */

var _users = [
  {
    name: 'Ally Avocado',
    email: 'ally@mail.com'
  },
  {
    name: 'Bob Banana',
    email: 'bob@gmail.com'
  },
  {
    name: 'Caitlin Cantaloupe',
    email: 'caitlin.cant@hotmail.com'
  }
];

var Profile = React.createClass({displayName: 'Profile',
  render: function(){
    return (
      React.DOM.div( {className:"Profile"}, 
        React.DOM.div( {className:"avatar"}),
        React.DOM.div( {className:"details"}, 
          React.DOM.div( {className:"username"},  this.props.user.name ),
          React.DOM.div( {className:"email"},  this.props.user.email )
        )
      )
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
});

var SearchBar = React.createClass({displayName: 'SearchBar',
  render: function(){
    return (
      React.DOM.input( {className:"SearchBar", value:"Search..."})
    )
  }
})

var Button = React.createClass({displayName: 'Button',
  render: function() {
    return (
      React.DOM.div( {className:"Button " + this.props.style },  this.props.text )
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
      linkText: 'Sign In'
    }
  },
  render: function(){
    return (
      React.DOM.div( {className:"header"}, 
        React.DOM.h6(null, 
           this.props.callingAsText,  " ", React.DOM.span( {className:"bold"}, this.props.username),".",
          React.DOM.span( {className:"right"}, React.DOM.a(null, "Change"), " or ", React.DOM.a(null, this.props.linkText))
        ),
        Button( {text:"New Video Call", style:"action"}),
        SearchBar(null)
      )
    )
  }
});

var BaseState = React.createClass({displayName: 'BaseState',
  getDefaultProps: function(){
    return {
      name: 'Base State',
      children: []
    }
  },
  render: function(){
    return (
      React.DOM.div( {className:"StateWrapper"}, 
        React.DOM.h3(null,  this.props.name ),
        React.DOM.div(null,  this.props.children )
      )
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