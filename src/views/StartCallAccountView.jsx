/** @jsx React.DOM */
BaseStateCorner = require('./BaseStateCorner.jsx');
Window = require('./Window.jsx');
StartCallAccount = require('./StartCallAccount.jsx');

module.exports = React.createClass({
  render: function() {
    return (
        <BaseStateCorner name={ this.props.name } index={ this.props.index }>
          <Window extraClass="InCall" items={ this.props.items } title="Call Drake?" type="">
            <StartCallAccount />
          </Window>
        </BaseStateCorner>
    );
  }
});
