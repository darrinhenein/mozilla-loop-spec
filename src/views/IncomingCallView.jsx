/** @jsx React.DOM */
BaseStateCorner = require('./BaseStateCorner.jsx');
Window = require('./Window.jsx');
IncomingCall = require('./IncomingCall.jsx');

module.exports = React.createClass({
  render: function() {
    return (
        <BaseStateCorner name={ this.props.name } index={ this.props.index }>
          <Window items={ this.props.items } title="Call from Aubrey Drake Graham" type="">
            <IncomingCall />
          </Window>
        </BaseStateCorner>
    );
  }
});
