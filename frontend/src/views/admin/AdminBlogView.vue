<template>
  <div class="container-fluid py-4" style="min-height:100vh; background-color: #f8f9fa;">
    <div class="row mb-4">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <div>
          <h1 class="display-5 fw-bold text-dark mb-1">Blog Management</h1>
          <p class="text-muted fs-5">Create and manage blog posts</p>
        </div>
        <div>
          <button class="btn btn-outline-secondary me-2" @click="fetchBlogs"><i class="bi bi-arrow-clockwise me-1"></i> Refresh</button>
          <button class="btn btn-primary" @click="toggleForm">{{ showAdd ? 'Cancel' : 'Add New Blog' }}</button>
        </div>
      </div>
    </div>

    <div v-if="showAdd" class="row mb-4">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h5 class="mb-3">{{ editingBlog ? 'Edit Blog' : 'Create New Blog' }}</h5>

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Title <span class="text-danger">*</span></label>
                <input v-model="title" class="form-control" />
              </div>

              <div class="col-md-3">
                <label class="form-label">Author <span class="text-danger">*</span></label>
                <input v-model="author" class="form-control" />
              </div>

              <div class="col-md-3">
                <label class="form-label">Location <span class="text-danger">*</span></label>
                <input v-model="location" class="form-control" />
              </div>

              <div class="col-12">
                <label class="form-label">Main Image URL</label>
                <input v-model="imageUrl" class="form-control" placeholder="Paste image URL here..." />
              </div>

              <div class="col-12">
                <label class="form-label">Main Content <span class="text-danger">*</span></label>
                <quill-editor
                  ref="quillEditor"
                  v-model:content="content"
                  contentType="html"
                  :options="editorOptions"
                  @update:content="onContentChange"
                  style="min-height: 220px; background: white;"
                />
              </div>

              <div class="col-12 d-flex justify-content-end">
                <button class="btn btn-secondary me-2" @click="resetForm">Reset</button>
                <button class="btn btn-success" @click="editingBlog ? updateBlog() : submitBlog()">{{ editingBlog ? 'Update Blog' : 'Post Blog' }}</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Blogs Posted</h5>
            <small class="text-muted">{{ blogs.length }} posts</small>
          </div>
          <div class="card-body">
            <div v-if="blogs.length === 0" class="text-center py-5 text-muted">No blogs yet.</div>

            <div class="row g-3">
              <div class="col-12 col-md-6 col-lg-4" v-for="blog in blogPreviews" :key="blog.id">
                <div class="card h-100 shadow-sm">
                  <img v-if="blog.imageUrl" :src="blog.imageUrl" class="card-img-top" style="height:180px; object-fit:cover;" />
                  <div class="card-body d-flex flex-column">
                    <h6 class="card-title">{{ blog.title }}</h6>
                    <p class="text-muted small mb-2">{{ blog.author }} • {{ formatDate(blog.created_at) }}</p>
                    <p class="mb-3 text-truncate" style="max-height:3.6em; overflow:hidden">{{ blog.preview }}</p>
                    <div class="mt-auto d-flex gap-2">
                      <button class="btn btn-sm btn-outline-primary" @click="editBlog(blog)">Edit</button>
                      <button class="btn btn-sm btn-outline-danger" @click="deleteBlog(blog.id)">Delete</button>
                      <a v-if="blog.id" :href="`/blog/${blog.id}`" target="_blank" class="btn btn-sm btn-primary ms-auto">View</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
  name: 'AdminBlogView',
  components: { QuillEditor },
  data() {
    return {
      blogs: [],
      showAdd: false,
      content: '',
      title: '',
      author: '',
      location: '',
      imageUrl: '',
      editingBlog: null,
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
      return this.blogs.map(blog => {
        const contentField = blog.content || blog.body || blog.text || blog.description || blog.main_content || '';
        const preview = this.generatePreview(contentField);
        return { ...blog, preview };
      })
    }
  },
  methods: {
    toggleForm() { this.showAdd = !this.showAdd; if(!this.showAdd) this.resetForm() },
    onContentChange(content) { this.content = content },
    async submitBlog() {
      try {
        const plainTextContent = this.content.replace(/<[^>]*>/g, '').trim();
        if (!this.title.trim() || !this.author.trim() || !this.location.trim() || !plainTextContent) {
          alert('Please complete all required fields');
          return;
        }
        const payload = { title: this.title.trim(), author: this.author.trim(), location: this.location.trim(), imageUrl: this.imageUrl?.trim() || null, content: this.content };
        const response = await axios.post('http://localhost:5000/api/blogs', payload, { headers: { 'Content-Type': 'application/json' } });
        alert('Blog posted successfully!');
        this.resetForm();
        await this.fetchBlogs();
      } catch (err) { console.error(err); alert('Failed to post blog') }
    },
    async fetchBlogs() { try { const res = await axios.get('http://localhost:5000/api/blogs'); this.blogs = res.data || []; } catch (err) { console.error(err) } },
    resetForm() { this.title=''; this.author=''; this.location=''; this.imageUrl=''; this.content=''; this.editingBlog=null; this.showAdd=false },
    editBlog(blog) { this.editingBlog=blog; this.title=blog.title; this.author=blog.author; this.location=blog.location; this.imageUrl=blog.imageUrl||''; this.content=blog.content; this.showAdd=true },
    async updateBlog() { try { const payload = { title:this.title.trim(), author:this.author.trim(), location:this.location.trim(), imageUrl:this.imageUrl?.trim()||null, content:this.content }; await axios.put(`http://localhost:5000/api/blogs/${this.editingBlog.id}`, payload); alert('Blog updated'); this.resetForm(); await this.fetchBlogs(); } catch (err) { console.error(err); alert('Update failed') } },
    async deleteBlog(id) { if(!confirm('Delete this blog?')) return; try { await axios.delete(`http://localhost:5000/api/blogs/${id}`); alert('Deleted'); await this.fetchBlogs(); } catch (err) { console.error(err); alert('Delete failed') } },
    generatePreview(content, maxLength=120) { if(!content) return 'No content available'; try { const tmp=document.createElement('div'); tmp.innerHTML=content; let txt=tmp.textContent||tmp.innerText||''; txt=txt.replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim(); if(!txt) return 'No content available'; let preview=txt.substring(0,maxLength); const lastSpace=preview.lastIndexOf(' '); if(lastSpace>0 && txt.length>maxLength) preview=preview.substring(0,lastSpace)+'...'; return preview; } catch(e){return 'Preview unavailable'} },
    formatDate(dateString){ if(!dateString) return 'No date'; try{ const iso=dateString.replace(' ','T'); const d=new Date(iso); if(isNaN(d.getTime())) return 'Invalid date'; return d.toLocaleDateString('en-US',{ year:'numeric', month:'long', day:'numeric' }); }catch(e){return 'Invalid date'} }
  },
  created(){ this.fetchBlogs() }
}

</script>

<style scoped>
  .card { border-radius: 10px; }
  .card-img-top { border-top-left-radius: 10px; border-top-right-radius: 10px; }
  .text-truncate { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
</style>