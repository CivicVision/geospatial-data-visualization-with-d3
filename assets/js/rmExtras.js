window.readPost = function(post) {
  var postID = post.id;
  var categorySlug = post.categorySlug;
	var cachedPosts = JSON.parse(localStorage.getItem('rmCachedPosts')) || [];
	cachedPosts.unshift([postID, categorySlug.split(',')]);

	if (cachedPosts.length > 20) { cachedPosts.pop(); }

	// leaderboard for categories
	var leaderboard = {};
	var totalRead = cachedPosts.length;
	cachedPosts.forEach(function(pageview, idx) {
		var pID = pageview[0]; var categories = pageview[1];
		var score = 0.5 + ((1.0 - (idx / totalRead)) * 0.5);
		categories.forEach(function(cID) {
			leaderboard[cID] = leaderboard[cID] || [];
			leaderboard[cID].push([pID, score]);
		});
	});

	var winningScore = 0;
	var winningCategory = null;
	Object.keys(leaderboard).forEach(function(category) {
		var categoryScore = 0;
		var pageviews = leaderboard[category];
		pageviews.forEach(function(pageview) {
			categoryScore = categoryScore + pageview[1];
		});
		leaderboard[category] = categoryScore;
		if (categoryScore > winningScore) {
			winningScore = categoryScore;
			winningCategory = category;
		}
	});
	window.rmExtras.winningCategory = winningCategory;

	localStorage.setItem('rmCachedPosts', JSON.stringify(cachedPosts));
};

window.sendToRM = function(key, value) {
	window.rmExtras[key] = value;
};
