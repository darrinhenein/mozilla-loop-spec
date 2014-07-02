/** @jsx React.DOM */
Button = require('./Button.jsx');
Utils = require('../utils/utils.js');

module.exports = React.createClass({
  render: function(){
    return (
      <div className="StartCall">
        <div className="avatar link"></div>
        <h3 id="incoming-call-url">http://lo.op/{ Utils.getRandomString(8)}</h3>
        <h6 id="incoming-call-date">(from May 26, 2014)</h6>
        <div className="ButtonGroup">
          <Button text="Cancel" style="cancel"/>
          <Button id="start-call-button" text="Call" hasRightChevron style="action" icon="fa-video-camera"/>
        </div>
        <div className="legal" id="start-call-legal">
          By using Loop, you agree to the Mozilla <a>Terms of Use</a> and <a>Privacy Notice</a>.
        </div>
      </div>
    )
  }
});
