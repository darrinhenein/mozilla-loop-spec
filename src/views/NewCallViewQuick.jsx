/** @jsx React.DOM */
SpinnerView = require('./SpinnerView.jsx');
Button = require('./Button.jsx');
var linkGenerationTime = 1000;

module.exports= React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function(){
    return {
      callDuration: 15,
      callName: '',
      isCustomizing: false,
      customizeText: 'Customize',
      arrow: '▸'
    }
  },
  onClick: function() {
    $(this.refs.customizePanel.getDOMNode()).toggleClass('opened');
    this.setState({
      isCustomizing: !this.state.isCustomizing
    })
  },
  componentDidUpdate: function(){
    if(this.state.callName != '') {
      $(this.refs.callerNameInput.getDOMNode()).removeClass('error');
    }
  },
  cancelCall: function() {
    clearTimeout(this.timer);
    this.setState({
      isCustomizing: false,
      callName: '',
      callDuration: 15
    });
  },
  render: function(){
    var linkSection;
      return (
        <div className="NewCallView Quick">
          <h3>Share this link to invite someone to talk:</h3>
          <div className="inputControls">
            <input value={STRINGS.sampleCallURL}></input>
            <span onClick={this.onClick}><i className={"fa fa-cog " + this.state.isCustomizing}></i></span>
          </div>
          <div className="Customize" ref="customizePanel">
            <h5>Invitation Name</h5>
            <input ref="callerNameInput" valueLink={this.linkState('callName')} placeholder={STRINGS.callNamePlaceholder}></input>
            <h5><i className="fa fa-clock-o"></i> {STRINGS.inviteExpireIn} { getTimeFromRange(this.state.callDuration) }.</h5>
            <input valueLink={this.linkState('callDuration')} type="range" name="time" min="1" max="100"></input>
          </div>
          <div className="ButtonGroup">
            <Button text="Share" style="default"/>
            <Button text="Copy" style="default"/>
          </div>
        </div>
      )
  }
});
