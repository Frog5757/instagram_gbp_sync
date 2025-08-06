// src/components/PostList.tsx
import React from "react";
import type { PostListProps, PostItemProps } from "../types/insta";

const PostItem: React.FC<PostItemProps> = ({ post, handleSync, formatDate }) => {
  return (
    <div className="post-item-container">
      <div className="post-item">
        <div className="post-item-image">
          <img
            src={post.media_url || "/placeholder-image.png"}
            alt="Instagram投稿"
            className="post-item-img"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-image.png";
            }}
          />
        </div>

        <div className="post-item-info">
          <p className="post-item-caption">
            {post.caption || "(キャプションなし)"}
          </p>
          <p className="post-item-date">{formatDate(post.timestamp)}</p>
          <button onClick={() => handleSync(post.id)} className="sync-button">
            {post.is_synced ? "再同期" : "同期する"}
          </button>
        </div>
      </div>
    </div>
  );
};

const PostList: React.FC<PostListProps> = ({ 
  posts, 
  filter, 
  handleSync, 
  formatDate 
}) => {
  return (
    <div className="post-list-container">
      <div className="post-list-header">
        <h2 className="post-list-title">投稿一覧</h2>
      </div>

      <div className="post-list-items">
        {posts.length === 0 ? (
          <div className="no-posts-text">
            {filter === "all" 
              ? "投稿がありません" 
              : `${filter === "synced" ? "同期済み" : "未同期"}の投稿がありません`
            }
          </div>
        ) : (
          posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              handleSync={handleSync}
              formatDate={formatDate}
              filter={filter}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PostList;

