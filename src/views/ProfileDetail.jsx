/** @jsx React.DOM */
module.exports = React.createClass({
  getInitialState: function() {
    return {
      isDropdownVisible: false,
      blocked: this.props.user.blocked
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
  toggleBlocked: function(){
    this.props.user.blocked = !this.state.blocked;
    this.setState({
      blocked: !this.state.blocked
    });
  },
  render: function(){
    var blocked = this.state.blocked ? 'blocked' : '';
    var username = this.props.user.name.split(' ');
    return (
      <div onClick={this.onClick} className={["Profile", this.props.selected].join(' ') + " " + blocked} >
        <div className={"avatar user-" + this.props.user.index}></div>
        <div className="details">
          <div className="username"><strong>{ username[0] }</strong> { username[1] }
            <i className={this.props.user.isGoogle ? 'fa fa-google' : ''}></i>
            <i className={ this.state.blocked ? 'fa fa-minus-circle' : ''}></i>
          </div>
          <div className="email">
            { this.props.user.email }
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
          <li onClick={this.toggleBlocked}><i className="fa fa-ban"></i>{ this.state.blocked ? 'Unblock Contact' : 'Block Contact' }</li>
          <li><i className="fa fa-trash-o"></i>Remove Contact</li>
        </ul>
      </div>
    )
  }
})
