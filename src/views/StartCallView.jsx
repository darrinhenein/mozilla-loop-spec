/** @jsx React.DOM */
BaseStateCorner = require('./BaseStateCorner.jsx');
Window = require('./Window.jsx');
StartCall = require('./StartCall.jsx');

module.exports = React.createClass({
  render: function() {
    return (
        <BaseStateCorner name={ this.props.name } index={ this.props.index }>
          <Window extraClass="InCall" items={ this.props.items } title="Call this link?" type="">
            <StartCall />
          </Window>
        </BaseStateCorner>
    );
  }
});
