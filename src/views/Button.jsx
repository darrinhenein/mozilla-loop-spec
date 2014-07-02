/** @jsx React.DOM */
module.exports = React.createClass({
  render: function() {
    var icon, chevron;
    if(this.props.icon)
    {
      icon = <i className={"fa " + this.props.icon}></i>
    }
    if(this.props.hasRightChevron)
    {
      chevron = <span className="chevron"> ▾ </span>;
    }
    return (
      <div id={this.props.id} onClick={this.props.onClick} className={"Button " + this.props.style }>{ this.props.text }{icon}{chevron}</div>
    )
  }
});
