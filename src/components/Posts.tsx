import { useState } from "react";
import "./Posts.css"
import '../pages/Home.css';
export interface IPost {}


const Post: React.FunctionComponent<IPost> = (props) => {
    const [PostTitle, setPostTitle] = useState<string>("");
    const [PostBody, setPostBody] = useState<string>("");
    const [PostImage, setPostImage] = useState<string>("");
    const [Post, setPost] = useState<IPost[]>([]);


    const handleChange = (event: any) => {
        const name = event.target.name;
        const value = event.target.value;
        if (name === "PostTitle") {
            setPostTitle(value);
        } else if (name === "PostBody") {
            setPostBody(value);
        } else if (name === "PostImage") {
            setPostImage(value);
        }
    } 

    function handleSubmit(event:any) {
        console.log(Post);
        event.preventDefault();
        setPost([...Post, { PostTitle, PostBody, PostImage }]);
        event.target.reset();
    }
   
    return(
        <div className='post-container'>
            <form className='post-form' onChange={(event:any)=>handleChange(event)} onSubmit={(event:any)=>handleSubmit(event)}>

                <input type='file' accept="image/*" name="PostImage" id="post-image"  className='post-image' placeholder='select an image'/>

                <div className="posts-head">
                    <h2 className='section-title'>Write new post</h2>
                    {/* <label htmlFor="profile-selector">Select profile to publish from:</label> */}
                    <select name="profile-selector" id="post-profile-selector">
                        <option value="profile1">Select profile to publish from:</option>
                        <option value="profile1">profile1</option>
                        <option value="profile2">profile2</option>
                        <option value="profile3">profile3</option>
                        <option value="profile4">profile4</option>
                    </select>
                </div>

                <input type='text' name="PostTitle" id="post-title" className="post-title" placeholder='Type the title of the text here'/>

                <textarea className="post-body" name="PostBody" placeholder='write your post here'/>

                <div className="post-controls">
                    {/* 1st: try to find out why event here is not working */}
                    <button className='button-post-form'>Cancel</button>
                    <button className='button-post-form'>Publish</button>
                </div>
            </form>
        </div>
    )
}

export default Post;
