(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @jsx React.DOM */
_users = require('./models/users.js');
STRINGS = require('./models/strings.js')
Utils = require('./utils/utils.js');
getTimeFromRange = Utils.getTimeFromRange;
TableOfContents = require('./views/TableOfContents.jsx');

PrecallNotSignedIn = require('./views/PrecallNotSignedIn.jsx');
PrecallNotSignedInQuick = require('./views/PrecallNotSignedInQuick.jsx');
PrecallNotSignedInFirstRun = require('./views/PrecallNotSignedInFirstRun.jsx');
PrecallSignedIn = require('./views/PrecallSignedIn.jsx');
PrecallSignedInQuick = require('./views/PrecallSignedInQuick.jsx');
CallHistory = require('./views/CallHistory.jsx');
InvitationManagement = require('./views/InvitationManagement.jsx');
InCallActive = require('./views/InCallActive.jsx');
InCallActiveAudio = require('./views/InCallActiveAudio.jsx');
ContactsDocked = require('./views/ContactsDocked.jsx');
ContactsView = require('./views/ContactsView.jsx');
IncomingCallView = require('./views/IncomingCallView.jsx');
OutgoingCallView = require('./views/OutgoingCallView.jsx');

moment.lang('en', {
  calendar : {
    lastDay : '[Yesterday at] LT',
    sameDay : '[Today at] LT',
    nextDay : '[Tomorrow at] LT',
    lastWeek : 'l [at] LT',
    nextWeek : 'l [at] LT',
    sameElse : 'L'
  }
});

var states = [
  {
    name: 'Precall (First Run)',
    view: PrecallNotSignedInFirstRun,
    tab: 0,
    slug: 'precall-firstrun'
  },
  {
    name: 'Precall (Not Signed In)',
    view: PrecallNotSignedInQuick,
    tab: 0,
    slug: 'precall'
  },
  {
    name: 'Precall (Signed In)',
    view: PrecallSignedInQuick,
    tab: 0,
    slug: 'precall-signedin'
  },
  {
    name: 'Contacts',
    view: ContactsView,
    tab: 2,
    slug: 'contacts'
  },
  {
    name: 'Call History',
    view: CallHistory,
    tab: 1,
    slug: 'callhistory'
  },
  {
    name: 'In Call (Video)',
    view: InCallActive,
    tab: 1,
    slug: 'call-active'
  },
  {
    name: 'In Call (Audio)',
    view: InCallActiveAudio,
    tab: 1,
    slug: 'call-active-audio'
  },
  {
    name: 'Incoming Call',
    view: IncomingCallView,
    tab: 1,
    slug: 'call-incoming'
  },
  {
    name: 'Outgoing Call',
    view: OutgoingCallView,
    tab: 1,
    slug: 'call-outgoing'
  }
];

setTimeout(function(){
  React.renderComponent(TableOfContents( {items:states} ), $('#toc')[0]);
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

      $('.TableOfContents').ddscrollSpy({
        scrollduration: 0
      });

  })
}, 100);

},{"./models/strings.js":2,"./models/users.js":3,"./utils/utils.js":5,"./views/CallHistory.jsx":13,"./views/ContactsDocked.jsx":14,"./views/ContactsView.jsx":15,"./views/InCallActive.jsx":20,"./views/InCallActiveAudio.jsx":21,"./views/IncomingCallView.jsx":23,"./views/InvitationManagement.jsx":25,"./views/OutgoingCallView.jsx":29,"./views/PrecallNotSignedIn.jsx":32,"./views/PrecallNotSignedInFirstRun.jsx":33,"./views/PrecallNotSignedInQuick.jsx":34,"./views/PrecallSignedIn.jsx":35,"./views/PrecallSignedInQuick.jsx":36,"./views/TableOfContents.jsx":43}],2:[function(require,module,exports){
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
  callNamePlaceholder: "Orange Prickly Badger",
  inviteExpireIn: "Invitation will expire in",
  sampleCallURL: "http://loop.dev.mozaws.net/calls/IRzK5l843AxgKTorMKh7XmhR0QzkSNvuVJVD7ZWpeYjzVWe6BhRPYfd6M5mdTDguvP0QXO0pnd-Ac23-ufDtoKUkvaIUZ8FSo5AHU0FBXqwtO6_ZFSwL1mX3brGHICs6xfCfJ6X0zRVRR-bzM7Bg9glFAIo",
  shareThisLinkWith: "Share this link with",
  contactManagement: "Add or Import Contacts",
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
    index: 0,
    isGoogle: true
  },
  {
    name: 'Bob Banana',
    email: 'bob@gmail.com',
    index: 1,
    isGoogle: false
  },
  {
    name: 'Caitlin Cantaloupe',
    email: 'caitlin.cant@hotmail.com',
    index: 2,
    isGoogle: false
  },
  {
    name: 'Dave Dragonfruit',
    email: 'dd@dragons.net',
    index: 3,
    isGoogle: true
  },
  {
    name: 'Ellie Eggplant',
    email: 'ellie@yahoo.com',
    index: 4,
    isGoogle: true
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
CallControls = require('./CallControls.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function(){
    return (
      React.DOM.div( {className:"AudioCall"}, 
        CallControls(null),
        React.DOM.div( {className:"AudioScreen"})
      )
    )
  }
});

},{"./CallControls.jsx":12}],7:[function(require,module,exports){
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
        React.DOM.h3( {className:"higher"}, React.DOM.span( {className:"counter"},  this.props.index + 1 ), " ",  this.props.name ),
        React.DOM.div( {className:"Toolbar"}, React.DOM.i( {className:"fa fa-comment-o"})),
        React.DOM.div( {className:"PanelWrapper"}, 
           this.props.children 
        )
      )
    )
  }
});
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
/** @jsx React.DOM */
SearchBar = require('./SearchBar.jsx');
Profile = require('./Profile.jsx');
ProfileDetail = require('./ProfileDetail.jsx');
Button = require('./Button.jsx');
Defaults = require('../utils/defaults');

