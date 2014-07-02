/** @jsx React.DOM */
Button = require('./Button.jsx');
Utils = require('../utils/utils.js');

module.exports = React.createClass({
  render: function(){
    return (
      <div className="LinkPrompt">
        <div className="avatar"></div>
        <h3>Call Failed</h3>
        <div className="Loading failed"></div>
        <h6>Email a link to be reached later.</h6>
        <div className="ButtonGroup">
          <Button text="Cancel" style="cancel"/>
          <Button text="Retry" style="emphasis" />
          <Button text="Email Link" style="emphasis" />
        </div>
      </div>
    )
  }
});
