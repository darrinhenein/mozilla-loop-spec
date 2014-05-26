/** @jsx React.DOM */
module.exports = React.createClass({
  getDefaultProps: function(){
    return {
      name: 'Note View'
    }
  },
  componentDidMount: function(){
    var comp = this;
    $(this.refs.container.getDOMNode()).html(this.props.note);

    $(this.refs.container.getDOMNode()).on('mouseenter', 'a', function(e){
      var target = $(this.hash, $(comp.getDOMNode()).closest('.component-wrapper'));
      $(target).addClass('Highlighted');
    });

    $(this.refs.container.getDOMNode()).on('mouseleave', 'a', function(e){
      var target = $(this.hash, $(comp.getDOMNode()).closest('.component-wrapper'));
      $(target).removeClass('Highlighted');
    });

    $(this.refs.container.getDOMNode()).on('click', 'a', function(e){
      e.preventDefault();
    });
  },
  render: function(){
    return (
      <div className="Notes" ref="container">
      </div>
    )
  }
});
