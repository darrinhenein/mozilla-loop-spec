/** @jsx React.DOM */
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var STRINGS = {
  viewAccount: "View Account",
  signIn: "Sign In",
  signOut: "Sign Out",
  changeUsername: "Change",
  loggedInUsername: "ally@gmail.com",
  loggedOutUsername: "Guest",
  newCallButton: "New Call"
};

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

var _animationDefaults = {
  duration: 200,
  easing: "easeInSine",
  queue: false
};

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
        React.DOM.h3( {className:"higher"}, React.DOM.span( {className:"counter"},  this.props.index + 1 ), " ",  this.props.name ),
        React.DOM.div( {className:"Toolbar"}),
        React.DOM.div( {className:"PanelWrapper"}, 
           this.props.children 
        )
      )
    )
  }
});

var TabBar = React.createClass({displayName: 'TabBar',
  render: function() {
    return (
      React.DOM.ul( {className:"TabBar"}, 
        React.DOM.li( {className:"active tip", 'data-tip':"Call Tab"}, React.DOM.i( {className:"fa fa-phone"})),
        React.DOM.li( {className:"tip", 'data-tip':"Call History Tab"}, React.DOM.i( {className:"fa fa-clock-o"})),
        React.DOM.li( {className:"tip", 'data-tip':"Invitation Revocation/Permissions Tab"}, React.DOM.i( {className:"fa fa-lock"}))
      )
    )
  }
});

var PanelGroup = React.createClass({displayName: 'PanelGroup',
  getInitialState: function() {
    return {
      isMoved: false
    }
  },
  slideTo: function(loc) {
    $(this.refs.slider.getDOMNode()).velocity({
      translateX: loc
    }, _animationDefaults);
  },
  toggle: function() {
    if(this.state.isMoved)
    {
      this.slideTo(0);
    }
    else {
      this.slideTo('-48%');
    }
    this.setState({
      isMoved: !this.state.isMoved
    });
  },
  componentDidMount: function() {
    var group = this;
    $(this.getDOMNode()).on('PanelGroup', function(event, data){
      switch(data.type) {
        case "toggle":
          group.toggle();
          break;

        case "back":
          group.slideTo(0);
          group.setState({
            isMoved: false
          });
          break;
      }
    });
  },
  componentWillUnmount: function() {
    $(this.getDOMNode()).off('PanelGroup::toggle');
  },
  render: function(){
    var isMoved = this.state.isMoved ? 'moved' : null;
    var classname = ["PanelGroup", isMoved].join(' ');
    return (
      React.DOM.div( {className:classname}, 
        React.DOM.div( {ref:"slider", className:"PanelGroupInner"}, 
          this.props.children
        )
      )
    )
  }
})

var Profile = React.createClass({displayName: 'Profile',
  onClick: function(){
    this.props.onClick(this.props.key);
  },
  render: function(){
    return (
      React.DOM.div( {onClick:this.onClick, className:["Profile", this.props.selected].join(' ')} , 
        React.DOM.div( {className:"avatar"}),
        React.DOM.div( {className:"details"}, 
          React.DOM.div( {className:"username"},  this.props.user.name ),
          React.DOM.div( {className:"email"},  this.props.user.email )
        ),
        React.DOM.div( {className:"icons"}, 
          React.DOM.i( {className: " fa fa-video-camera"}),
          React.DOM.i( {className: " fa fa-caret-down"})
        )
      )
    )
  }
})

var NewCallView = React.createClass({displayName: 'NewCallView',
  mixins: [React.addons.LinkedStateMixin],
  getTimeFromRange: function(position) {
    var minp = 1;
    var maxp = 100;

    var minv = Math.log(60);
    var maxv = Math.log(44640);

    var scale = (maxv-minv) / (maxp-minp);
    var scaled = Math.exp(minv + scale*(position-minp));

    var dur = moment.duration(scaled, 'minutes');
    if(dur.asMinutes() > 60*24)
    {
      var num = parseInt(dur.asDays(), 10);
      var plural = num > 1 ? 's' : '';
      return  num + ' day' + plural;
    } else {
      var num = parseInt(dur.asHours(), 10) + 1;
      var plural = num > 1 ? 's' : '';
      return  num + ' hour' + plural;
    }
  },
  getInitialState: function(){
    return {
      callDuration: 15,
      hasLink: false,
      callName: ''
    }
  },
  onClick: function() {
    if(this.state.callName == '') {
      $(this.refs.callerNameInput.getDOMNode()).addClass('error').focus();
      return;
    }
    this.setState({
      hasLink: true
    })
  },
  componentDidUpdate: function(){
    if(this.state.callName != '' && !this.state.hasLink) {
      $(this.refs.callerNameInput.getDOMNode()).removeClass('error');
    }
  },
  goBack: function(){
    $(this.getDOMNode()).trigger("PanelGroup", {type: "back"});
    this.cancelCall();
  },
  cancelCall: function() {
    this.setState({
      hasLink: false,
      callName: '',
      callDuration: 15
    });
  },
  render: function(){
    var linkSection;
    if(this.state.hasLink) {
      return (
        React.DOM.div( {className:"NewCallView"}, 
          BackButton( {onClick:this.goBack}),
          React.DOM.h3(null, "Share this link with ",  this.state.callName ),
          React.DOM.input( {value:"http://lo.op/nx3nd7h"}),
          React.DOM.h5(null, React.DOM.i( {className:"fa fa-clock-o"}), " Expires in ",  this.getTimeFromRange(this.state.callDuration) ),
          React.DOM.div( {className:"ButtonGroup"}, 
            Button( {text:"Copy", style:"default"}),
            Button( {text:"Share", style:"default"}),
            Button( {onClick:this.cancelCall, text:"Cancel", style:"cancel"})
          )
        )
      )
    } else {
      return (
        React.DOM.div( {className:"NewCallView"}, 
          BackButton( {onClick:this.goBack}),
          React.DOM.h3(null, "New Invitation"),
          React.DOM.input( {ref:"callerNameInput", valueLink:this.linkState('callName'), placeholder:"Who are you calling?"}),
          React.DOM.h5(null, React.DOM.i( {className:"fa fa-clock-o"}), " Invitation will expire in ",  this.getTimeFromRange(this.state.callDuration), "."),
          React.DOM.input( {valueLink:this.linkState('callDuration'), type:"range", name:"time", min:"1", max:"100"}),
          Button( {onClick:this.onClick, style:"action", text:"Get Link"})
        )
      )
    }
  }
});

