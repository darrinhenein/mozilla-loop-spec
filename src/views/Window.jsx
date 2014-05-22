/** @jsx React.DOM */
var WindowTitlebar = React.createClass({
  render: function(){
    return (
      <div className={"WindowTitlebar " + this.props.type}>
        <h5>{this.props.title}</h5>
        <div className="WindowControls">
        </div>
      </div>
    )
  }
});

module.exports = React.createClass({
  render: function() {
    return (
      <div className={"Window " + this.props.extraClass}>
        <WindowTitlebar title={this.props.title} type={this.props.type}/>
        <div className="WindowBody">
          { this.props.children }
        </div>
      </div>
    )
  }
});
