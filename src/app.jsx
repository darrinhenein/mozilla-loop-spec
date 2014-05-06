/** @jsx React.DOM */
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var STRINGS = {
  viewAccount: "View Account",
  signIn: "Sign In",
  signOut: "Sign Out",
  changeUsername: "Change",
  loggedInUsername: "ally@gmail.com",
  loggedOutUsername: "Guest",
  newCallButton: "New Call",
  callingAs: "Calling as",
  searchPlaceholder: "Search...",
  getLinkText: "Get Link",
  callNamePlaceholder: "Who are you calling?",
  inviteExpireIn: "Invitation will expire in",
  sampleCallURL: "http://lo.op/nx3nd7h",
  shareThisLinkWith: "Share this link with",
  callHistory: "Call History",
  clearHistory: "Clear"
};

var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

var TabBar = React.createClass({
  render: function() {
    return (
      <ul className="TabBar">
        <li className={(this.props.selected === 0) ? 'active tip' : 'tip'} data-tip="Call Tab"><i className="fa fa-phone"></i></li>
        <li className={(this.props.selected === 1) ? 'active tip' : 'tip'} data-tip="Call History Tab"><i className="fa fa-clock-o"></i></li>
        <li className={(this.props.selected === 2) ? 'active tip' : 'tip'} data-tip="Invitation Revocation/Permissions Tab"><i className="fa fa-link"></i></li>
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
  onClick: function(){
    this.props.onClick(this.props.key);
  },
  render: function(){
    return (
      <div onClick={this.onClick} className={["Profile", this.props.selected].join(' ')} >
        <div className="avatar"></div>
        <div className="details">
          <div className="username">{ this.props.user.name }</div>
          <div className="email">{ this.props.user.email }</div>
        </div>
        <div className="icons">
          <i className=" fa fa-video-camera"></i>
          <i className=" fa fa-caret-down"></i>
        </div>
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
        <div className="avatar"></div>
        <div className="details">
          <div className="username">{ this.props.user.name }</div>
          <div className="email">{ this.props.user.email }</div>
        </div>
      </div>
    )
  }
})

var NewCallView = React.createClass({
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
        <div className="NewCallView">
          <BackButton onClick={this.goBack}/>
          <h3>{STRINGS.shareThisLinkWith} { this.state.callName }</h3>
          <input value={STRINGS.sampleCallURL}></input>
          <h5><i className="fa fa-clock-o"></i> Expires in { this.getTimeFromRange(this.state.callDuration) }</h5>
          <div className="ButtonGroup">
            <Button text="Copy" style="default"/>
            <Button text="Share" style="default"/>
            <Button onClick={this.cancelCall} text="Cancel" style="cancel"/>
          </div>
        </div>
      )
    } else {
      return (
        <div className="NewCallView">
          <BackButton onClick={this.goBack}/>
          <h3>New Invitation</h3>
          <input ref="callerNameInput" valueLink={this.linkState('callName')} placeholder={STRINGS.callNamePlaceholder}></input>
          <h5><i className="fa fa-clock-o"></i> {STRINGS.inviteExpireIn} { this.getTimeFromRange(this.state.callDuration) }.</h5>
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
            var u = getRandomInt(0, _users.length -1);
            var callType = getRandomInt(0, 1) === 1 ? 'incoming' : 'outgoing';
            var missed = getRandomInt(0, 5) === 1 ? 'missed' : 'accepted';
            var icon, callIcon;
            if(missed === 'missed') {
              icon = <i className="fa fa-times-circle"></i>
            } else {
              icon = <i className="fa fa-phone"></i>
            }
            if(callType === 'incoming') {
              callIcon = <i className="fa fa-arrow-right"></i>
            } else {
              callIcon = <i className="fa fa-arrow-left"></i>
            }
            return (
              <li key={"CallerHistory" + i} className={[callType, missed].join(' ')}>
                {callIcon}
                <SmallProfile user={_users[u]} />
                <div className="CallDetails right">
                  4:32pm May 3
                </div>
              </li>
            )
          })}
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

var states = [
  {
    name: 'Precall - Not Signed In',
    view: PrecallNotSignedIn,
    tab: 0
  },
  {
    name: 'Precall - Signed In',
    view: PrecallSignedIn,
    tab: 0
  },
  {
    name: 'Call History',
    view: CallHistory,
    tab: 1
  }
];

setTimeout(function() {
  _.each(states, function(state, index){
      var el = $('<div/>', {
        class: 'component-wrapper'
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