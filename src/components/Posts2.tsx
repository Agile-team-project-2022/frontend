import React, { useState } from "react";
import "./Posts2.css"
import '../pages/Home.css';
export interface IPost {}


const Post: React.FunctionComponent<IPost> = (props) => {
    const [PostTitle, setPostTitle] = useState<string>("");
    const [PostBody, setPostBody] = useState<string>("");
    const [PostImage, setPostImage] = useState<string>("");
    const [Post, setPost] = useState<IPost[]>([]);
    const [Profile, SetProfile] = useState<string>('');

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

    function Publishfrom(event:any) {
        SetProfile(event.target.value)
    }

    const profiles = ['profile1', 'profile2', 'profile3', 'profile4', 'profile5'];



   
    return(
        <form className='post-container' onChange={(event:any)=>handleChange(event)} onSubmit={(event:any)=>handleSubmit(event)}>
            <div className='post-form'>
                <label htmlFor="post-image" className='post-image'> 
                    Upload image
                    <input type='file' accept="image/*" name="PostImage" id="post-image"   placeholder='select an image'/>
                </label>

                <div className="posts-head">
                    <h2 className='section-title'>Write new post</h2>
                    {/* <label htmlFor="profile-selector">Select profile to publish from:</label> */}
                    <select id="post-profile-selector"  onChange={Publishfrom} value={Profile}>
                        <option value="profile1">Publish from:</option>
                        {/* <option value="profile1">profile1</option>
                        <option value="profile2">profile2</option>
                        <option value="profile3">profile3</option>
                        <option value="profile4">profile4</option> */}

                    {profiles.map((profile, i) => (
                        <option value={profile} key={i}>{profile}</option>
                    ))}
                    </select>
                </div>

                <input type='text' name="PostTitle" id="post-title" className="post-title" placeholder='Type the title of the text here'/>

                <textarea className="post-body" name="PostBody" placeholder='write your post here'/>

            </div>
            <div className="post-controls">
                {/* 1st: try to find out why event here is not working */}
                <button className='button-post-form'>Cancel</button>
                <button className='button-post-form'>Publish</button>
            </div>
        </form>
    )
}

export default Post;
