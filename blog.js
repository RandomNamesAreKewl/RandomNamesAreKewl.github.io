// TODO: auto detect all posts
const posts = [
    "2,7,22",
    "8,17,22"
];


for(var i=posts.length - 1; i>=0; i--) {
    var cur_post = posts[i];
    fetch("./posts/" + cur_post + ".html").then(res => res.text()).then(content => {
        let post_body = document.createElement("div");
        post_body.classList.add("blog_post");
        post_body.innerHTML = content;
        post_body.appendChild(document.createElement("br"));
        let date = document.createElement("span");
        date.classList.add("post_date");
        date.innerText = "Posted on " + cur_post.replace(",", "/").replace(",", "/");
        post_body.appendChild(date);
        document.getElementById("content").appendChild(post_body);
    });
}
