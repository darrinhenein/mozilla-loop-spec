/** @jsx React.DOM */
CallControls = require('./CallControls.jsx');

module.exports = React.createClass({
  render: function(){
    return (
      <div className="VideoCall Hold">
        <CallControls/>
        <div className="VideoScreen">
          <span className="floatingText"><i className="fa fa-pause"></i>Call on Hold</span>
          <div className="VideoScreenInner">
          </div>
        </div>
      </div>
    )
  }
});
