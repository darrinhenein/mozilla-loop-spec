/** @jsx React.DOM */
module.exports = React.createClass({
  render: function(){
    var linkView = function(item, index){
      return (<a href={"#" + item.slug}>{item.name}</a>)
    }.bind(this);

    return (
      <div ref="container" className="TableOfContents">
        {this.props.items.map(linkView)}
      </div>
    )
  }
});