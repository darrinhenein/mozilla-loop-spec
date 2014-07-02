/** @jsx React.DOM */
BaseStateCorner = require('./BaseStateCorner.jsx');
TabBar = require('./TabBar.jsx');
Window = require('./Window.jsx');
Defaults = require('../utils/defaults');

module.exports = React.createClass({
  getInitialState: function(){
    return {
      selected: null
    }
  },
  selectHappy: function(){
    this.setState({
      selected: 'happy'
    });
    this.open();
  },
  selectSad: function(){
    this.setState({
      selected: 'sad'
    });
    this.open();
  },
  submit: function(){
    this.setState({
      selected: 'thanks'
    });
  },
  open: function(){
    $(this.refs.panel.getDOMNode()).velocity({
      translateX: '-50%'
    }, Defaults.animation);
  },
  close: function(){
    $(this.refs.panel.getDOMNode()).velocity({
      translateX: '0'
    }, Defaults.animation);
  },
  render: function() {
    var formHtml;
    if(this.state.selected == 'happy')
    {
      formHtml =
        <div>
          <h3>Thank you for your feedback!</h3>
          <small>This window will close in 2 seconds</small>
        </div>
      ;
    } else if(this.state.selected == 'thanks')
    {
      formHtml = <div>
        <h3>Thank you for your feedback</h3>
        <h6>This window will close in 5 seconds</h6>
      </div>;
    } else
    {
      formHtml =
        <div>
          <div className="Back" onClick={this.close}>
            <i className="fa fa-angle-left"></i>
            Back
          </div>
          <h3>What makes you sad?</h3>
          <div className="Form">
            <input type="radio" name="what" value="audio"/>Audio Quality<br/>
            <input type="radio" name="what" value="video"/>Video Quality<br/>
            <input type="radio" name="what" value="diconnected"/>Was Disconnected<br/>
            <input type="radio" name="what" value="ui"/>Confusing<br/>
            <input type="radio" name="what" value="other"/>Other<br/>
            <input type="text" name="what" placeholder="Comment here..."/>
            <Button text="Submit" style="action" onClick={this.submit} />
          </div>

        </div>
      ;
    }
    return (
        <BaseStateCorner name={ this.props.name } index={ this.props.index }>
          <Window items={ this.props.items }>
            <div className="Feedback PanelGroup">
              <div ref="panel" className="PanelGroupInner">

                <div className="Inner">
                  <h3>{ STRINGS.feedbackQuestion }</h3>
                  <div className="Faces">
                    <div onClick={ this.selectHappy } className={ this.state.selected == 'happy' ? "happy active" : "happy" }></div>
                    <div onClick={ this.selectSad } className={this.state.selected == 'sad' ? "sad active" : "sad"}></div>
                  </div>
                </div>

                <div className="Inner">
                  { formHtml }
                </div>

              </div>
            </div>
          </Window>
        </BaseStateCorner>
    );
  }
});
