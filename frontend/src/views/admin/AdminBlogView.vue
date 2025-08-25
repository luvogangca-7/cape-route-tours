<template>
    <div>
      <h1>Blog Management</h1>

      <button @click="showAdd = !showAdd; if(!showAdd) resetForm()">{{ showAdd? 'Cancel' : 'Add New Blog +' }}</button>

      <form @submit.prevent="editingBlog ? updateBlog() : submitBlog()" v-if="showAdd">

        <h2>{{ editingBlog ? 'Edit Blog' : 'Create New Blog' }}</h2>
        <br>

        <div class="group">
        <div class="input">
        <label for=""><b>Title</b> <span style="color: orangered"><b>*</b></span></label>
        <input type="text" id="name" v-model="title">
        </div>
        <div class="input">
        <label for=""><b>Author</b> <span style="color: orangered"><b>*</b></span></label>
        <input type="text" id="name" v-model="author">
        </div>
        </div>
        <div class="group">
        <div class="input">
        <label for=""><b>Location</b> <span style="color: orangered"><b>*</b></span></label>
        <input type="text" id="name" v-model="location">
        </div>
        <div class="input">
        <label for=""><b>Main Image</b></label>
        <input type="text" placeholder="  Paste the image URL here..." v-model="imageUrl">
        </div>
        </div>
        <hr>
        <label for=""><b>Main Content</b> <span style="color: orangered"><b>*</b></span></label>

         <quill-editor
            ref="quillEditor"
            v-model:content="content"
            contentType="html"
            :options="editorOptions"
            @update:content="onContentChange"
            style="height: 250px; background: white;"
        />

        <button type="submit" class='post'>{{ editingBlog ? 'Update Blog' : 'Post Blog' }}</button>
      </form>

      <h2>Blogs Posted</h2>

      <div class="blogs-cont">
        <div class="blog-card" v-for="blog in blogPreviews" :key="blog.id">
            <div class="img-cont">
                <img :src="blog.imageUrl" alt="">
            </div>
            <div class="details">

                <h2>{{ blog.title }}</h2>
                <p>{{ blog.author }} | {{ formatDate(blog.created_at) }}</p>
                <br>
                <p>{{ blog.preview }}</p>
                <br>
                <div class="btns">
                    <button @click="editBlog(blog)" type="button">Edit</button>
                    <button @click="deleteBlog(blog.id)" type="button" class="delete-btn">Delete</button>
                </div>
                

            </div>
        </div>
      </div>
    </div>
</template>
<script>

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import axios from 'axios'

export default {

components: {
    QuillEditor
},
data() {
  return {
    blogs: [],
    showAdd: false,
    content: '',
    title: '',
    author: '',
    location: '',
    imageUrl: '',
    editingBlog: null, // Track which blog is being edited
    editorOptions: {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ header: [1, 2, 3, false] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean']
        ]
      }
    }
  }
},
computed: {
    blogPreviews() {
      console.log('Computing blogPreviews, blogs array:', this.blogs); // Debug log
      return this.blogs.map(blog => {
        console.log('Processing blog:', blog); // Debug log
        console.log('Blog keys:', Object.keys(blog)); // Show all available fields
        
        // Try different possible field names for content
        const contentField = blog.content || blog.body || blog.text || blog.description || blog.main_content || '';
        console.log('Content field value:', contentField); // Debug log
        
        const preview = this.generatePreview(contentField);
        console.log('Generated preview for blog:', preview); // Debug log
        return {
          ...blog,
          preview: preview
        };
      });
    }
  },
