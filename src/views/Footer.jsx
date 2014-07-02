/** @jsx React.DOM */
module.exports = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  statusText: {
    'fa-circle': 'Available',
    'fa-circle-o': 'Do Not Disturb',
    'fa-dot-circle-o': 'Contacts Only'
  },
  getInitialState: function(){
    return {
      isDropdownVisible: false,
      isMenuVisible: false,
      currentIcon: 'fa-circle',
      name: this.props.username,
      isEditing: false
    }
  },
  onStatusClick: function(){
    if(this.state.isDropdownVisible) {
      $(this.refs.statusDropdown.getDOMNode()).hide();
    } else {
      $(this.refs.statusDropdown.getDOMNode()).show();
    }
    this.setState({
      isDropdownVisible: !this.state.isDropdownVisible
    });
  },
  onMenuClick: function(){
    if(!this.refs.menuDropdown) return;
    if(this.state.isMenuVisible){
      $(this.refs.menuDropdown.getDOMNode()).hide();
    } else {
      $(this.refs.menuDropdown.getDOMNode()).show();
    }
    this.setState({
      isMenuVisible: !this.state.isMenuVisible
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
    if(!this.refs.menuDropdown) return;
    $(this.refs.statusDropdown.getDOMNode()).hide();
    this.setState({
      isDropdownVisible: false
    });
  },
  hideMenu: function() {
    $(this.refs.menuDropdown.getDOMNode()).hide();
    this.setState({
      isMenuVisible: false
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
      display: this.state.isEditing ? 'none' : 'flex'
    };
    var inputStyle = {
      display: !this.state.isEditing ? 'none' : 'flex'
    };
    var signButton = this.props.linkText == "Sign In" ?
      <span>
        <i className={ (this.state.isMenuVisible ? "active" : "") + " fa fa-cog"}></i>
        <ul ref="menuDropdown" className="Dropdown">
          <li><a href="#settings"><i className="fa fa-cog"></i>Settings</a></li>
          <li><i className="fa fa-sign-in"></i>Sign In</li>
        </ul>
      </span>
      :
      <span>
        <i className={ (this.state.isMenuVisible ? "active" : "") + " fa fa-cog"}></i>
        <ul ref="menuDropdown" className="Dropdown">
          <li><a href="#settings"><i className="fa fa-cog"></i>Settings</a></li>
          <li><i className="fa fa-user"></i>Account</li>
          <li><i className="fa fa-sign-out"></i>Sign Out</li>
        </ul>
      </span>;

    return (
      <div className="Footer" onMouseLeave={this.hideDropdown}>
        <div>
          <span className="avatar">
          </span>
          <span className="center" style={linkStyle}>
            <span className="userDetails">
              <p>
                <span className="username" onClick={this.toggleInput}>{this.state.name}</span>
              </p>
              <p className="statusWrapper" onClick={this.onStatusClick} >
                <span className="status-text">{ this.statusText[this.state.currentIcon] }</span>
                <span id="availability-indicator" className="status-icon">
                  <i className={"fa " + this.state.currentIcon}></i>
                </span>
                <ul ref="statusDropdown" onMouseLeave={this.hideDropdown} className="Dropdown">
                  <li onClick={this.setIcon} data-icon="fa-circle"><i className="fa fa-circle"></i>Available</li>
                  <li onClick={this.setIcon} data-icon="fa-dot-circle-o"><i className="fa fa-dot-circle-o"></i>Contacts Only</li>
                  <li onClick={this.setIcon} data-icon="fa-circle-o"><i className="fa fa-circle-o"></i>Do Not Disturb</li>
                </ul>
              </p>
            </span>
            <a className="subtle">{ this.props.linkText == 'Sign In' ? 'Sign In' : ''}</a>
          </span>
          <input onKeyPress={this.checkKey} valueLink={this.linkState('name')} ref="inputBox" style={inputStyle} />
        </div>
        <div onClick={this.onMenuClick} onMouseLeave={this.hideMenu} className="action">
          { signButton }
        </div>
      </div>
    )
  }
})
