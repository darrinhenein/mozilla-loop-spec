/** @jsx React.DOM */
module.exports = React.createClass({
  render: function() {
    return (
      <div id={this.props.id} onClick={this.props.onClick} className={"Button " + this.props.style }>{ this.props.text }</div>
    )
  }
});
