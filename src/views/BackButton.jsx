/** @jsx React.DOM */
module.exports = React.createClass({
  render: function(){
    return (
      <div onClick={this.props.onClick} className="BackButton">
        <i className="fa fa-chevron-left"></i>
      </div>
    )
  }
});