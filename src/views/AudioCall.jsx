/** @jsx React.DOM */
CallControls = require('./CallControls.jsx');

module.exports = React.createClass({
  render: function(){
    return (
      <div className="AudioCall">
        <CallControls/>
        <div className="AudioScreen"></div>
      </div>
    )
  }
});
