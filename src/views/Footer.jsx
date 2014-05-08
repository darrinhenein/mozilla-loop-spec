/** @jsx React.DOM */
module.exports = React.createClass({
  render: function(){
    return (
      <div className="Footer tip" data-tip="Sign in to Firefox Account (or other)">
        {this.props.linkText}
      </div>
    )
  }
})
