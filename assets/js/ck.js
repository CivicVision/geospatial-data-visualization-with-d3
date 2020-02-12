window.sendTags = function(subscriberId, tagId) {

  const url = 'https://baihh9wyp5.execute-api.us-east-1.amazonaws.com/dev/tag_subscriber';
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify({
      subscriber_id: subscriberId,
      tag_id: tagId
    })
  };
  fetch(url, options)
    .then(response => {
      let resp = response;
    });
}
window.maybeAddTags = function(post) {
	var ckId = localStorage.getItem('rmpanda.sources.convertkit.subscriberId');
  if(ckId != "" && post.tagId != "") {
    window.sendTags(ckId, post.tagId);
  }
}
