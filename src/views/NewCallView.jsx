/** @jsx React.DOM */
SpinnerView = require('./SpinnerView.jsx');
BackButton = require('./BackButton.jsx');
Button = require('./Button.jsx');
var linkGenerationTime = 1000;

module.exports= React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function(){
    return {
      callDuration: 15,
      hasLink: false,
      gettingLink: false,
      callName: ''
    }
  },
  onClick: function() {
    if(this.state.callName == '') {
      $(this.refs.callerNameInput.getDOMNode()).addClass('error').focus();
      return;
    }
    var view = this;
    view.setState({
      gettingLink: true
    });
    this.timer = setTimeout(function(){
      view.setState({
        hasLink: true,
        gettingLink: false
      });
    }, linkGenerationTime);
  },
  componentDidUpdate: function(){
    if(this.state.callName != '' && !this.state.hasLink && !this.state.gettingLink) {
      $(this.refs.callerNameInput.getDOMNode()).removeClass('error');
    }
  },
  goBack: function(){
    $(this.getDOMNode()).trigger("PanelGroup", {type: "back"});
    this.cancelCall();
  },
  cancelCall: function() {
    clearTimeout(this.timer);
    this.setState({
      hasLink: false,
      gettingLink: false,
      callName: '',
      callDuration: 15
    });
  },
  render: function(){
    var linkSection;
    if(this.state.hasLink) {
      return (
        <div className="NewCallView">
          <BackButton onClick={this.goBack}/>
          <h3>{STRINGS.shareThisLinkWith} { this.state.callName }</h3>
          <input value={STRINGS.sampleCallURL}></input>
          <h5><i className="fa fa-clock-o"></i> Expires in { getTimeFromRange(this.state.callDuration) }</h5>
          <div className="ButtonGroup">
            <Button text="Copy" style="default"/>
            <Button text="Share" style="default"/>
            <Button onClick={this.cancelCall} text="Cancel" style="cancel"/>
          </div>
        </div>
      )
    } else if (this.state.gettingLink) {
      return (
        <div className="NewCallView">
          <BackButton onClick={this.goBack}/>
          <h3 className="center">Generating Invitation for { this.state.callName }</h3>
          <SpinnerView />
          <Button onClick={this.cancelCall} text="Cancel" style="cancel"/>
        </div>
      )
    } else {
      return (
        <div className="NewCallView">
          <BackButton onClick={this.goBack}/>
          <h3>New Invitation</h3>
          <input ref="callerNameInput" valueLink={this.linkState('callName')} placeholder={STRINGS.callNamePlaceholder}></input>
          <h5><i className="fa fa-clock-o"></i> {STRINGS.inviteExpireIn} { getTimeFromRange(this.state.callDuration) }.</h5>
          <input valueLink={this.linkState('callDuration')} type="range" name="time" min="1" max="100"></input>
          <Button onClick={this.onClick} style="action" text={STRINGS.getLinkText}/>
        </div>
      )
    }
  }
});