module.exports = React.createClass({displayName: 'exports',
  getInitialState: function(){
    return {
      filterText: '',
      selectedIndex: -1,
      isOpen: false
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
  openPanel: function(){
    $(this.refs.listSlider.getDOMNode()).velocity({
      translateX: '-50%'
    }, Defaults.animation);
  },
  closePanel: function(){
    $(this.refs.listSlider.getDOMNode()).velocity({
      translateX: '0'
    }, Defaults.animation);
  },
  togglePanel: function(e){
    this.setState({
      isOpen: !this.state.isOpen
    });

    if(!this.state.isOpen) {
      this.openPanel();
    } else {
      this.closePanel();
    }
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
      if(this.props.detail) {
        return ProfileDetail( {onClickEdit:this.togglePanel, onClick:onClick, key:index, user:item, selected:isSelected} )
      } else {
        return Profile( {onClickEdit:this.togglePanel, onClick:onClick, key:index, user:item, selected:isSelected} )
      }
    }.bind(this);

    var shownItems = this.props.items;

    if(this.state.filterText !== '')
    {
      var filter = this.state.filterText.toUpperCase();
      shownItems = _.filter(this.props.items, function(i){
        return (i.name.toUpperCase().indexOf(filter) !== -1)
      });
    }

    var contact = this.props.items[this.state.selectedIndex] || { name: '', email: ''};

    return (
      React.DOM.div( {ref:"listSlider", className:"ListPanels"}, 
        React.DOM.div( {className:"List " + (this.props.faded ? 'faded': '')}, 
            SearchBar( {isOpen:this.state.isOpen, onClick:this.togglePanel, ref:"filterSearchBar", val:this.state.filterText, handleChange:this.handleChange} ),
            React.DOM.ul( {className:"scrollable"}, 
             shownItems.map(viewForItem)
            )
        ),
        React.DOM.div( {className:"EditContact"}, 
          React.DOM.div( {className:"Header"}, "Edit Contact"),
          React.DOM.div( {className:"Form"}, 
            React.DOM.label(null, "Name"),
            React.DOM.input( {defaultValue:contact.name} ),
            React.DOM.label(null, "Email"),
            React.DOM.input( {defaultValue:contact.email} ),
            Button( {text:"Done", onClick:this.togglePanel, style:"action"})
          )
        )
      )
    )
  }
});

},{"../utils/defaults":4,"./Button.jsx":11,"./Profile.jsx":37,"./ProfileDetail.jsx":38,"./SearchBar.jsx":39}],11:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
      React.DOM.div( {onClick:this.props.onClick, className:"Button " + this.props.style },  this.props.text )
    )
  }
});
},{}],12:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  render: function(){
    return (
      React.DOM.div( {className:"CallControls"}, 
       React.DOM.i( {className:"button end fa fa-phone"}),
       React.DOM.i( {className:"button active fa fa-video-camera"}),
       React.DOM.i( {className:"button fa fa-volume-up"}),
       React.DOM.i( {className:"button fa fa-microphone-slash"}),
       React.DOM.span( {className:"right"}, "2:45")
      )
    )
  }
});

},{}],13:[function(require,module,exports){
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

},{"./BaseState.jsx":8,"./HistoryList.jsx":19,"./Panel.jsx":30,"./TabBar.jsx":42}],14:[function(require,module,exports){
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
},{"./BaseStateCorner.jsx":9,"./BuddyList.jsx":10,"./Window.jsx":45}],15:[function(require,module,exports){
/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
HeaderQuick = require('./HeaderQuick.jsx');
Footer = require('./Footer.jsx');
NewCallView = require('./NewCallView.jsx');

module.exports = React.createClass({displayName: 'exports',
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function(){
    return {
      isVisible: false
    }
  },
  openView: function(){
    $(this.refs.newContactView.getDOMNode()).css({display: 'flex'});
  },
  closeView: function(){
    $(this.refs.newContactView.getDOMNode()).hide();
  },
  toggleView: function(){
    this.setState({
      isVisible: !this.state.isVisible
    });
    if(this.state.isVisible) {
      this.closeView();
    } else {
      this.openView();
    }
  },
  componentDidMount: function(){
    this.closeView();
  },
  addContact: function(){
    this.toggleView();
    this.setState({
      name: '',
      email: ''
    });
    if(!this.state.name || !this.state.email ) return;
    var contact = {
      name: this.state.name,
      email: this.state.email
    };

    this.props.items.push(contact);
  },
  render: function() {
    return (
      BaseState( {name: this.props.name,  index: this.props.index }, 
        TabBar( {selected:this.props.tab} ),
        Panel( {extraClass:"Contacts", items: this.props.items }, 

          React.DOM.div( {className:"ContactManagement"}, 
            React.DOM.div( {className:"Header"}, 
              React.DOM.div(null, STRINGS.contactManagement)
            ),

            React.DOM.div( {className:"ContactManagementView"}, 
              
              React.DOM.div( {className:"ButtonGroup"}, 
                Button( {text:"Import Contacts", style:"default"}),
                Button( {text:"New Contact", onClick:this.toggleView, style:this.state.isVisible ? 'default-active' : 'default'})
              ),

              React.DOM.div( {className:"NewContactView", ref:"newContactView"}, 
                React.DOM.hr(null ),
                React.DOM.input( {valueLink:this.linkState('name'), placeholder:"Name"} ),
                React.DOM.input( {valueLink:this.linkState('email'), placeholder:"Email"} ),
                React.DOM.div( {className:"ButtonGroup"}, 
                  Button( {onClick:this.addContact, text:"Add Contact", style:"action"})
                )
              )
            )
          ),

          BuddyList( {faded:this.state.isVisible ? true : false, items:this.props.items, detail:"true"}),
          Footer( {linkText:STRINGS.signOut, username:STRINGS.loggedInUsername})
        )
      )
    );
  }
});

},{"./BaseState.jsx":8,"./Footer.jsx":16,"./HeaderQuick.jsx":18,"./NewCallView.jsx":26,"./Panel.jsx":30,"./TabBar.jsx":42}],16:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function(){
    return {
      isDropdownVisible: false,
      currentIcon: 'fa-circle',
      name: this.props.username,
      isEditing: false
    }
  },
  onClick: function(){
    if(this.state.isDropdownVisible) {
      $(this.refs.statusDropdown.getDOMNode()).hide();
    } else {
      $(this.refs.statusDropdown.getDOMNode()).show();
    }
    this.setState({
      isDropdownVisible: !this.state.isDropdownVisible
    });
  },
  setIcon: function(e) {
    $(this.refs.statusDropdown.getDOMNode()).hide();
    this.setState({
      currentIcon: e.currentTarget.dataset.icon,
      isDropdownVisible: false
    });
  },
  hideDropdown: function() {
    $(this.refs.statusDropdown.getDOMNode()).hide();
    this.setState({
      isDropdownVisible: false
    });
  },
  toggleInput: function() {
    this.setState({
      isEditing: !this.state.isEditing
    })
    $(this.refs.inputBox.getDOMNode()).focus();
  },
  checkKey: function(e){
    if(e.keyCode === 13) {
      this.setState({
        isEditing: false
      });
    }
  },
  render: function(){
    var linkStyle = {
      display: this.state.isEditing ? 'none' : 'block'
    };
    var inputStyle = {
      display: !this.state.isEditing ? 'none' : 'block'
    };
    return (
      React.DOM.div( {className:"Footer", onMouseLeave:this.hideDropdown}, 
        React.DOM.div(null, 
          React.DOM.div( {onClick:this.onClick, className:"status-icon"}, 
            React.DOM.i( {className:"fa " + this.state.currentIcon})
          ),
          React.DOM.ul( {ref:"statusDropdown", onMouseLeave:this.hideDropdown, className:"Dropdown"}, 
            React.DOM.li( {onClick:this.setIcon, 'data-icon':"fa-circle"}, React.DOM.i( {className:"fa fa-circle"}),"Available"),
            React.DOM.li( {onClick:this.setIcon, 'data-icon':"fa-dot-circle-o"}, React.DOM.i( {className:"fa fa-dot-circle-o"}),"Contacts Only"),
            React.DOM.li( {onClick:this.setIcon, 'data-icon':"fa-circle-o grey"}, React.DOM.i( {className:"fa fa-circle-o grey"}),"Do Not Disturb")
          ),
          React.DOM.a( {style:linkStyle, onClick:this.toggleInput}, 
            this.state.name
          ),
          React.DOM.input( {onKeyPress:this.checkKey, valueLink:this.linkState('name'), ref:"inputBox", style:inputStyle} )
        ),
        React.DOM.div( {className:"action"}, 
          this.props.linkText
        )
      )
    )
  }
})

},{}],17:[function(require,module,exports){
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
           this.props.callingAsText,  " ", React.DOM.span( {className:"bold"}, React.DOM.a(null, this.props.username)),"."
        ),
        Button( {text:STRINGS.newCallButton, style:"action", onClick:this.onClick})
      )
    )
  }
});

},{"./Button.jsx":11}],18:[function(require,module,exports){
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
        React.DOM.h6( {className:"right"}, 
          React.DOM.span( {className:"bold"}, React.DOM.a( {'data-tip':"Click to change how your name appears", className:"tip"}, this.props.username))
        )
      )
    )
  }
});

},{"./Button.jsx":11}],19:[function(require,module,exports){
/** @jsx React.DOM */
SmallProfile = require('./SmallProfile.jsx');

module.exports = React.createClass({displayName: 'exports',
  getInitialState: function(){
    return {
      numItems: 10
    }
  },
  clearList: function(){
    this.setState({
      numItems: 0
    });
  },
  render: function(){
    return (
      React.DOM.div( {className:"HistoryList"}, 
        React.DOM.div( {className:"Header"}, 
          React.DOM.div(null, STRINGS.callHistory),
          React.DOM.div( {onClick:this.clearList, className:"Button"}, STRINGS.clearHistory)
        ),
        React.DOM.ul( {className:"CallHistory"}, 
          _.range(this.state.numItems).map(function(i){
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

},{"./SmallProfile.jsx":40}],20:[function(require,module,exports){
/** @jsx React.DOM */
BaseStateCorner = require('./BaseStateCorner.jsx');
Window = require('./Window.jsx');
VideoCall = require('./VideoCall.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseStateCorner( {name: this.props.name,  index: this.props.index }, 
          Window( {extraClass:"InCall", items: this.props.items,  title:"Aubrey Drake Graham"}, 
            VideoCall(null )
          )
        )
    );
  }
});

},{"./BaseStateCorner.jsx":9,"./VideoCall.jsx":44,"./Window.jsx":45}],21:[function(require,module,exports){
/** @jsx React.DOM */
BaseStateCorner = require('./BaseStateCorner.jsx');
Window = require('./Window.jsx');
AudioCall = require('./AudioCall.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseStateCorner( {name: this.props.name,  index: this.props.index }, 
          Window( {extraClass:"InCall", items: this.props.items,  title:"Aubrey Drake Graham"}, 
            AudioCall(null )
          )
        )
    );
  }
});

},{"./AudioCall.jsx":6,"./BaseStateCorner.jsx":9,"./Window.jsx":45}],22:[function(require,module,exports){
/** @jsx React.DOM */
Button = require('./Button.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function(){
    return (
      React.DOM.div( {className:"IncomingCall"}, 
        React.DOM.div( {className:"avatar"}),
        React.DOM.h3(null, "Aubrey Drake Graham"),
        React.DOM.div( {className:"callTypeIcons"}, 
          React.DOM.i( {className:"fa fa-microphone active"}),
          React.DOM.i( {className:"fa fa-video-camera"})
        ),
        React.DOM.div( {className:"ButtonGroup"}, 
          Button( {text:"Ignore ▾", style:"cancel"}),
          Button( {text:"Answer", style:"action"})
        )
      )
    )
  }
});

},{"./Button.jsx":11}],23:[function(require,module,exports){
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

},{"./BaseStateCorner.jsx":9,"./IncomingCall.jsx":22,"./Window.jsx":45}],24:[function(require,module,exports){
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
},{}],25:[function(require,module,exports){
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

},{"./BaseState.jsx":8,"./InvitationList.jsx":24,"./Panel.jsx":30,"./TabBar.jsx":42}],26:[function(require,module,exports){
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
},{"./BackButton.jsx":7,"./Button.jsx":11,"./SpinnerView.jsx":41}],27:[function(require,module,exports){
/** @jsx React.DOM */
SpinnerView = require('./SpinnerView.jsx');
Button = require('./Button.jsx');
var linkGenerationTime = 1000;

module.exports= React.createClass({displayName: 'exports',
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function(){
    return {
      callDuration: 15,
      callName: STRINGS.callNamePlaceholder,
      isCustomizing: false,
      copyText: 'Copy',
      customizeText: 'Customize',
      arrow: '▸'
    }
  },
  onClick: function() {
    $(this.refs.customizePanel.getDOMNode()).toggleClass('opened');
    this.setState({
      isCustomizing: !this.state.isCustomizing
    })
  },
  componentDidUpdate: function(){
    if(this.state.callName != '') {
      $(this.refs.callerNameInput.getDOMNode()).removeClass('error');
    }
  },
  cancelCall: function() {
    clearTimeout(this.timer);
    this.setState({
      isCustomizing: false,
      callName: '',
      callDuration: 15
    });
  },
  copied: function(){
    this.setState({
      copyText: 'Copied!'
    });
  },
  render: function(){
    var linkSection;
      return (
        React.DOM.div( {className:"NewCallView Quick"}, 
          React.DOM.h3(null, "Share this link to invite someone to talk:"),
          React.DOM.div( {className:"inputControls"}, 
            React.DOM.input( {value:STRINGS.sampleCallURL}),
            React.DOM.span( {onClick:this.onClick}, React.DOM.i( {className:"fa fa-cog " + this.state.isCustomizing}))
          ),
          React.DOM.p( {className:"label"}, React.DOM.i( {className:"fa fa-tag"}), " ",  this.state.callName,  " ", React.DOM.small(null, "(What is this?)")),
          React.DOM.div( {className:"Customize", ref:"customizePanel"}, 
            React.DOM.h5(null, "Invitation Name"),
            React.DOM.input( {ref:"callerNameInput", valueLink:this.linkState('callName')}),
            React.DOM.h5(null, React.DOM.i( {className:"fa fa-clock-o"}), " ", STRINGS.inviteExpireIn, " ",  getTimeFromRange(this.state.callDuration), "."),
            React.DOM.input( {valueLink:this.linkState('callDuration'), type:"range", name:"time", min:"1", max:"100"})
          ),
          React.DOM.div( {className:"ButtonGroup"}, 
            Button( {text:"Share", style:"default"}),
            Button( {text:this.state.copyText, onClick:this.copied, style:"default"})
          )
        )
      )
  }
});

},{"./Button.jsx":11,"./SpinnerView.jsx":41}],28:[function(require,module,exports){
/** @jsx React.DOM */
Button = require('./Button.jsx');

module.exports = React.createClass({displayName: 'exports',
  getInitialState: function(){
    return {
      isConnecting: true,
      states: [
        'connecting',
        'ringing',
        'failed'
      ],
      currentState: 0
    }
  },
  componentDidMount: function(){
    setInterval(function(){
      var s = this.state.currentState;
      s += 1;
      if (s > this.state.states.length-1) s = 0;
      this.setState({
        currentState: s
      })
    }.bind(this), 4000);
  },
  render: function(){
    var s = this.state.states[this.state.currentState];
    if(s == 'connecting'){
      return (
        React.DOM.div( {className:"OutgoingCall"}, 
          React.DOM.div( {className:"avatar"}),
          React.DOM.h3(null, "Kanye West"),
          React.DOM.div( {className:"loading"}),
          React.DOM.h6(null, "Connecting..."),
          React.DOM.div( {className:"ButtonGroup"}, 
            Button( {text:"Cancel", style:"default"})
          )
        )
      )
    } else if(s == 'ringing') {
      return (
        React.DOM.div( {className:"OutgoingCall"}, 
          React.DOM.div( {className:"avatar"}),
          React.DOM.h3(null, "Kanye West"),
          React.DOM.div( {className:"loading"}),
          React.DOM.h6(null, "Ringing..."),
          React.DOM.div( {className:"ButtonGroup"}, 
            Button( {text:"Cancel", style:"default"})
          )
        )
      )
    } else if(s == 'failed') {
      return (
        React.DOM.div( {className:"OutgoingCall"}, 
          React.DOM.div( {className:"avatar"}),
          React.DOM.h3(null, "Kanye West"),
          React.DOM.div( {className:"loading failed"}),
          React.DOM.h6(null, "Call Failed"),
          React.DOM.div( {className:"ButtonGroup"}, 
            Button( {text:"Cancel", style:"default"}),
            Button( {text:"Retry", style:"action"})
          )
        )
      )
    }
  }
});

},{"./Button.jsx":11}],29:[function(require,module,exports){
/** @jsx React.DOM */
BaseStateCorner = require('./BaseStateCorner.jsx');
Window = require('./Window.jsx');
OutgoingCall= require('./OutgoingCall.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseStateCorner( {name: this.props.name,  index: this.props.index }, 
          Window( {items: this.props.items,  title:"Kanye West", type:""}, 
            OutgoingCall(null )
          )
        )
    );
  }
});

},{"./BaseStateCorner.jsx":9,"./OutgoingCall.jsx":28,"./Window.jsx":45}],30:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
      React.DOM.div( {className:"Panel " + this.props.extraClass}, 
         this.props.children 
      )
    )
  }
});

},{}],31:[function(require,module,exports){
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
},{"../utils/defaults.js":4}],32:[function(require,module,exports){
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
},{"./BaseState.jsx":8,"./Footer.jsx":16,"./Header.jsx":17,"./NewCallView.jsx":26,"./Panel.jsx":30,"./PanelGroup.jsx":31,"./TabBar.jsx":42}],33:[function(require,module,exports){
/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
HeaderQuick = require('./HeaderQuick.jsx');
NewCallViewQuick = require('./NewCallViewQuick.jsx');
Footer = require('./Footer.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseState( {name: this.props.name,  index: this.props.index }, 
          TabBar( {selected:this.props.tab} ),
            Panel( {extraClass:"LegalPanel", items: this.props.items }, 
              React.DOM.div( {className:"Legal"}, 
                React.DOM.p(null, "By proceeding, you accept the ", React.DOM.a( {href:"https://accounts.firefox.com/en-us/legal/terms"}, "Terms and Services"), " and ", React.DOM.a( {href:"https://accounts.firefox.com/en-us/legal/privacy"}, "Privacy Notice"),"."),
                Button( {text:"OK", style:"default"} )
              ),
              NewCallViewQuick(null),
              Footer( {linkText:STRINGS.signIn, username:STRINGS.loggedOutUsername})
            )
        )
    );
  }
});

},{"./BaseState.jsx":8,"./Footer.jsx":16,"./HeaderQuick.jsx":18,"./NewCallViewQuick.jsx":27,"./Panel.jsx":30,"./TabBar.jsx":42}],34:[function(require,module,exports){
/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
HeaderQuick = require('./HeaderQuick.jsx');
NewCallViewQuick = require('./NewCallViewQuick.jsx');
Footer = require('./Footer.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseState( {name: this.props.name,  index: this.props.index }, 
          TabBar( {selected:this.props.tab} ),
            Panel( {items: this.props.items }, 
              NewCallViewQuick(null),
              Footer( {linkText:STRINGS.signIn, username:STRINGS.loggedOutUsername})
            )
        )
    );
  }
});

},{"./BaseState.jsx":8,"./Footer.jsx":16,"./HeaderQuick.jsx":18,"./NewCallViewQuick.jsx":27,"./Panel.jsx":30,"./TabBar.jsx":42}],35:[function(require,module,exports){
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
},{"./BaseState.jsx":8,"./Footer.jsx":16,"./Header.jsx":17,"./NewCallView.jsx":26,"./Panel.jsx":30,"./PanelGroup.jsx":31,"./TabBar.jsx":42}],36:[function(require,module,exports){
/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');
HeaderQuick = require('./HeaderQuick.jsx');
Footer = require('./Footer.jsx');
NewCallView = require('./NewCallView.jsx');

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
        BaseState( {name: this.props.name,  index: this.props.index }, 
          TabBar( {selected:this.props.tab} ),
          Panel( {extraClass:"Contacts", items: this.props.items }, 
            NewCallViewQuick(null),
            BuddyList( {items:this.props.items} ),
            Footer( {linkText:STRINGS.signOut, username:STRINGS.loggedInUsername})
          )
        )
    );
  }
});

},{"./BaseState.jsx":8,"./Footer.jsx":16,"./HeaderQuick.jsx":18,"./NewCallView.jsx":26,"./Panel.jsx":30,"./TabBar.jsx":42}],37:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  getInitialState: function() {
    var callType = Math.random() > 0.5 ? 'Video call' : 'Audio call';
    var callTime = moment().subtract('minutes', Math.random()*6000);
    var callIcon = callType === 'Video call' ? 'fa-video-camera' : 'fa-phone';
    return {
      isDropdownVisible: false,
      callType: callType,
      callIcon: callIcon,
      callTime: callTime
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
          React.DOM.div( {className:"username"},  this.props.user.name,  " ", React.DOM.i( {className:this.props.user.isGoogle ? 'fa fa-google' : ''})),
          React.DOM.div( {className:"email"}, 
            React.DOM.i( {className:"fa " + this.state.callIcon} ),
             this.state.callTime.calendar()
          )
        ),
        React.DOM.div( {className:"icons", onClick:this.toggleDropdown}, 
          React.DOM.i( {className:"fa fa-video-camera"}),
          React.DOM.i( {className:"fa fa-caret-down"})
        ),
        React.DOM.ul( {ref:"callDropdown", onMouseLeave:this.hideDropdown, className:"Dropdown"}, 
          React.DOM.li(null, React.DOM.i( {className:"fa fa-video-camera"}),"Video Call"),
          React.DOM.li(null, React.DOM.i( {className:"fa fa-phone"}),"Audio Call"),
          React.DOM.li( {onClick:this.props.onClickEdit}, React.DOM.i( {className:"fa fa-user"}),"Edit Contact..."),
          React.DOM.li(null, React.DOM.i( {className:"fa fa-trash-o"}),"Remove Contact")
        )
      )
    )
  }
})

},{}],38:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  getInitialState: function() {
    return {
      isDropdownVisible: false,
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
          React.DOM.div( {className:"username"},  this.props.user.name,  " ", React.DOM.i( {className:this.props.user.isGoogle ? 'fa fa-google' : ''})),
          React.DOM.div( {className:"email"}, 
             this.props.user.email 
          )
        ),
        React.DOM.div( {className:"icons", onClick:this.toggleDropdown}, 
          React.DOM.i( {className:"fa fa-video-camera"}),
          React.DOM.i( {className:"fa fa-caret-down"})
        ),
        React.DOM.ul( {ref:"callDropdown", onMouseLeave:this.hideDropdown, className:"Dropdown"}, 
          React.DOM.li(null, React.DOM.i( {className:"fa fa-video-camera"}),"Video Call"),
          React.DOM.li(null, React.DOM.i( {className:"fa fa-phone"}),"Audio Call"),
          React.DOM.li( {onClick:this.props.onClickEdit}, React.DOM.i( {className:"fa fa-user"}),"Edit Contact..."),
          React.DOM.li(null, React.DOM.i( {className:"fa fa-trash-o"}),"Remove Contact")
        )
      )
    )
  }
})

},{}],39:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  render: function(){
    return (
      React.DOM.div( {className:"SearchBarWrapper"}, 
        React.DOM.input( {ref:"searchInput", className:"SearchBar", value:this.props.val, onChange:this.props.handleChange, placeholder:STRINGS.searchPlaceholder})
      )
    )
  }
});

},{}],40:[function(require,module,exports){
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

},{}],41:[function(require,module,exports){
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
},{}],42:[function(require,module,exports){
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
        React.DOM.li( {className:(this.props.selected === 2) ? 'active tip' : 'tip', 'data-tip':"Contacts"}, 
          React.DOM.a( {href:"#contacts"}, React.DOM.i( {className:"fa fa-book"}))
        )
      )
    )
  }
});

},{}],43:[function(require,module,exports){
/** @jsx React.DOM */
module.exports = React.createClass({displayName: 'exports',
  render: function(){
    var linkView = function(item, index){
      return (React.DOM.a( {href:"#" + item.slug}, item.name))
    }.bind(this);

    return (
      React.DOM.div( {ref:"container", className:"TableOfContents"}, 
        this.props.items.map(linkView)
      )
    )
  }
});
},{}],44:[function(require,module,exports){
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

},{"./CallControls.jsx":12}],45:[function(require,module,exports){
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
      React.DOM.div( {className:"Window " + this.props.extraClass}, 
        WindowTitlebar( {title:this.props.title, type:this.props.type}),
        React.DOM.div( {className:"WindowBody"}, 
           this.props.children 
        )
      )
    )
  }
});

},{}]},{},[1])