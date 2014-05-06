/** @jsx React.DOM */
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

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
  },
  {
    name: 'Dave Dragonfruit',
    email: 'dd@dragons.net'
  },
  {
    name: 'Ellie Eggplant',
    email: 'ellie@yahoo.com'
  }
];

var BaseState = React.createClass({displayName: 'BaseState',
  getDefaultProps: function(){
    return {
      name: 'Base State',
      children: [],
      index: 1
    }
  },
  render: function(){
    return (
      React.DOM.div( {className:"StateWrapper"}, 
        React.DOM.h3(null, React.DOM.span( {className:"counter"},  this.props.index + 1 ), " ",  this.props.name ),
        React.DOM.div( {className:"Toolbar"}),
        React.DOM.div(null,  this.props.children )
      )
    )
  }
});

var Profile = React.createClass({displayName: 'Profile',
  render: function(){
    return (
      React.DOM.div( {onClick:this.props.onClick(this.props.key), className:["Profile", this.props.selected].join(' ')} , 
        React.DOM.div( {className:"avatar"}),
        React.DOM.div( {className:"details"}, 
          React.DOM.div( {className:"username"},  this.props.user.name ),
          React.DOM.div( {className:"email"},  this.props.user.email )
        ),
        React.DOM.div( {className:"icons"}, React.DOM.i( {className: " fa fa-video-camera"}))
      )
    )
  }
})

var List = React.createClass({displayName: 'List',
  getInitialState: function(){
    return {
      filterText: '',
      selectedIndex: 0
    }
  },
  handleChange: function(){
    this.setState(
      {
        filterText: this.refs.filterSearchBar.getDOMNode().value
      }
    );
  },
  render: function(){
    var onClick = function(index){
      console.log('hello');
    }.bind(this);

    var viewForItem = function(item, index){
      var isSelected = (this.state.selectedIndex === index) ? 'selected' : null;
      return Profile( {onClick:onClick, key:index, user:item, selected:isSelected} )
    }.bind(this);

    var  shownItems = this.props.items;

    if(this.state.filterText !== '')
    {
      var filter = this.state.filterText.toUpperCase();
      shownItems = _.filter(this.props.items, function(i){
        return (i.name.toUpperCase().indexOf(filter) !== -1)
      });
    }

    return (
      React.DOM.div( {className:"List"}, 
        SearchBar( {ref:"filterSearchBar", val:this.state.filterText, handleChange:this.handleChange} ),
        React.DOM.ul( {className:"scrollable"}, 
        ReactCSSTransitionGroup( {transitionName:"button-animation"}, 
         shownItems.map(viewForItem)
         )
        )
      )
    )
  }
});

var SearchBar = React.createClass({displayName: 'SearchBar',
  render: function(){
    return (
      React.DOM.input( {className:"SearchBar", value:this.props.val, onChange:this.props.handleChange.bind(null,this), placeholder:"Search..."})
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
      editText: 'Change',
      linkText: 'Sign In'
    }
  },
  render: function(){
    return (
      React.DOM.div( {className:"Header"}, 
        React.DOM.h6(null, 
           this.props.callingAsText,  " ", React.DOM.span( {className:"bold"}, this.props.username),".",
          React.DOM.span( {className:"right"}, React.DOM.a(null, this.props.editText))
        ),
        Button( {text:"New Video Call", style:"action"})
      )
    )
  }
});

var Footer = React.createClass({displayName: 'Footer',
  render: function(){
    return (
      React.DOM.div( {className:"Footer"}, 
        this.props.linkText
      )
    )
  }
})

var PrecallNotSignedIn = React.createClass({displayName: 'PrecallNotSignedIn',
  render: function() {
    return (
        BaseState( {name: this.props.name,  index: this.props.index }, 
          Panel( {items: this.props.items }, 
            Header( {username:"Guest", editText:"Change"}),
            Footer( {linkText:"Sign In"})
          )
        )
    );
  }
});

var PrecallSignedIn = React.createClass({displayName: 'PrecallSignedIn',
  render: function() {
    return (
        BaseState( {name: this.props.name,  index: this.props.index }, 
          Panel( {items: this.props.items }, 
            Header( {username:"Ally", editText:"View Profile"}),
            List( {items:this.props.items} ),
            Footer( {linkText:"Sign Out"})
          )
        )
    );
  }
});

var states = [
  {
    name: 'Precall - Not Signed In',
    view: PrecallNotSignedIn
  },
  {
    name: 'Precall - Signed In',
    view: PrecallSignedIn
  }
];

setTimeout(function() {
  _.each(states, function(state, index){
      var el = $('<div/>', {
        class: 'component-wrapper'
      })[0];

      $('#wrapper').append(el);

      var View = state.view

      React.renderComponent(View( {items:_users, index:index, name:state.name} ), el);
  })
}, 100);