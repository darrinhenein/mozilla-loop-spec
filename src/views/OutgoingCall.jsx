/** @jsx React.DOM */
Button = require('./Button.jsx');

module.exports = React.createClass({
  render: function(){
    return (
      <div className="OutgoingCall">
        <div className="avatar"></div>
        <h3>Kanye West</h3>
        <div className="ButtonGroup">
          <Button text="Cancel" style="default"/>
        </div>
      </div>
    )
  }
});
