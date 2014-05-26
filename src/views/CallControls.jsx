/** @jsx React.DOM */
module.exports = React.createClass({
  render: function(){
    return (
      <div className="CallControls">
       <i className="button end fa fa-phone"></i>
       <span id="call-control-video"><i className="button active fa fa-video-camera"></i></span>
       <i className="button fa fa-volume-up"></i>
       <i className="button fa fa-microphone-slash"></i>
       <span className="right">2:45</span>
      </div>
    )
  }
});
