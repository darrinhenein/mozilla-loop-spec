/** @jsx React.DOM */
Button = require('./Button.jsx');

module.exports = React.createClass({
  render: function(){
    return (
      <div className="IncomingCall">
        <div className="avatar"></div>
        <h3>Aubrey Drake Graham</h3>
        <div className="ButtonGroup">
          <Button text="Ignore" style="cancel"/>
          <Button text="Answer" style="action"/>
        </div>
      </div>
    )
  }
});