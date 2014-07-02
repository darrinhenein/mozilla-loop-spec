/** @jsx React.DOM */
BaseStateCorner = require('./BaseStateCorner.jsx');
Window = require('./Window.jsx');
LinkPrompt = require('./LinkPrompt.jsx');

module.exports = React.createClass({
  render: function() {
    return (
        <BaseStateCorner name={ this.props.name } index={ this.props.index }>
          <Window items={ this.props.items } title="Call Failed" type="">
            <LinkPrompt />
          </Window>
        </BaseStateCorner>
    );
  }
});
