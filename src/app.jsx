/** @jsx React.DOM */
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var STRINGS = {
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

var linkGenerationTime = 1000;

var getTimeFromRange = function(position) {
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

var _users = [
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

var _animationDefaults = {
  duration: 200,
  easing: "easeInSine",
  queue: false
};

var BaseState = React.createClass({
  getDefaultProps: function(){
    return {
      name: 'Base State',
      children: [],
      index: 1
    }
  },
  render: function(){
    return (
      <div className="StateWrapper">
        <h3 className="higher"><span className="counter">{ this.props.index + 1 }</span> { this.props.name }</h3>
        <div className="Toolbar"><i className="fa fa-comment-o"></i></div>
        <div className="PanelWrapper">
          { this.props.children }
        </div>
      </div>
    )
  }
});

var BaseStateCorner = React.createClass({
  getDefaultProps: function(){
    return {
      name: 'Base State',
      children: [],
      index: 1
    }
  },
  render: function(){
    return (
      <div className="StateWrapper">
        <h3><span className="counter">{ this.props.index + 1 }</span> { this.props.name }</h3>
        <div className="Browser">
          <div className="WindowWrapper">
            { this.props.children }
          </div>
        </div>
      </div>
    )
  }
});

var TabBar = React.createClass({
  render: function() {
    return (
      <ul className="TabBar">
        <li className={(this.props.selected === 0) ? 'active tip' : 'tip'} data-tip="Call Tab">
          <a href="#precall"><i className="fa fa-phone"></i></a>
        </li>
        <li className={(this.props.selected === 1) ? 'active tip' : 'tip'} data-tip="Call History Tab">
          <a href="#callhistory"><i className="fa fa-clock-o"></i></a>
        </li>
        <li className={(this.props.selected === 2) ? 'active tip' : 'tip'} data-tip="Invitation Revocation/Permissions Tab">
          <a href="#invitationlist"><i className="fa fa-link"></i></a>
        </li>
      </ul>
    )
  }
});

var PanelGroup = React.createClass({
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
      <div className={classname}>
        <div ref="slider" className="PanelGroupInner">
          {this.props.children}
        </div>
      </div>
    )
  }
})

var Profile = React.createClass({
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
      <div onClick={this.onClick} className={["Profile", this.props.selected].join(' ')} >
        <div className={"avatar user-" + this.props.user.index}></div>
        <div className="details">
          <div className="username">{ this.props.user.name }</div>
          <div className="email">{ this.props.user.email }</div>
        </div>
        <div className="icons" onClick={this.toggleDropdown}>
          <i className="fa fa-video-camera"></i>
          <i className="fa fa-caret-down"></i>
        </div>
        <ul ref="callDropdown" onMouseLeave={this.hideDropdown} className="Dropdown">
          <li><i className="fa fa-video-camera"></i>Video Call</li>
          <li><i className="fa fa-phone"></i>Audio Call</li>
          <li><i className="fa fa-user"></i>Edit Contact...</li>
          <li><i className="fa fa-trash-o"></i>Remove Contact</li>
        </ul>
      </div>
    )
  }
})

var SmallProfile = React.createClass({
  onClick: function(){
    this.props.onClick(this.props.key);
  },
  render: function(){
    return (
      <div onClick={this.onClick} className={["SmallProfile", "Profile", this.props.selected].join(' ')} >
        <div className={"avatar user-" + this.props.user.index}></div>
        <div className="details">
          <div className="username">{ this.props.user.name }</div>
          <div className="email">{ this.props.user.email }</div>
        </div>
      </div>
    )
  }
})

var SpinnerView = React.createClass({
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
      <div className="SpinnerView"></div>
    )
  }
});

var NewCallView = React.createClass({
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
        <div className="NewCallView">
          <BackButton onClick={this.goBack}/>
          <h3>{STRINGS.shareThisLinkWith} { this.state.callName }</h3>
          <input value={STRINGS.sampleCallURL}></input>
          <h5><i className="fa fa-clock-o"></i> Expires in { getTimeFromRange(this.state.callDuration) }</h5>
          <div className="ButtonGroup">
            <Button text="Copy" style="default"/>
            <Button text="Share" style="default"/>
            <Button onClick={this.cancelCall} text="Cancel" style="cancel"/>
          </div>
        </div>
      )
    } else if (this.state.gettingLink) {
      return (
        <div className="NewCallView">
          <BackButton onClick={this.goBack}/>
          <h3 className="center">Generating Invitation for { this.state.callName }</h3>
          <SpinnerView />
          <Button onClick={this.cancelCall} text="Cancel" style="cancel"/>
        </div>
      )
    } else {
      return (
        <div className="NewCallView">
          <BackButton onClick={this.goBack}/>
          <h3>New Invitation</h3>
          <input ref="callerNameInput" valueLink={this.linkState('callName')} placeholder={STRINGS.callNamePlaceholder}></input>
          <h5><i className="fa fa-clock-o"></i> {STRINGS.inviteExpireIn} { getTimeFromRange(this.state.callDuration) }.</h5>
          <input valueLink={this.linkState('callDuration')} type="range" name="time" min="1" max="100"></input>
          <Button onClick={this.onClick} style="action" text={STRINGS.getLinkText}/>
        </div>
      )
    }
  }
});

