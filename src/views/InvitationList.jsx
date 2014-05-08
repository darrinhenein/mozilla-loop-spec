/** @jsx React.DOM */
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

module.exports = React.createClass({
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