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
        <h6>
          { this.props.callingAsText } <span className="bold">{this.props.username}</span>.
          <span className="right"><a>{this.props.editText}</a></span>
        </h6>
        <Button text={STRINGS.newCallButton} style='action' onClick={this.onClick}/>
      </div>
    )
  }
});
