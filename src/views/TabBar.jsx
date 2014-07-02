/** @jsx React.DOM */
module.exports = React.createClass({
  componentDidMount: function(){
    var disabled = this.props.disabled;
    if(disabled) {
      $('li', this.getDOMNode()).filter(function(i){
        return disabled.indexOf(i) > -1;
      }).remove();
    }
  },
  render: function() {
    if(this.props.disabled && this.props.disabled.length > 1) return (<div></div>);
    return (
      <ul className="TabBar">
        <li className={(this.props.selected === 0) ? 'active tip' : 'tip'} data-tip="Call Tab">
          <a href="#precall"><i className="fa fa-comment-o"></i></a>
        </li>
        <li id="tabbar-history" className={(this.props.selected === 1) ? 'active tip' : 'tip'} data-tip="Call History Tab">
          <a href="#callhistory"><i className="fa fa-clock-o"></i></a>
        </li>
        <li id="tabbar-contacts" className={(this.props.selected === 2) ? 'active tip' : 'tip'} data-tip="Contacts">
          <a href="#contacts"><i className="fa fa-book"></i></a>
        </li>
      </ul>
    )
  }
});
