/** @jsx React.DOM */
module.exports = React.createClass({
  render: function(){
    return (
      <div className="CallControls">
       <i className="button end">{STRINGS.endCall}</i>
       <i className="button active fa fa-video-camera"></i>
       <i className="button fa fa-volume-up"></i>
       <span className="right">2:45</span>
      </div>
    )
  }
});