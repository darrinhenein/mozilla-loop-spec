/** @jsx React.DOM */
Utils = require('../utils/utils.js');
SmallProfile = require('./SmallProfile.jsx');

CALL_TYPES = [
  'incoming',
  'outgoing',
  'linked'
]

module.exports = React.createClass({
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
      <div className="HistoryList">
        <div className="Header">
          <div>{STRINGS.callHistory}</div>
          <div onClick={this.clearList} className="Button">{STRINGS.clearHistory}</div>
        </div>
        <ul className="CallHistory">
          {_.range(this.state.numItems).map(function(i){
            var u = _.random(0, _users.length -1);
            var callTypeNum = _.random(0, 2);
            var callType = CALL_TYPES[callTypeNum];
            var missed = _.random(0, 3) === 1 ? 'missed' : 'accepted';
            var icon, callIcon;
            if(missed === 'missed') {
              icon = <i className="fa fa-times-circle"></i>
            } else {
              icon = <i className="fa fa-phone"></i>
            }
            if(callType === 'incoming') {
              callIcon = <i data-tip={"Incoming (" + missed + ")"} className="fa tip fa-arrow-right"></i>
            } else if(callType === 'outgoing') {
              callIcon = <i data-tip={"Outgoing (" + missed + ")"} className="fa tip fa-arrow-left"></i>
            } else if(callType === 'linked') {
              callIcon = <i data-tip={"Link Call"} className="fa tip fa-link"></i>
            }

            var callDetails;
            if(callTypeNum < 2) {
              callDetails = <SmallProfile user={_users[u]} />
            } else {
              callDetails = <div className="Profile SmallProfile"><div className="username">http://lo.op/{ Utils.getRandomString(8) }</div></div>
            }

            return (
              <li key={"CallerHistory" + i} className={[callType, missed].join(' ')}>
                {callIcon}
                {callDetails}
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
