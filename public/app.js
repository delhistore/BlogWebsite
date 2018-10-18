(function () {
	angular
		.module("Blog", [])
		.controller("BlogController", BlogController);

	function BlogController($scope, $http, $window) {
		$scope.createPost = createPost;
		$scope.deletePost = deletePost;
		$scope.editPost = editPost;
		$scope.updatePost = updatePost;
		$scope.postComment = postComment;

		init = () => {
			getPosts();	
		}
		
		init();

		function getPosts() {
			$http.get("/blogpost")
				.success( function(posts) { 
					$scope.posts = posts; 
				});
		}

		function createPost(post) {
			$http.post("/blogpost", post)
				.success(getPosts);
		}

		function deletePost(postId) {
			$http.delete("/blogpost/" + postId)
			.success(getPosts);
		};

		function editPost(postId) {			
			$scope.editing = true;
			$window.scrollTo(0, 0);
			$http.get("/blogpost/" + postId)
			.success( function(post) {
				console.log(post);
				$scope.post = post;		
			});
		};

		function updatePost(post) {
			console.log("now")
			console.log(post)
			$scope.editing = false;
			$http.put("/blogpost/" + post._id, post)
			.success(getPosts);			
			$scope.post = {};
		};

		function postComment(post) {
			console.log(post);
			$http.put("/blogpost/comment/" + post._id, post)
			.success(getPosts);
		};
	}

}) ();