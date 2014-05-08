/** @jsx React.DOM */
module.exports = React.createClass({
  getDefaultProps: function(){
    return {
      name: 'Base State',
      children: [],
      index: 1
    }
  },
  render: function(){
    return (
      <div className="StateWrapper">
        <h3><span className="counter">{ this.props.index + 1 }</span> { this.props.name }</h3>
        <div className="Browser">
          <div className="WindowWrapper">
            { this.props.children }
          </div>
        </div>
      </div>
    )
  }
});