/** @jsx React.DOM */
module.exports = React.createClass({
  render: function() {
    return (
      <div className={"Panel " + this.props.extraClass}>
        { this.props.children }
      </div>
    )
  }
});
