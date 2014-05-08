/** @jsx React.DOM */
module.exports = React.createClass({
  componentDidMount: function(){
    var target = this.getDOMNode();
    var spinner = new Spinner({
      color: '#999',
      width: 4,
      lines: 13,
      corners: 1.0,
      trail: 60
    }).spin(target);
  },
  render: function(){
    return (
      <div className="SpinnerView"></div>
    )
  }
});