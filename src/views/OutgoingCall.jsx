/** @jsx React.DOM */
Button = require('./Button.jsx');
LinkPrompt = require('./LinkPrompt.jsx');

module.exports = React.createClass({
  getInitialState: function(){
    return {
      isConnecting: true,
      states: [
        'connecting',
        'ringing'
      ],
      currentState: 0
    }
  },
  componentDidMount: function(){
    setInterval(function(){
      var s = this.state.currentState;
      s += 1;
      if (s > this.state.states.length-1) s = 0;
      this.setState({
        currentState: s
      })
    }.bind(this), 4000);
  },
  render: function(){
    var s = this.state.states[this.state.currentState];
    if(s == 'connecting'){
      return (
        <div className="OutgoingCall">
          <div className="avatar"></div>
          <h3>Kanye West</h3>
          <div className="Loading"></div>
          <h6>Connecting...</h6>
          <div className="ButtonGroup">
            <Button text="Cancel" style="cancel"/>
          </div>
        </div>
      )
    } else if(s == 'ringing') {
      return (
        <div className="OutgoingCall">
          <div className="avatar"></div>
          <h3>Kanye West</h3>
          <div className="Loading"></div>
          <h6>Ringing...</h6>
          <div className="ButtonGroup">
            <Button text="Cancel" style="cancel"/>
          </div>
        </div>
      )
    } else if(s == 'failed') {
      return (
        <div className="OutgoingCall">
          <div className="avatar"></div>
          <h3>Kanye West</h3>
          <div className="Loading failed"></div>
          <h6>Call Failed</h6>
          <div className="ButtonGroup">
            <Button text="Cancel" style="cancel"/>
            <Button text="Retry" style="emphasis"/>
            <Button text="Email Link" style="emphasis"/>
          </div>
        </div>
      )
    }
  }
});
