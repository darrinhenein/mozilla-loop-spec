/** @jsx React.DOM */
BaseStateCorner = require('./BaseStateCorner.jsx');
Window = require('./Window.jsx');
AudioCall = require('./AudioCall.jsx');

module.exports = React.createClass({
  render: function() {
    return (
        <BaseStateCorner name={ this.props.name } index={ this.props.index }>
          <Window items={ this.props.items } title="Aubrey Drake Graham">
            <AudioCall />
          </Window>
        </BaseStateCorner>
    );
  }
});
