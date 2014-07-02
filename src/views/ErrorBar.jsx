/** @jsx React.DOM */
module.exports = React.createClass({
  getInitialState: function(){
    return {
      toggled: false
    }
  },
  toggle: function(){
    this.setState({
      toggled: !this.state.toggled
    });
  },
  render: function() {
    var text;
    switch(this.props.type) {
      case 'error':
        text = 'Could Not Connect';
        break;
      case 'warning':
        text = 'Service Unavailable';
        break;
    }
    return (
      <div className={"ErrorBar " + (this.state.toggled ? 'open' : 'closed') + " " + this.props.type } onClick={this.toggle}>
        <div className="Title">
          <i className="fa fa-exclamation-triangle"></i>
          { text }
          <i className="fa fa-chevron-down"></i>
        </div>
        <div className="Message">
          Maybe try turning it off and back on again?
        </div>
      </div>
    )
  }
});
