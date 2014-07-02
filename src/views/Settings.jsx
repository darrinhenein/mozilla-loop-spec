/** @jsx React.DOM */
BaseState = require('./BaseState.jsx');
TabBar = require('./TabBar.jsx');
Panel = require('./Panel.jsx');

module.exports = React.createClass({
  render: function() {
    return (
        <BaseState name={ this.props.name } index={ this.props.index }>
          <TabBar selected={this.props.tab} />
          <Panel items={ this.props.items }>
            <div className="Settings">
              <div className="Header">Settings</div>

              <div className="Option">
                <h4>Default Microphone</h4>
                <select>
                  <option>Internal Microphone</option>
                  <option>Microphone 2</option>
                </select>
              </div>

              <div className="Option">
                <h4>Default Camera</h4>
                <select>
                  <option>Front Camera</option>
                  <option>External Camera</option>
                </select>
              </div>

              <div className="Option">
                <h4>Default Answering Mode</h4>
                <select>
                  <option>Audio + Video</option>
                  <option>Audio Only</option>
                </select>
              </div>

            </div>
          </Panel>
          <Footer linkText={STRINGS.signOut} username={STRINGS.loggedInUsername}/>
        </BaseState>
    );
  }
});