var BackButton = React.createClass({
  render: function(){
    return (
      <div onClick={this.props.onClick} className="BackButton">
        <i className="fa fa-chevron-left"></i>
      </div>
    )
  }
});

var BuddyList = React.createClass({
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
      return <Profile onClick={onClick} key={index} user={item} selected={isSelected} />
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
      <div className="List">
        <SearchBar ref="filterSearchBar" val={this.state.filterText} handleChange={this.handleChange} />
        <ul className="scrollable">
        <ReactCSSTransitionGroup transitionName="button-animation">
         {shownItems.map(viewForItem)}
         </ReactCSSTransitionGroup>
        </ul>
      </div>
    )
  }
});

var SearchBar = React.createClass({
  render: function(){
    return (
      <div className="SearchBarWrapper">
        <input ref="searchInput" className="SearchBar" value={this.props.val} onChange={this.props.handleChange} placeholder={STRINGS.searchPlaceholder}/>
        <i className="fa fa-book tip" data-tip="Add, Import Contacts"></i>
      </div>
    )
  }
});

var Button = React.createClass({
  render: function() {
    return (
      <div onClick={this.props.onClick} className={"Button " + this.props.style }>{ this.props.text }</div>
    )
  }
});

var Panel = React.createClass({
  render: function() {
    return (
      <div className="Panel">
        { this.props.children }
      </div>
    )
  }
});

var Window = React.createClass({
  render: function() {
    return (
      <div className="Window">
        <WindowTitlebar title={this.props.title} type={this.props.type}/>
        <div className="WindowBody">
          { this.props.children }
        </div>
      </div>
    )
  }
});

var WindowTitlebar = React.createClass({
  render: function(){
    return (
      <div className={"WindowTitlebar " + this.props.type}>
        <h5>{this.props.title}</h5>
        <div className="WindowControls">
        </div>
      </div>
    )
  }
});

var CallControls = React.createClass({
  render: function(){
    return (
      <div className="CallControls">
       <i className="button end">{STRINGS.endCall}</i>
       <i className="button active fa fa-video-camera"></i>
       <i className="button fa fa-volume-up"></i>
       <span className="right">2:45</span>
      </div>
    )
  }
});

var VideoCall = React.createClass({
  render: function(){
    return (
      <div className="VideoCall">
        <CallControls/>
        <div className="VideoScreen">
          <div className="VideoScreenInner">
          </div>
        </div>
      </div>
    )
  }
});

var IncomingCall = React.createClass({
  render: function(){
    return (
      <div className="IncomingCall">
        <div className="avatar"></div>
        <h3>Aubrey Drake Graham</h3>
        <div className="ButtonGroup">
          <Button text="Ignore" style="cancel"/>
          <Button text="Answer" style="action"/>
        </div>
      </div>
    )
  }
});

var Header = React.createClass({
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
      <div className="Header">
        <h6>
          { this.props.callingAsText } <span className="bold">{this.props.username}</span>.
          <span className="right"><a>{this.props.editText}</a></span>
        </h6>
        <Button text={STRINGS.newCallButton} style='action' onClick={this.onClick}/>
      </div>
    )
  }
});

var Footer = React.createClass({
  render: function(){
    return (
      <div className="Footer tip" data-tip="Sign in to Firefox Account (or other)">
        {this.props.linkText}
      </div>
    )
  }
})

