/** @jsx React.DOM */
module.exports = React.createClass({
  onClick: function(){
    this.props.onClick(this.props.key);
  },
  render: function(){
    return (
      <div onClick={this.onClick} className={["SmallProfile", "Profile", this.props.selected].join(' ')} >
        <div className={"avatar user-" + this.props.user.index}></div>
        <div className="details">
          <div className="username">{ this.props.user.name }</div>
          <div className="email">{ this.props.user.email }</div>
        </div>
      </div>
    )
  }
})
