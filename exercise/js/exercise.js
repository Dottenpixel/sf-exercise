var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
React.initializeTouchEvents(true);

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
		return { "data" : {
			"active" : false,
			"currentActivePostId" : null
			}
		}
	},
	showPanel: function(postId) {
		console.log("I got your click, rather dirty, but I got it", postId);
		// show panel
		// toggle active
		// hopefully set state to trigger re-render
		this.setState({ "data" : { 
			"active" : true,
			"currentActivePostId" : postId 
			} 
		});
	},
	render: function() {
		var currentPost = this.props.feedData.first(function(o){ return o.postid === this.state.data.currentActivePostId }.bind(this));
		var feedPosts = this.props.feedData.map(function (feedPost) {
			return (
				<FeedPost postData={feedPost} handleCommentLinkClick={this.showPanel} />
			);
		}.bind(this));
		return (
			<div>
				<div className="feedList">
					{feedPosts}
				</div>
				<PostPanel className="postPanel" currentPost={currentPost} />
			</div>
		);
	}
});

var FeedPost = React.createClass({
	handleCommentLinkClick: function() {
		this.props.handleCommentLinkClick(this.props.postData.postid);
	},
	render: function() {
		return (
			<div className="feedPost">
				<div className="img-avatar">
					<img src={this.props.postData.avatar} alt={this.props.postData.name}/>
				</div>
				<div className="post-content">
					<h3 className="feedAuthor">
						{this.props.postData.name}
					</h3>
					<TimeStamp timestamp={this.props.postData.timestamp} />
					<p className="feedPostContent">
						{this.props.postData.content}
					</p>
					<CommentLink comments={this.props.postData.comments} handleCommentLinkClick={this.handleCommentLinkClick}  />
				</div>
			</div>
		);
	}
});

var PostPanel = React.createClass({
	handleCommentComposeSubmit: function(){

	},
	render: function() {
		console.log(this.props);
		return this.props.currentPost ? (
			<div className="postPanel">
				<div className="img-avatar">
					<img src={this.props.currentPost.avatar} alt={this.props.currentPost.name}/>
				</div>
				<div className="post-content">
					<h3 className="feedAuthor">
						{this.props.currentPost.name}
					</h3>
					<TimeStamp timestamp={this.props.currentPost.timestamp} />
					<p className="feedPostContent">
						{this.props.currentPost.content}
					</p>
				</div>
				<CommentList comments={this.props.currentPost.comments} />
				<CommentComposeForm postId={this.props.currentPost.postid} />
			</div>
		) : (<div />);
	}
});

var CommentList = React.createClass({
	render: function() {
		var comments = this.props.comments.map(function(o){
			return (
				<Comment commentData={o} />
			);
		})
		return (
			<div className="commentList">
				<p>Comments:</p>
				{ comments }				
			</div>
		)
	}
});

var Comment = React.createClass({
	render: function() {
		return (
			<div className="comment">
				<div className="img-avatar">
					<img src={this.props.commentData.avatar} alt={this.props.commentData.name}/>
				</div>
				<div className="post-content">
					<h3 className="commentAuthor">
						{this.props.commentData.name}
					</h3>
					<TimeStamp timestamp={this.props.commentData.timestamp} />
					<p className="commentContent">
						{this.props.commentData.content}
					</p>
				</div>
			</div>
		)
	}
})

var CommentComposeForm = React.createClass({
	handleChange: function(e) {
		var submitNode = this.refs.submit.getDOMNode();
		e.target.value.length > 0 ? submitNode.removeAttribute("disabled") : submitNode.setAttribute("disabled",true);
  },
	handleSubmit: function(e) {
		e.preventDefault();
		var commentText = this.refs.commentText.getDOMNode().value.trim();
		if (!commentText) return;
		this.refs.commentText.getDOMNode().value = '';
		window.dispatchEvent(new CustomEvent('comment_added', { 'detail': { "commentText" : commentText, "postId" : this.props.postId } }));
	},
	render: function() {
		return (
			<form className="commentForm" onSubmit={this.handleSubmit}>
				<input type="text" placeholder="Write a comment..." ref="commentText" onChange={this.handleChange} />
				<input type="submit" value="Post" disabled="disabled" ref="submit" />
			</form>
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
});

var CommentLink = React.createClass({
	handleClick: function(e) {
		this.props.handleCommentLinkClick();
	},
	render: function() {
		var commentsCount = this.props.comments.length;
		return (
			<a className="commentLink" href="#" onClick={this.handleClick}>
				{commentsCount} comment{commentsCount > 1 ? "s" : ""}
			</a>
		)
	}
});

var CommentApp = React.createClass({
	getInitialState: function() {
		return { "data" : {
			"feed" : feedData,
			"user" : userData
			}
		}
	},
	handleCommentAdded: function(e) {
		var newComment = {
			"name" : this.state.data.user.name,
			"avatar" : this.state.data.user.avatar,
			"timestamp" : moment().format('YYYY-MM-DD HH:mm:ss'),
			"content" : e.detail.commentText
		};
		var newState = this.state.data;
		newState.feed.forEach(function(o){
			if( o.postid === e.detail.postId ) {
				o.comments.push(newComment);
				return;
			}
		});
		this.setState(newState);
	},
	componentDidMount: function() {
    window.addEventListener('comment_added', this.handleCommentAdded);
  },
  componentWillUnmount: function() {
    window.removeEventListener('comment_added', this.handleCommentAdded);
  },
	render: function() {
		return (
			<div class="commentApp">
				<AppHeader userData={this.state.data.user} />
				<FeedList feedData={this.state.data.feed} />
			</div>
		);
	}
});

React.render(
	<CommentApp />,
	document.getElementById('content')
);