var HistoryList = React.createClass({
  render: function(){
    return (
      <div className="HistoryList">
        <div className="Header">
          <div>{STRINGS.callHistory}</div>
          <div className="Button">{STRINGS.clearHistory}</div>
        </div>
        <ul className="CallHistory">
          {_.range(10).map(function(i){
            var u = _.random(0, _users.length -1);
            var callType = _.random(0, 1) === 1 ? 'incoming' : 'outgoing';
            var missed = _.random(0, 3) === 1 ? 'missed' : 'accepted';
            var icon, callIcon;
            if(missed === 'missed') {
              icon = <i className="fa fa-times-circle"></i>
            } else {
              icon = <i className="fa fa-phone"></i>
            }
            if(callType === 'incoming') {
              callIcon = <i data-tip={"Incoming (" + missed + ")"} className="fa tip fa-arrow-right"></i>
            } else {
              callIcon = <i data-tip={"Outgoing (" + missed + ")"} className="fa tip fa-arrow-left"></i>
            }
            return (
              <li key={"CallerHistory" + i} className={[callType, missed].join(' ')}>
                {callIcon}
                <SmallProfile user={_users[u]} />
                <div className="CallDetails right">
                  May 3 4:32pm
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
});

var Invitation = React.createClass({
  render: function() {

    if(this.props.invite.isActive){
      var divStyle = {
        width: this.props.invite.completed*90 + '%'
      }
      return (
        <li className="Invitation active">
          <h3>{this.props.invite.email} <small>http://lo.op/8dj8d38</small></h3>
          <div className="expiryInfo">
            <h5>
              <small>3:51pm May 12, 2014</small>
            </h5>
            <div>
              <div className="progressWrapper">
                <div className="progressBar" style={divStyle}></div>
              </div>
              <h5 className="align-right"><i className="fa fa-clock-o"></i> {getTimeFromRange(this.props.invite.totalTime)} left.</h5>
            </div>
          </div>
          <div className="icons right">
            Revoke Invitation
          </div>
        </li>
      )
    } else {
      return (
        <li className="Invitation expired">
          <h3>{this.props.invite.email}</h3>
          <div className="expiryInfo">
            <h5>{STRINGS.expired}.</h5>
          </div>
        </li>
      )
    }
  }
});

var InvitationList = React.createClass({
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
      return (<Invitation key={"Invite" + index} invite={inv} />)
    }.bind(this);

    return (
      <div className="InvitationList">
        <div className="Header">
          <div>{STRINGS.invitationList}</div>
        </div>
        <ul className="Invitations">
          { invites.map(inviteView) }
        </ul>
      </div>
    )
  }
});

var PrecallNotSignedIn = React.createClass({
  render: function() {
    return (
        <BaseState name={ this.props.name } index={ this.props.index }>
          <TabBar selected={this.props.tab} />
          <PanelGroup>
            <Panel items={ this.props.items }>
              <Header username={STRINGS.loggedOutUsername} editText={STRINGS.changeUsername} slideTo={this.props.slideTo}/>
              <Footer linkText={STRINGS.signIn}/>
            </Panel>
            <Panel items={ this.props.items }>
               <NewCallView/>
            </Panel>
          </PanelGroup>
        </BaseState>
    );
  }
});

var PrecallSignedIn = React.createClass({
  render: function() {
    return (
        <BaseState name={ this.props.name } index={ this.props.index }>
          <TabBar selected={this.props.tab} />
          <PanelGroup>
            <Panel items={ this.props.items }>
              <Header username={STRINGS.loggedInUsername} editText={STRINGS.viewAccount}/>
              <BuddyList items={this.props.items} />
              <Footer linkText={STRINGS.signOut}/>
            </Panel>
            <Panel items={ this.props.items }>
               <NewCallView/>
            </Panel>
          </PanelGroup>
        </BaseState>
    );
  }
});

var CallHistory = React.createClass({
  render: function() {
    return (
        <BaseState name={ this.props.name } index={ this.props.index }>
          <TabBar selected={this.props.tab} />
          <Panel items={ this.props.items }>
            <HistoryList/>
          </Panel>
        </BaseState>
    );
  }
});

var InvitationManagement = React.createClass({
  render: function() {
    return (
        <BaseState name={ this.props.name } index={ this.props.index }>
          <TabBar selected={this.props.tab} />
          <Panel items={ this.props.items }>
            <InvitationList/>
          </Panel>
        </BaseState>
    );
  }
});

var InCallActive = React.createClass({
  render: function() {
    return (
        <BaseStateCorner name={ this.props.name } index={ this.props.index }>
          <Window items={ this.props.items } title="Aubrey Drake Graham">
            <VideoCall />
          </Window>
        </BaseStateCorner>
    );
  }
});

var IncomingCallView = React.createClass({
  render: function() {
    return (
        <BaseStateCorner name={ this.props.name } index={ this.props.index }>
          <Window items={ this.props.items } title="Call from Aubrey Drake Graham" type="">
            <IncomingCall />
          </Window>
        </BaseStateCorner>
    );
  }
});

var ContactsDocked = React.createClass({
  render: function() {
    return (
        <BaseStateCorner name={ this.props.name } index={ this.props.index }>
          <Window items={ this.props.items } title="Contacts">
            <BuddyList items={this.props.items} />
          </Window>
        </BaseStateCorner>
    );
  }
});

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

      React.renderComponent(<View items={_users} index={index} tab={state.tab} name={state.name} />, el);
      $('.tip').tipr({
        mode: 'top',
        speed: 200
      });
  })
}, 100);