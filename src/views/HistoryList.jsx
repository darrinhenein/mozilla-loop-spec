/** @jsx React.DOM */
SmallProfile = require('./SmallProfile.jsx');

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
