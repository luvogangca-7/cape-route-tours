import express from 'express';
import mysql from 'mysql2/promise';

const router = express.Router();

export default (dbConfig) => {
  const pool = mysql.createPool(dbConfig);

  // POST /api/blogs
  router.post('/', async (req, res) => {
    try {
      const { title, author, location, imageUrl, content } = req.body;

      
      if (!title || !content || !location) {
        return res.status(400).json({ 
          error: 'Title, content and location are required' 
        });
      }

      const [result] = await pool.execute(
        `INSERT INTO blogs 
         (title, author, location, image_url, content, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [title, author, location, imageUrl, content]
      );

      res.status(201).json({
        success: true,
        blogId: result.insertId
      });

    } catch (error) {
      console.error('Error creating blog:', error);
      res.status(500).json({ 
        error: 'Failed to create blog post',
        details: error.message 
      });
    }
  });

  // GET /blogs
  router.get('/', async (req, res) => {
    try {
      const [blogs] = await pool.execute(`
        SELECT id, title, author, location, 
               image_url as imageUrl,
               content,
               created_at
        FROM blogs
        ORDER BY created_at DESC
      `);
      res.json(blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({ error: 'Failed to fetch blogs' });
    }
  });

  // GET /blogs/others/:excludeId - IMPORTANT: This must come BEFORE the /:id route
  router.get('/others/:excludeId', async (req, res) => {
    try {
      const { excludeId } = req.params;

      console.log('Fetching other blogs, excluding ID:', excludeId); // Debug log

      // Fetch other blogs excluding the current one, limit 3 and include content for preview
      const [others] = await pool.execute(
        `SELECT id, title, author, location, image_url as imageUrl, content, created_at
         FROM blogs
         WHERE id != ?
         ORDER BY created_at DESC
         LIMIT 3`,
        [excludeId]
      );

      console.log('Found other blogs:', others.length); // Debug log
      res.json(others);

    } catch (error) {
      console.error('Error fetching other blogs:', error);
      res.status(500).json({ error: 'Failed to fetch other blogs' });
    }
  });

  // GET /blogs/:id - Get single blog details
  router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      console.log('Fetching blog with ID:', id); // Debug log

      const [rows] = await pool.execute(
        `SELECT id, title, author, location, image_url as imageUrl, content, created_at
         FROM blogs
         WHERE id = ?`,
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Blog not found' });
      }

      console.log('Found blog:', rows[0].title); // Debug log
      res.json(rows[0]);
    } catch (error) {
      console.error('Error fetching blog details:', error);
      res.status(500).json({ error: 'Failed to fetch blog details' });
    }
  });

  // PUT /blogs/:id - Update blog (changed from PATCH to PUT for consistency with frontend)
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, author, location, imageUrl, content } = req.body;

      if (!title || !content || !location) {
        return res.status(400).json({ 
          error: 'Title, content and location are required' 
        });
      }

      const [result] = await pool.execute(
        `UPDATE blogs 
         SET title = ?, author = ?, location = ?, image_url = ?, content = ?
         WHERE id = ?`,
        [title, author, location, imageUrl, content, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Blog not found' });
      }

      res.json({
        success: true,
        message: 'Blog updated successfully'
      });

    } catch (error) {
      console.error('Error updating blog:', error);
      res.status(500).json({ 
        error: 'Failed to update blog post',
        details: error.message 
      });
    }
  });

  // DELETE /blogs/:id - Delete blog
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const [result] = await pool.execute(
        'DELETE FROM blogs WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Blog not found' });
      }

      res.json({
        success: true,
        message: 'Blog deleted successfully'
      });

    } catch (error) {
      console.error('Error deleting blog:', error);
      res.status(500).json({ 
        error: 'Failed to delete blog post',
        details: error.message 
      });
    }
  });

  return router;
};