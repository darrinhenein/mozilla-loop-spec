/** @jsx React.DOM */
module.exports = React.createClass({
  render: function(){
    return (
      <div className="Footer tip" data-tip="Sign in to Firefox Account (or other)">
        <div>
          <a>
            {this.props.username}
          </a>
        </div>
        <div className="action">
          {this.props.linkText}
        </div>
      </div>
    )
  }
})
