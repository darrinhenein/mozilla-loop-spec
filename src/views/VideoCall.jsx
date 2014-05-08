/** @jsx React.DOM */
CallControls = require('./CallControls.jsx');

module.exports = React.createClass({
  render: function(){
    return (
      <div className="VideoCall">
        <CallControls/>
        <div className="VideoScreen">
          <div className="VideoScreenInner">
          </div>
        </div>
      </div>
    )
  }
});
