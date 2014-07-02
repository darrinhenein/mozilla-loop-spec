/** @jsx React.DOM */
Button = require('./Button.jsx');
Utils = require('../utils/utils.js');

module.exports = React.createClass({
  render: function(){
    return (
      <div className="StartCall Unavailable">
        <h3 id="incoming-call-url">This URL is not available.</h3>
        <h6>Get a new URL to send to your friend.</h6>
        <div className="ButtonGroup">
          <Button text="Close" style="cancel"/>
          <Button text="Get URL" style="emphasis"/>
        </div>
      </div>
    )
  }
});
