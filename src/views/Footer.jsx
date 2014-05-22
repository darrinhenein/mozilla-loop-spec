/** @jsx React.DOM */
module.exports = React.createClass({
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
      <div className="Footer" onMouseLeave={this.hideDropdown}>
        <div>
          <div onClick={this.onClick} className="status-icon">
            <i className={"fa " + this.state.currentIcon}></i>
          </div>
          <ul ref="statusDropdown" onMouseLeave={this.hideDropdown} className="Dropdown">
            <li onClick={this.setIcon} data-icon="fa-circle"><i className="fa fa-circle"></i>Available</li>
            <li onClick={this.setIcon} data-icon="fa-dot-circle-o"><i className="fa fa-dot-circle-o"></i>Contacts Only</li>
            <li onClick={this.setIcon} data-icon="fa-circle-o grey"><i className="fa fa-circle-o grey"></i>Do Not Disturb</li>
          </ul>
          <a style={linkStyle} onClick={this.toggleInput}>
            {this.state.name}
          </a>
          <input onKeyPress={this.checkKey} valueLink={this.linkState('name')} ref="inputBox" style={inputStyle} />
        </div>
        <div className="action">
          {this.props.linkText}
        </div>
      </div>
    )
  }
})