var BackButton = React.createClass({displayName: 'BackButton',
  render: function(){
    return (
      React.DOM.div( {onClick:this.props.onClick, className:"BackButton"}, 
        React.DOM.i( {className:"fa fa-chevron-left"})
      )
    )
  }
});

var List = React.createClass({displayName: 'List',
  getInitialState: function(){
    return {
      filterText: '',
      selectedIndex: -1
    }
  },
  handleChange: function(){
    this.setState(
      {
        filterText: this.refs.filterSearchBar.getDOMNode().value,
        selectedIndex: 0
      }
    );
  },
  render: function(){
    var onClick = function(idx){
    this.setState(
      {
        selectedIndex: idx
      }
    );
    }.bind(this);

    var viewForItem = function(item, index){
      var isSelected = (this.state.selectedIndex === index) ? 'selected' : null;
      return Profile( {onClick:onClick, key:index, user:item, selected:isSelected} )
    }.bind(this);

    var shownItems = this.props.items;

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
      React.DOM.div( {className:"SearchBarWrapper"}, 
        React.DOM.input( {className:"SearchBar", value:this.props.val, onChange:this.props.handleChange, placeholder:"Search..."}),
        React.DOM.i( {className:"fa fa-book tip", 'data-tip':"Add, Import Contacts"})
      )
    )
  }
});

var Button = React.createClass({displayName: 'Button',
  render: function() {
    return (
      React.DOM.div( {onClick:this.props.onClick, className:"Button " + this.props.style },  this.props.text )
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
      callingAsText: STRINGS.callingAsText,
      editText: STRINGS.changeUsername,
      linkText: 'Sign In'
    }
  },
  onClick: function() {
    $(this.getDOMNode()).trigger('PanelGroup', {type: 'toggle'});
  },
  render: function(){
    return (
      React.DOM.div( {className:"Header"}, 
        React.DOM.h6(null, 
           this.props.callingAsText,  " ", React.DOM.span( {className:"bold"}, this.props.username),".",
          React.DOM.span( {className:"right"}, React.DOM.a(null, this.props.editText))
        ),
        Button( {text:STRINGS.newCallButton, style:"action", onClick:this.onClick})
      )
    )
  }
});

var Footer = React.createClass({displayName: 'Footer',
  render: function(){
    return (
      React.DOM.div( {className:"Footer tip", 'data-tip':"Sign in to Firefox Account (or other)"}, 
        this.props.linkText
      )
    )
  }
})

var PrecallNotSignedIn = React.createClass({displayName: 'PrecallNotSignedIn',
  render: function() {
    return (
        BaseState( {name: this.props.name,  index: this.props.index }, 
          TabBar(null),
          PanelGroup(null, 
            Panel( {items: this.props.items }, 
              Header( {username:STRINGS.loggedOutUsername, editText:STRINGS.changeUsername, slideTo:this.props.slideTo}),
              Footer( {linkText:STRINGS.signIn})
            ),
            Panel( {items: this.props.items }, 
               NewCallView(null)
            )
          )
        )
    );
  }
});

var PrecallSignedIn = React.createClass({displayName: 'PrecallSignedIn',
  render: function() {
    return (
        BaseState( {name: this.props.name,  index: this.props.index }, 
          TabBar(null),
          PanelGroup(null, 
            Panel( {items: this.props.items }, 
              Header( {username:STRINGS.loggedInUsername, editText:STRINGS.viewAccount}),
              List( {items:this.props.items} ),
              Footer( {linkText:STRINGS.signOut})
            ),
            Panel( {items: this.props.items }, 
               NewCallView(null)
            )
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
      $('.tip').tipr({
        mode: 'top',
        speed: 200
      });
  })
}, 100);