/** @jsx React.DOM */
BaseStateCorner = require('./BaseStateCorner.jsx');
Window = require('./Window.jsx');
IncomingCallUnknown = require('./IncomingCallUnknown.jsx');

module.exports = React.createClass({
  render: function() {
    return (
        <BaseStateCorner name={ this.props.name } index={ this.props.index }>
          <Window items={ this.props.items } title={STRINGS.callNamePlaceholder} type="">
            <IncomingCallUnknown />
          </Window>
        </BaseStateCorner>
    );
  }
});
