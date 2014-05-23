/** @jsx React.DOM */
Button = require('./Button.jsx');

module.exports = React.createClass({
  render: function(){
    return (
      <div className="IncomingCall">
        <div className="avatar unknown"></div>
        <h3><i className="fa fa-tag"></i>Orange Prickly Badger</h3>
        <div className="callTypeIcons">
          <i className="fa fa-microphone active"></i>
          <i className="fa fa-video-camera active"></i>
        </div>
        <div className="ButtonGroup">
          <Button text="Ignore ▾" style="cancel"/>
          <Button text="Answer" style="action"/>
        </div>
      </div>
    )
  }
});
