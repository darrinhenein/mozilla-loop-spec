/** @jsx React.DOM */
Button = require('./Button.jsx');

module.exports = React.createClass({
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
        <h6 className="right">
          <span className="bold"><a data-tip="Click to change how your name appears" className="tip">{this.props.username}</a></span>
        </h6>
      </div>
    )
  }
});
