var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var AppHeader = React.createClass({
	getInitialState: function() {
		return { data : userData };
	},
	render: function() {
		console.log(this.state.data);
		return (
			<div className="appHeader">
				<div className="img-avatar">
					<img src={this.state.data.avatar} alt={this.state.data.name} />
				</div>
			</div>
		);
	}
});

var FeedList = React.createClass({
	getInitialState: function() {
		return { data : feedData };
	},
	render: function() {
		var feedPosts = this.state.data.map(function (feedPost) {
      return (
        <FeedPost postData={feedPost} />
      );
    });
		return (
			<div className="feedList">
				{feedPosts}
			</div>
		);
	}
});

var PostPanel = React.createClass({
	render: function() {
		return (
			<div className="postPanel">
				
			</div>
		);
	}
});
var TimeStamp = React.createClass({
	render: function() {
		return (
			<div className="timeStamp">
				{moment(this.props.timestamp, "YYYY-MM-DD hh:mm:ss").fromNow()}
			</div>
		);
	}
})
var CommentLink = React.createClass({
	render: function() {
		var commentsCount = this.props.comments.length;
		var handleClick = function(e) {
			e.preventDefault();
		}
		return (
			<a className="commentLink" onClick={handleClick}>
				{commentsCount} comment{commentsCount > 1 ? "s" : ""}
			</a>
		)
	}
})
var FeedPost = React.createClass({
  render: function() {
    return (
      <div className="feedPost">
      	<div className="img-avatar">
      		<img src={this.props.postData.avatar} alt={this.props.postData.name}/>
      	</div>
        <h3 className="feedAuthor">
          {this.props.postData.name}
        </h3>
        <TimeStamp timestamp={this.props.postData.timestamp} />
        <p className="feedPostContent">
        	{this.props.postData.content}
        </p>
        <CommentLink comments={this.props.postData.comments} />
      </div>
    );
  }
});

var CommentApp = React.createClass({
	render: function() {
		return (
			<div>
				<AppHeader />
				<FeedList />
				<PostPanel />
			</div>
		);
	}
});

React.render(
	<CommentApp />,
	document.getElementById('content')
);