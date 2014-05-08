/** @jsx React.DOM */
BaseStateCorner = require('./BaseStateCorner.jsx');
BuddyList = require('./BuddyList.jsx');
Window = require('./Window.jsx');

module.exports = React.createClass({
  render: function() {
    return (
        <BaseStateCorner name={ this.props.name } index={ this.props.index }>
          <Window items={ this.props.items } title="Contacts">
            <BuddyList items={this.props.items} />
          </Window>
        </BaseStateCorner>
    );
  }
});