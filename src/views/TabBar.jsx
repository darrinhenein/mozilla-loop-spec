/** @jsx React.DOM */
module.exports = React.createClass({
  render: function() {
    return (
      <ul className="TabBar">
        <li className={(this.props.selected === 0) ? 'active tip' : 'tip'} data-tip="Call Tab">
          <a href="#precall"><i className="fa fa-phone"></i></a>
        </li>
        <li className={(this.props.selected === 1) ? 'active tip' : 'tip'} data-tip="Call History Tab">
          <a href="#callhistory"><i className="fa fa-clock-o"></i></a>
        </li>
        <li className={(this.props.selected === 2) ? 'active tip' : 'tip'} data-tip="Contacts">
          <a href="#contacts"><i className="fa fa-book"></i></a>
        </li>
      </ul>
    )
  }
});
