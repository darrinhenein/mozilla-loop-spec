(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */
_users = require('./models/users.js');
STRINGS = require('./models/strings.js')
Utils = require('./utils/utils.js');
getTimeFromRange = Utils.getTimeFromRange;

PrecallNotSignedIn = require('./views/PrecallNotSignedIn.jsx');
PrecallSignedIn = require('./views/PrecallSignedIn.jsx');
CallHistory = require('./views/CallHistory.jsx');
InvitationManagement = require('./views/InvitationManagement.jsx');
InCallActive = require('./views/InCallActive.jsx');
ContactsDocked = require('./views/ContactsDocked.jsx');
IncomingCallView = require('./views/IncomingCallView.jsx');

var states = [
  {
    name: 'Precall - Not Signed In',
    view: PrecallNotSignedIn,
    tab: 0,
    slug: 'precall'
  },
  {
    name: 'Precall - Signed In',
    view: PrecallSignedIn,
    tab: 0,
    slug: 'precall-signedin'
  },
  {
    name: 'Call History',
    view: CallHistory,
    tab: 1,
    slug: 'callhistory'
  },
  {
    name: 'Invitation Management',
    view: InvitationManagement,
    tab: 2,
    slug: 'invitationlist'
  },
  {
    name: 'Contacts - Docked',
    view: ContactsDocked,
    tab: 0,
    slug: 'contacts-docked'
  },
  {
    name: 'In Call - Active',
    view: InCallActive,
    tab: 1,
    slug: 'call-active'
  },
  {
    name: 'Incoming Call',
    view: IncomingCallView,
    tab: 1,
    slug: 'call-incoming'
  }
];

setTimeout(function(){
  _.each(states, function(state, index){

      var el = $('<div/>', {
        class: 'component-wrapper',
        id: state.slug
      })[0];

      $('#wrapper').append(el);

      var View = state.view

      React.renderComponent(View( {items:_users, index:index, tab:state.tab, name:state.name} ), el);
      $('.tip').tipr({
        mode: 'top',
        speed: 200
      });
  })
}, 100);
},{"./models/strings.js":2,"./models/users.js":3,"./utils/utils.js":5,"./views/CallHistory.jsx":12,"./views/ContactsDocked.jsx":13,"./views/InCallActive.jsx":17,"./views/IncomingCallView.jsx":19,"./views/InvitationManagement.jsx":21,"./views/PrecallNotSignedIn.jsx":25,"./views/PrecallSignedIn.jsx":26}],2:[function(require,module,exports){
module.exports = {
  viewAccount: "View Account",
  signIn: "Sign In",
  signOut: "Sign Out",
  changeUsername: "Change",
  loggedInUsername: "ally@gmail.com",
  loggedOutUsername: "Guest",
  newCallButton: "New Invitation",
  callingAs: "Calling as",
  searchPlaceholder: "Search...",
  getLinkText: "Get Link",
  callNamePlaceholder: "Who are you calling?",
  inviteExpireIn: "Invitation will expire in",
  sampleCallURL: "http://lo.op/nx3nd7h",
  shareThisLinkWith: "Share this link with",
  callHistory: "Call History",
  clearHistory: "Clear",
  invitationList: "Your Invitations",
  expired: "Expired",
  endCall: "Hang Up"
};
},{}],3:[function(require,module,exports){
module.exports = [
  {
    name: 'Ally Avocado',
    email: 'ally@mail.com',
    index: 0
  },
  {
    name: 'Bob Banana',
    email: 'bob@gmail.com',
    index: 1
  },
  {
    name: 'Caitlin Cantaloupe',
    email: 'caitlin.cant@hotmail.com',
    index: 2
  },
  {
    name: 'Dave Dragonfruit',
    email: 'dd@dragons.net',
    index: 3
  },
  {
    name: 'Ellie Eggplant',
    email: 'ellie@yahoo.com',
    index: 4
  }
];
},{}],4:[function(require,module,exports){
module.exports = {
  animation: {
    duration: 200,
    easing: "easeInSine",
    queue: false
  }
}


},{}],5:[function(require,module,exports){
module.exports = {

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
  }

}


},{}],6:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  render: function(){
    return (
      React.DOM.div( {onClick:this.props.onClick, className:"BackButton"}, 
        React.DOM.i( {className:"fa fa-chevron-left"})
      )
    )
  }
});
},{}],7:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
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
        React.DOM.div( {className:"Toolbar"}, React.DOM.i( {className:"fa fa-comment-o"})),
        React.DOM.div( {className:"PanelWrapper"}, 
           this.props.children 
        )
      )
    )
  }
});
},{}],8:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
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
        React.DOM.div( {className:"Browser"}, 
          React.DOM.div( {className:"WindowWrapper"}, 
             this.props.children 
          )
        )
      )
    )
  }
});
},{}],9:[function(require,module,exports){
/** @jsx React.DOM */
SearchBar = require('./SearchBar.jsx');
Profile = require('./Profile.jsx');

module.exports = React.createClass({displayName: 'exports',
  getInitialState: function(){
    return {
      filterText: '',
      selectedIndex: -1
    }
  },
  handleChange: function(){
    this.setState(
      {
        filterText: this.refs.filterSearchBar.refs.searchInput.getDOMNode().value,
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
         shownItems.map(viewForItem)
        )
      )
    )
  }
});
},{"./Profile.jsx":27,"./SearchBar.jsx":28}],10:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
      React.DOM.div( {onClick:this.props.onClick, className:"Button " + this.props.style },  this.props.text )
    )
  }
});
},{}],11:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  render: function(){
    return (
      React.DOM.div( {className:"CallControls"}, 
       React.DOM.i( {className:"button end"}, STRINGS.endCall),
       React.DOM.i( {className:"button active fa fa-video-camera"}),
       React.DOM.i( {className:"button fa fa-volume-up"}),
       React.DOM.span( {className:"right"}, "2:45")
      )
    )
  }
});
},{}],12:[function(require,module,exports){
/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
HistoryList = require('./HistoryList.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseState( {name: this.props.name,  index: this.props.index }, 
          TabBar( {selected:this.props.tab} ),
          Panel( {items: this.props.items }, 
            HistoryList(null)
          )
        )
    );
  }
});

},{"./BaseState.jsx":7,"./HistoryList.jsx":16,"./Panel.jsx":23,"./TabBar.jsx":31}],13:[function(require,module,exports){
/** @jsx React.DOM */
BaseStateCorner = require('./BaseStateCorner.jsx');
BuddyList = require('./BuddyList.jsx');
Window = require('./Window.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseStateCorner( {name: this.props.name,  index: this.props.index }, 
          Window( {items: this.props.items,  title:"Contacts"}, 
            BuddyList( {items:this.props.items} )
          )
        )
    );
  }
});
},{"./BaseStateCorner.jsx":8,"./BuddyList.jsx":9,"./Window.jsx":33}],14:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  render: function(){
    return (
      React.DOM.div( {className:"Footer tip", 'data-tip':"Sign in to Firefox Account (or other)"}, 
        this.props.linkText
      )
    )
  }
})

},{}],15:[function(require,module,exports){
/** @jsx React.DOM */
Button = require('./Button.jsx');

module.exports = React.createClass({displayName: 'exports',
  getDefaultProps: function(){
    return {
      username: STRINGS.loggedOutUsername,
      callingAsText: STRINGS.callingAs,
      editText: STRINGS.changeUsername,
      linkText: STRINGS.signIn
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

},{"./Button.jsx":10}],16:[function(require,module,exports){
/** @jsx React.DOM */
SmallProfile = require('./SmallProfile.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function(){
    return (
      React.DOM.div( {className:"HistoryList"}, 
        React.DOM.div( {className:"Header"}, 
          React.DOM.div(null, STRINGS.callHistory),
          React.DOM.div( {className:"Button"}, STRINGS.clearHistory)
        ),
        React.DOM.ul( {className:"CallHistory"}, 
          _.range(10).map(function(i){
            var u = _.random(0, _users.length -1);
            var callType = _.random(0, 1) === 1 ? 'incoming' : 'outgoing';
            var missed = _.random(0, 3) === 1 ? 'missed' : 'accepted';
            var icon, callIcon;
            if(missed === 'missed') {
              icon = React.DOM.i( {className:"fa fa-times-circle"})
            } else {
              icon = React.DOM.i( {className:"fa fa-phone"})
            }
            if(callType === 'incoming') {
              callIcon = React.DOM.i( {'data-tip':"Incoming (" + missed + ")", className:"fa tip fa-arrow-right"})
            } else {
              callIcon = React.DOM.i( {'data-tip':"Outgoing (" + missed + ")", className:"fa tip fa-arrow-left"})
            }
            return (
              React.DOM.li( {key:"CallerHistory" + i, className:[callType, missed].join(' ')}, 
                callIcon,
                SmallProfile( {user:_users[u]} ),
                React.DOM.div( {className:"CallDetails right"}, 
                  "May 3 4:32pm"
                )
              )
            )
          })
        )
      )
    )
  }
});
},{"./SmallProfile.jsx":29}],17:[function(require,module,exports){
/** @jsx React.DOM */
BaseStateCorner = require('./BaseStateCorner.jsx');
Window = require('./Window.jsx');
VideoCall = require('./VideoCall.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseStateCorner( {name: this.props.name,  index: this.props.index }, 
          Window( {items: this.props.items,  title:"Aubrey Drake Graham"}, 
            VideoCall(null )
          )
        )
    );
  }
});
},{"./BaseStateCorner.jsx":8,"./VideoCall.jsx":32,"./Window.jsx":33}],18:[function(require,module,exports){
/** @jsx React.DOM */
Button = require('./Button.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function(){
    return (
      React.DOM.div( {className:"IncomingCall"}, 
        React.DOM.div( {className:"avatar"}),
        React.DOM.h3(null, "Aubrey Drake Graham"),
        React.DOM.div( {className:"ButtonGroup"}, 
          Button( {text:"Ignore", style:"cancel"}),
          Button( {text:"Answer", style:"action"})
        )
      )
    )
  }
});
},{"./Button.jsx":10}],19:[function(require,module,exports){
/** @jsx React.DOM */
BaseStateCorner = require('./BaseStateCorner.jsx');
Window = require('./Window.jsx');
IncomingCall = require('./IncomingCall.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseStateCorner( {name: this.props.name,  index: this.props.index }, 
          Window( {items: this.props.items,  title:"Call from Aubrey Drake Graham", type:""}, 
            IncomingCall(null )
          )
        )
    );
  }
});

},{"./BaseStateCorner.jsx":8,"./IncomingCall.jsx":18,"./Window.jsx":33}],20:[function(require,module,exports){
/** @jsx React.DOM */
var Invitation = React.createClass({displayName: 'Invitation',
  render: function() {

    if(this.props.invite.isActive){
      var divStyle = {
        width: this.props.invite.completed*90 + '%'
      }
      return (
        React.DOM.li( {className:"Invitation active"}, 
          React.DOM.h3(null, this.props.invite.email, " ", React.DOM.small(null, "http://lo.op/8dj8d38")),
          React.DOM.div( {className:"expiryInfo"}, 
            React.DOM.h5(null, 
              React.DOM.small(null, "3:51pm May 12, 2014")
            ),
            React.DOM.div(null, 
              React.DOM.div( {className:"progressWrapper"}, 
                React.DOM.div( {className:"progressBar", style:divStyle})
              ),
              React.DOM.h5( {className:"align-right"}, React.DOM.i( {className:"fa fa-clock-o"}), " ", getTimeFromRange(this.props.invite.totalTime), " left.")
            )
          ),
          React.DOM.div( {className:"icons right"}, 
            "Revoke Invitation"
          )
        )
      )
    } else {
      return (
        React.DOM.li( {className:"Invitation expired"}, 
          React.DOM.h3(null, this.props.invite.email),
          React.DOM.div( {className:"expiryInfo"}, 
            React.DOM.h5(null, STRINGS.expired,".")
          )
        )
      )
    }
  }
});

module.exports = React.createClass({displayName: 'exports',
  render: function(){
    var invites = _.sortBy(_.range(5).map(function(i){
      var u = _.random(0, _users.length -1);
      var isActive = _.random(0, 3) === 1 ? false : true;
      var time = _.random(0, 100);
      var completed = Math.random();
      return _.extend(_users[u], {
        totalTime: time,
        completed: completed,
        isActive: isActive
      });
    }), function(invite){
      return !invite.isActive;
    });

    var inviteView = function(inv, index){
      return (Invitation( {key:"Invite" + index, invite:inv} ))
    }.bind(this);

    return (
      React.DOM.div( {className:"InvitationList"}, 
        React.DOM.div( {className:"Header"}, 
          React.DOM.div(null, STRINGS.invitationList)
        ),
        React.DOM.ul( {className:"Invitations"}, 
           invites.map(inviteView) 
        )
      )
    )
  }
});
},{}],21:[function(require,module,exports){
/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
InvitationList = require('./InvitationList.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseState( {name: this.props.name,  index: this.props.index }, 
          TabBar( {selected:this.props.tab} ),
          Panel( {items: this.props.items }, 
            InvitationList(null)
          )
        )
    );
  }
});

},{"./BaseState.jsx":7,"./InvitationList.jsx":20,"./Panel.jsx":23,"./TabBar.jsx":31}],22:[function(require,module,exports){
/** @jsx React.DOM */
SpinnerView = require('./SpinnerView.jsx');
BackButton = require('./BackButton.jsx');
Button = require('./Button.jsx');
var linkGenerationTime = 1000;

module.exports= React.createClass({displayName: 'exports',
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function(){
    return {
      callDuration: 15,
      hasLink: false,
      gettingLink: false,
      callName: ''
    }
  },
  onClick: function() {
    if(this.state.callName == '') {
      $(this.refs.callerNameInput.getDOMNode()).addClass('error').focus();
      return;
    }
    var view = this;
    view.setState({
      gettingLink: true
    });
    this.timer = setTimeout(function(){
      view.setState({
        hasLink: true,
        gettingLink: false
      });
    }, linkGenerationTime);
  },
  componentDidUpdate: function(){
    if(this.state.callName != '' && !this.state.hasLink && !this.state.gettingLink) {
      $(this.refs.callerNameInput.getDOMNode()).removeClass('error');
    }
  },
  goBack: function(){
    $(this.getDOMNode()).trigger("PanelGroup", {type: "back"});
    this.cancelCall();
  },
  cancelCall: function() {
    clearTimeout(this.timer);
    this.setState({
      hasLink: false,
      gettingLink: false,
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
          React.DOM.h3(null, STRINGS.shareThisLinkWith, " ",  this.state.callName ),
          React.DOM.input( {value:STRINGS.sampleCallURL}),
          React.DOM.h5(null, React.DOM.i( {className:"fa fa-clock-o"}), " Expires in ",  getTimeFromRange(this.state.callDuration) ),
          React.DOM.div( {className:"ButtonGroup"}, 
            Button( {text:"Copy", style:"default"}),
            Button( {text:"Share", style:"default"}),
            Button( {onClick:this.cancelCall, text:"Cancel", style:"cancel"})
          )
        )
      )
    } else if (this.state.gettingLink) {
      return (
        React.DOM.div( {className:"NewCallView"}, 
          BackButton( {onClick:this.goBack}),
          React.DOM.h3( {className:"center"}, "Generating Invitation for ",  this.state.callName ),
          SpinnerView(null ),
          Button( {onClick:this.cancelCall, text:"Cancel", style:"cancel"})
        )
      )
    } else {
      return (
        React.DOM.div( {className:"NewCallView"}, 
          BackButton( {onClick:this.goBack}),
          React.DOM.h3(null, "New Invitation"),
          React.DOM.input( {ref:"callerNameInput", valueLink:this.linkState('callName'), placeholder:STRINGS.callNamePlaceholder}),
          React.DOM.h5(null, React.DOM.i( {className:"fa fa-clock-o"}), " ", STRINGS.inviteExpireIn, " ",  getTimeFromRange(this.state.callDuration), "."),
          React.DOM.input( {valueLink:this.linkState('callDuration'), type:"range", name:"time", min:"1", max:"100"}),
          Button( {onClick:this.onClick, style:"action", text:STRINGS.getLinkText})
        )
      )
    }
  }
});
},{"./BackButton.jsx":6,"./Button.jsx":10,"./SpinnerView.jsx":30}],23:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
      React.DOM.div( {className:"Panel"}, 
         this.props.children 
      )
    )
  }
});
},{}],24:[function(require,module,exports){
/** @jsx React.DOM */

_animationDefaults = require('../utils/defaults.js').animation;

module.exports = React.createClass({displayName: 'exports',
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
},{"../utils/defaults.js":4}],25:[function(require,module,exports){
/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
PanelGroup = require('./PanelGroup.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
Header = require('./Header.jsx');
Footer = require('./Footer.jsx');
NewCallView = require('./NewCallView.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseState( {name: this.props.name,  index: this.props.index }, 
          TabBar( {selected:this.props.tab} ),
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
},{"./BaseState.jsx":7,"./Footer.jsx":14,"./Header.jsx":15,"./NewCallView.jsx":22,"./Panel.jsx":23,"./PanelGroup.jsx":24,"./TabBar.jsx":31}],26:[function(require,module,exports){
/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
PanelGroup = require('./PanelGroup.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
Header = require('./Header.jsx');
Footer = require('./Footer.jsx');
NewCallView = require('./NewCallView.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseState( {name: this.props.name,  index: this.props.index }, 
          TabBar( {selected:this.props.tab} ),
          PanelGroup(null, 
            Panel( {items: this.props.items }, 
              Header( {username:STRINGS.loggedInUsername, editText:STRINGS.viewAccount}),
              BuddyList( {items:this.props.items} ),
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
},{"./BaseState.jsx":7,"./Footer.jsx":14,"./Header.jsx":15,"./NewCallView.jsx":22,"./Panel.jsx":23,"./PanelGroup.jsx":24,"./TabBar.jsx":31}],27:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  getInitialState: function() {
    return {
      isDropdownVisible: false
    }
  },
  onClick: function(){
    this.props.onClick(this.props.key);
  },
  hideDropdown: function() {
    $(this.refs.callDropdown.getDOMNode()).hide();
    this.setState({
      isDropdownVisible: false
    });
  },
  toggleDropdown: function(){
    if(this.state.isDropdownVisible) {
      $(this.refs.callDropdown.getDOMNode()).hide();
    } else {
      $(this.refs.callDropdown.getDOMNode()).show();
    }
    this.setState({
      isDropdownVisible: !this.state.isDropdownVisible
    });
  },
  render: function(){
    return (
      React.DOM.div( {onClick:this.onClick, className:["Profile", this.props.selected].join(' ')} , 
        React.DOM.div( {className:"avatar user-" + this.props.user.index}),
        React.DOM.div( {className:"details"}, 
          React.DOM.div( {className:"username"},  this.props.user.name ),
          React.DOM.div( {className:"email"},  this.props.user.email )
        ),
        React.DOM.div( {className:"icons", onClick:this.toggleDropdown}, 
          React.DOM.i( {className:"fa fa-video-camera"}),
          React.DOM.i( {className:"fa fa-caret-down"})
        ),
        React.DOM.ul( {ref:"callDropdown", onMouseLeave:this.hideDropdown, className:"Dropdown"}, 
          React.DOM.li(null, React.DOM.i( {className:"fa fa-video-camera"}),"Video Call"),
          React.DOM.li(null, React.DOM.i( {className:"fa fa-phone"}),"Audio Call"),
          React.DOM.li(null, React.DOM.i( {className:"fa fa-user"}),"Edit Contact..."),
          React.DOM.li(null, React.DOM.i( {className:"fa fa-trash-o"}),"Remove Contact")
        )
      )
    )
  }
})
},{}],28:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  render: function(){
    return (
      React.DOM.div( {className:"SearchBarWrapper"}, 
        React.DOM.input( {ref:"searchInput", className:"SearchBar", value:this.props.val, onChange:this.props.handleChange, placeholder:STRINGS.searchPlaceholder}),
        React.DOM.i( {className:"fa fa-book tip", 'data-tip':"Add, Import Contacts"})
      )
    )
  }
});

},{}],29:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  onClick: function(){
    this.props.onClick(this.props.key);
  },
  render: function(){
    return (
      React.DOM.div( {onClick:this.onClick, className:["SmallProfile", "Profile", this.props.selected].join(' ')} , 
        React.DOM.div( {className:"avatar user-" + this.props.user.index}),
        React.DOM.div( {className:"details"}, 
          React.DOM.div( {className:"username"},  this.props.user.name ),
          React.DOM.div( {className:"email"},  this.props.user.email )
        )
      )
    )
  }
})

},{}],30:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  componentDidMount: function(){
    var target = this.getDOMNode();
    var spinner = new Spinner({
      color: '#999',
      width: 4,
      lines: 13,
      corners: 1.0,
      trail: 60
    }).spin(target);
  },
  render: function(){
    return (
      React.DOM.div( {className:"SpinnerView"})
    )
  }
});
},{}],31:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
      React.DOM.ul( {className:"TabBar"}, 
        React.DOM.li( {className:(this.props.selected === 0) ? 'active tip' : 'tip', 'data-tip':"Call Tab"}, 
          React.DOM.a( {href:"#precall"}, React.DOM.i( {className:"fa fa-phone"}))
        ),
        React.DOM.li( {className:(this.props.selected === 1) ? 'active tip' : 'tip', 'data-tip':"Call History Tab"}, 
          React.DOM.a( {href:"#callhistory"}, React.DOM.i( {className:"fa fa-clock-o"}))
        ),
        React.DOM.li( {className:(this.props.selected === 2) ? 'active tip' : 'tip', 'data-tip':"Invitation Revocation/Permissions Tab"}, 
          React.DOM.a( {href:"#invitationlist"}, React.DOM.i( {className:"fa fa-link"}))
        )
      )
    )
  }
});
},{}],32:[function(require,module,exports){
/** @jsx React.DOM */
CallControls = require('./CallControls.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function(){
    return (
      React.DOM.div( {className:"VideoCall"}, 
        CallControls(null),
        React.DOM.div( {className:"VideoScreen"}, 
          React.DOM.div( {className:"VideoScreenInner"}
          )
        )
      )
    )
  }
});

},{"./CallControls.jsx":11}],33:[function(require,module,exports){
/** @jsx React.DOM */
var WindowTitlebar = React.createClass({displayName: 'WindowTitlebar',
  render: function(){
    return (
      React.DOM.div( {className:"WindowTitlebar " + this.props.type}, 
        React.DOM.h5(null, this.props.title),
        React.DOM.div( {className:"WindowControls"}
        )
      )
    )
  }
});

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
      React.DOM.div( {className:"Window"}, 
        WindowTitlebar( {title:this.props.title, type:this.props.type}),
        React.DOM.div( {className:"WindowBody"}, 
           this.props.children 
        )
      )
    )
  }
});

},{}]},{},[1])