methods: {
  onContentChange(content) {
    this.content = content;
    console.log("Content updated:", this.content);
  },
  
  async submitBlog() {
    try {
      console.log('Current content before submission:', this.content);
      
      // Validate all fields
      if (!this.title?.trim()) {
        throw new Error('Title is required');
      }
      
      if (!this.author?.trim()) {
        throw new Error('Author is required');
      }
      
      if (!this.location?.trim()) {
        throw new Error('Location is required');
      }
      
      // Check content - strip HTML tags to check if there's actual content
      const plainTextContent = this.content.replace(/<[^>]*>/g, '').trim();
      if (!plainTextContent) {
        throw new Error('Content cannot be empty');
      }

      // Prepare the payload
      const payload = {
        title: this.title.trim(),
        author: this.author.trim(),
        location: this.location.trim(),
        imageUrl: this.imageUrl?.trim() || null,
        content: this.content
      };

      // Make the request
      const response = await axios.post('http://localhost:5000/api/blogs', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Handle success
      console.log('Blog created:', response.data);
      alert(`Blog posted successfully! ID: ${response.data.blogId}`);
      
      // Reset form
      this.resetForm();
      await this.fetchBlogs();

    } catch (error) {
      console.error('Submission failed:', {
        error: error.message,
        stack: error.stack
      });
      alert(`Error: ${error.message}`);
    }
  },
  
  async fetchBlogs() {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs');
      console.log('Fetched blogs data:', response.data); // Debug log
      this.blogs = response.data;
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  },
  resetForm() {
    this.title = '';
    this.author = '';
    this.location = '';
    this.imageUrl = '';
    this.content = '';
    this.editingBlog = null; // Reset editing state
    this.showAdd = false;
  },

  // Edit blog functionality
  editBlog(blog) {
    this.editingBlog = blog;
    this.title = blog.title;
    this.author = blog.author;
    this.location = blog.location;
    this.imageUrl = blog.imageUrl || '';
    this.content = blog.content;
    this.showAdd = true; // Show the form
  },

  // Update existing blog
  async updateBlog() {
    try {
      console.log('Updating blog:', this.editingBlog.id);
      
      // Validate all fields
      if (!this.title?.trim()) {
        throw new Error('Title is required');
      }
      
      if (!this.author?.trim()) {
        throw new Error('Author is required');
      }
      
      if (!this.location?.trim()) {
        throw new Error('Location is required');
      }
      
      // Check content
      const plainTextContent = this.content.replace(/<[^>]*>/g, '').trim();
      if (!plainTextContent) {
        throw new Error('Content cannot be empty');
      }

      // Prepare the payload
      const payload = {
        title: this.title.trim(),
        author: this.author.trim(),
        location: this.location.trim(),
        imageUrl: this.imageUrl?.trim() || null,
        content: this.content
      };

      // Make the request
      const response = await axios.put(`http://localhost:5000/api/blogs/${this.editingBlog.id}`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Handle success
      console.log('Blog updated:', response.data);
      alert('Blog updated successfully!');
      
      // Reset form and refresh
      this.resetForm();
      await this.fetchBlogs();

    } catch (error) {
      console.error('Update failed:', {
        error: error.message,
        stack: error.stack
      });
      alert(`Error: ${error.message}`);
    }
  },

  // Delete blog functionality
  async deleteBlog(blogId) {
    if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/blogs/${blogId}`);
      alert('Blog deleted successfully!');
      await this.fetchBlogs(); // Refresh the list
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete blog. Please try again.');
    }
  },
  generatePreview(content, maxLength = 100) {
    console.log('generatePreview called with content:', content); // Debug log
    
    if (!content) {
      console.log('No content provided, returning empty string');
      return 'No content available';
    }

    try {
      // Method 1: Create temporary div to strip HTML and decode entities
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      let plainText = tempDiv.textContent || tempDiv.innerText || '';
      
      // Method 2: Additional regex cleanup for any remaining tags
      plainText = plainText.replace(/<[^>]*>/g, '');
      
      // Method 3: Clean up extra whitespace and line breaks
      plainText = plainText.replace(/\s+/g, ' ');
      
      console.log('Cleaned plain text:', plainText); // Debug log
      
      if (!plainText) {
        return 'No content available';
      }
      
      // Create preview
      let preview = plainText.substring(0, maxLength);
      
      // Cut at last space to avoid cutting words
      const lastSpace = preview.lastIndexOf(' ');
      if (lastSpace > 0 && plainText.length > maxLength) {
        preview = preview.substring(0, lastSpace) + '...';
      }
      
      console.log('Final preview:', preview); // Debug log
      return preview;
    } catch (error) {
      console.error('Error generating preview:', error);
      return 'Preview unavailable';
    }
  },
  formatDate(dateString) {
    // Handle null, undefined, or empty dateString
    if (!dateString) {
      return 'No date';
    }
    
    try {
      // Convert SQL datetime format to ISO format
      const isoString = dateString.replace(' ', 'T');
      const date = new Date(isoString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  }
},
created(){
  this.fetchBlogs();
}
 
}
</script>
<style>
    form {
        display: flex;
        flex-direction: column;
        background-color: rgb(218, 218, 218);
        margin: 20px;
        border-radius: 10px;
        padding: 10px;

    }

    input {
        height: 40px;
        border-radius: 5px;
        border-style: solid;
        margin-bottom: 10px;
    }

    textarea {
        min-height: 100px;
        border-width: 1.6px;
        border-radius: 5px;
        border-style: solid;
    }

input:focus, textarea:focus {
            outline: none;
            border-color: rgb(246, 196, 109);
            box-shadow: 0 0 0 3px rgba(246, 196, 109, 0.2);
        }

    .group {
        width: 100%;
        display: flex;
        flex: 1 1;
        gap: 10px;
    }

    .input {
        width: 50%;
    }

    .input input{
        width: 100%;
    }
    .blogs-cont {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        margin: 20px;
    }

    .blog-card {
        border-radius: 8px;
        box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.3);
        overflow: hidden;
    }

    .img-cont img {
        width: 100%;
        object-fit: cover;
    }

    .btns {
        display: flex;
        justify-content: space-around;
    }

    .btns button, button {
        padding: 8px;
        background-color: #091D35;
        color: white;
        font-family: inherit;
        border: none;
        border-radius: 6px;
        margin: 6px;
        cursor: pointer;
        
    }

    .btns button:hover, button:hover {
    color: rgb(246, 196, 109);
    }

    .btns button:active, button:active {
        background-color: #0e2d52;
        color: rgb(246, 196, 109);
    }

    .btns button {
        width:100%;
    }

    .post {
        margin-top: 10px;
    }

    .delete-btn {
        background-color: #dc3545 !important;
    }

    .delete-btn:hover {
        background-color: #c82333 !important;
        color: white !important;
    }

    hr {
        border-style: solid;
        margin-block: 30px;
        margin-inline: 20px;
        color:rgba(118, 118, 118, 0.7);
    }

</style>