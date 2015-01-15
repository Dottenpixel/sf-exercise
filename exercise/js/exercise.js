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
	handleShowPanel: function(e) {
		this.setState({ "data" : { 
			"active" : true,
			"currentActivePostId" : e.detail.postId 
			} 
		});
	},
	componentDidMount: function() {
		window.addEventListener('show_panel', this.handleShowPanel);
	},
	componentWillUnmount: function() {
		window.removeEventListener('show_panel', this.handleShowPanel);
	},
	render: function() {
		var currentPost = this.props.feedData.first(function(o){ return o.postid === this.state.data.currentActivePostId }.bind(this));
		var feedPosts = this.props.feedData.map(function (feedPost) {
			return (
				<FeedPost postData={feedPost} userId={this.props.userId} />
			);
		}.bind(this));
		var panelClass = "postPanel" + ( this.state.data.active ? "-active" : "-inactive" );
		return (
			<div className="feedList">
				<div className="feedPosts">
					{feedPosts}
				</div>
				<PostPanel key="postPanelAnim" panelClass={panelClass} currentPost={currentPost} />
			</div>
		);
	}
});

var FeedPost = React.createClass({
	render: function() {
		var deleteBtn = this.props.postData.uid === this.props.userId ? <PostDeleteBtn postId={this.props.postData.postid} /> : "";
		return (
			<div className="feedPost">
				{deleteBtn}
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
					<CommentLink comments={this.props.postData.comments} postId={this.props.postData.postid} />
				</div>
			</div>
		);
	}
});

var PostDeleteBtn = React.createClass({
	handleClick: function(e){
		e.preventDefault();
		//create event to trigger modal prompt
		window.dispatchEvent(new CustomEvent('delete_post_click', { 'detail': { "postId" : this.props.postId } }));
	},
	render: function() {
		return (
			<button className="postDeleteBtn close" postId={this.props.postid} onClick={this.handleClick} type="button" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		)
	}
});

var PostDeletePromptModal = React.createClass({
	handleCancelClick: function(e){
		e.preventDefault();
		window.dispatchEvent(new CustomEvent('delete_post_cancel', { 'detail': { "postId" : this.props.postId } }));
		return false;
	},
	handleConfirmClick: function(e){
		e.preventDefault();
		window.dispatchEvent(new CustomEvent('delete_post', { 'detail': { "postId" : this.props.postId } }));
		return false;
	},
	render: function() {
		var modalStyle = this.props.show ? { "display" : "block" } : null;
		var modalClass = this.props.show ?  "modal fade in" : "modal fade";
		return (
			<div className={modalClass} style={modalStyle} onClick={this.handleCancelClick}>
			  <div className="modal-dialog">
			    <div className="modal-content">
			      <div className="modal-header">
			        <h4 className="modal-title">Delete</h4>
			      </div>
			      <div className="modal-body">
			        <p>Are you sure you want to delete this post?</p>
			      </div>
			      <div className="modal-footer">
			        <button type="button" className="btn btn-default" onClick={this.handleConfirmClick}>Yes</button>
			        <button type="button" className="btn btn-default" onClick={this.handleCancelClick}>No</button>
			      </div>
			    </div>
			  </div>
			</div>
		)
	}
});

var PostPanel = React.createClass({
	render: function() {
		console.log(this.props);
		var currentPost = this.props.currentPost ? (
				<div className="panelBody">
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
				</div>) : (null);
		var postId = this.props.currentPost ? this.props.currentPost.postid : null;
		return (
			<div className={"postPanel " + this.props.panelClass}>
				{currentPost}
				<CommentComposeForm postId={postId} />
			</div>
		);
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
		e.preventDefault();
		window.dispatchEvent(new CustomEvent('show_panel', { 'detail': { "postId" : this.props.postId } }));
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
			"user" : userData,
			"modal" : {}
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
		var newState = this.state;
		newState.data.feed.forEach(function(o){
			if( o.postid === e.detail.postId ) {
				o.comments.push(newComment);
				return;
			}
		});
		this.setState(newState);
	},
	handleDeletePostClick: function(e) {
		var newState = this.state;
		newState.data.modal = { 
			"showModal" : true,
			"currentPostId" : e.detail.postId
		};
		this.setState(newState);
	},
	handleDeletePostCancel: function(e) {
		var newState = this.state;
		newState.data.modal = {};
		this.setState(newState);
	},
	handleDeletePost: function(e) {
		var newState = this.state;
		newState.data.modal = {};
		newState.data.feed = newState.data.feed.filter(function(o){
			return o.postid !== e.detail.postId;
		});
		this.setState(newState);
	},
	componentDidMount: function() {
		window.addEventListener('comment_added', this.handleCommentAdded);
		window.addEventListener('delete_post_click', this.handleDeletePostClick);
		window.addEventListener('delete_post_cancel', this.handleDeletePostCancel);
		window.addEventListener('delete_post', this.handleDeletePost);
	},
	componentWillUnmount: function() {
		window.removeEventListener('comment_added', this.handleCommentAdded);
		window.removeEventListener('delete_post_click', this.handleDeletePostClick);
		window.removeEventListener('delete_post_cancel', this.handleDeletePostCancel);
		window.removeEventListener('delete_post', this.handleDeletePost);
	},
	render: function() {
		var appClass = "commentApp " + (this.state.data.modal.showModal ? "show-modal" : "");
		return (
			<div className={appClass} >
				<AppHeader userData={this.state.data.user} />
				<ReactCSSTransitionGroup transitionName="slidePostPanel">
					<FeedList feedData={this.state.data.feed} userId={this.state.data.user.uid} />
				</ReactCSSTransitionGroup>
				<PostDeletePromptModal show={this.state.data.modal.showModal} postId={this.state.data.modal.currentPostId} />
			</div>
		);
	}
});

React.render(
	<CommentApp />,
	document.getElementById('content')
);