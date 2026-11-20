import PostItem from './PostItem'

function PostList({ posts, onLike, onDelete }) {
    return (
        <ul className="post-list">
            {posts.map((p) => 
            <PostItem
            key={p.id} id={p.id} title={p.title} author={p.author} likes={p.likes} onLike={onLike} onDelete={onDelete}/>
            )}
        </ul>
    );
}

export default PostList;