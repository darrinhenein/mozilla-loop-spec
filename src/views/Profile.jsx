/** @jsx React.DOM */
module.exports = React.createClass({
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
      <div onClick={this.onClick} className={["Profile", this.props.selected].join(' ')} >
        <div className={"avatar user-" + this.props.user.index}></div>
        <div className="details">
          <div className="username">{ this.props.user.name } <i className={this.props.user.isGoogle ? 'fa fa-google' : ''}></i></div>
          <div className="email">
            <i className={"fa " + this.state.callIcon} ></i>
            { this.state.callTime.calendar()}
          </div>
        </div>
        <div className="icons" onClick={this.toggleDropdown}>
          <i className="fa fa-video-camera"></i>
          <i className="fa fa-caret-down"></i>
        </div>
        <ul ref="callDropdown" onMouseLeave={this.hideDropdown} className="Dropdown">
          <li><i className="fa fa-video-camera"></i>Video Call</li>
          <li><i className="fa fa-phone"></i>Audio Call</li>
          <li onClick={this.props.onClickEdit}><i className="fa fa-user"></i>Edit Contact...</li>
          <li><i className="fa fa-trash-o"></i>Remove Contact</li>
        </ul>
      </div>
    )
  }
})
