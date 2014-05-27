/** @jsx React.DOM */
Button = require('./Button.jsx');
Utils = require('../utils/utils.js');

module.exports = React.createClass({
  render: function(){
    return (
      <div className="IncomingCall">
        <div className="avatar unknown"></div>
        <h3 id="incoming-call-url">http://lo.op/{ Utils.getRandomString(8)}</h3>
        <h6 id="incoming-call-date">(May 26, 2014)</h6>
        <div id="incoming-call-icons" className="callTypeIcons">
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
