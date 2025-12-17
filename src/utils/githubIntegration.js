/**
 * GitHub Plans Integration Helper (Optional)
 * 
 * This file provides utilities to save/load ROLS plans from GitHub Gists
 * For production use, you'll need to:
 * 1. Create a GitHub Personal Access Token
 * 2. Store it securely (not in the app)
 * 3. Use a backend service to handle token management
 */

// Example: How to save plans to GitHub Gist (requires backend)
export const saveToGitHub = async (plans, gistToken) => {
  try {
    const content = JSON.stringify(plans, null, 2);
    
    const response = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: {
        'Authorization': `token ${gistToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: 'Canyon Clash ROLS Plans Backup',
        public: false,
        files: {
          'rols-plans.json': {
            content: content
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save to GitHub');
    }

    const data = await response.json();
    return data.id; // Return Gist ID for later updates
  } catch (error) {
    console.error('GitHub save error:', error);
    throw error;
  }
};

// Example: How to load plans from GitHub Gist
export const loadFromGitHub = async (gistId) => {
  try {
    const response = await fetch(`https://api.github.com/gists/${gistId}`);
    
    if (!response.ok) {
      throw new Error('Failed to load from GitHub');
    }

    const data = await response.json();
    const plans = JSON.parse(data.files['rols-plans.json'].content);
    return plans;
  } catch (error) {
    console.error('GitHub load error:', error);
    throw error;
  }
};

/**
 * ALTERNATIVE: Save to GitHub Repository
 * 
 * For a more permanent solution, you can save plans to a GitHub repository
 * This requires a backend service that handles authentication
 */

export const saveToGitHubRepo = async (plans, backendUrl, token) => {
  try {
    const response = await fetch(`${backendUrl}/api/save-plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ plans })
    });

    if (!response.ok) {
      throw new Error('Failed to save plans to repository');
    }

    return await response.json();
  } catch (error) {
    console.error('Repository save error:', error);
    throw error;
  }
};

/**
 * SETUP INSTRUCTIONS FOR GITHUB INTEGRATION:
 * 
 * 1. Create a GitHub Personal Access Token:
 *    - Go to https://github.com/settings/tokens
 *    - Create a new token with 'gist' scope
 *    - Copy the token (you'll only see it once!)
 * 
 * 2. Store securely:
 *    - NEVER commit the token to your repository
 *    - Store in environment variables
 *    - Use a backend service for sensitive operations
 * 
 * 3. Create a backend service to handle:
 *    - Token storage and refresh
 *    - GitHub API requests
 *    - Error handling
 *    - Rate limiting
 * 
 * 4. Integrate with ROLSPlans component:
 *    - Add GitHub save button
 *    - Add GitHub load functionality
 *    - Show sync status to user
 * 
 * EXAMPLE BACKEND (Node.js/Express):
 * 
 * app.post('/api/save-plans', async (req, res) => {
 *   const { plans } = req.body;
 *   const token = process.env.GITHUB_TOKEN;
 *   
 *   try {
 *     const response = await fetch('https://api.github.com/gists', {
 *       method: 'POST',
 *       headers: {
 *         'Authorization': `token ${token}`,
 *         'Content-Type': 'application/json'
 *       },
 *       body: JSON.stringify({
 *         description: 'Canyon Clash ROLS Plans',
 *         public: false,
 *         files: {
 *           'rols-plans.json': { content: JSON.stringify(plans, null, 2) }
 *         }
 *       })
 *     });
 *     
 *     const data = await response.json();
 *     res.json({ success: true, gistId: data.id });
 *   } catch (error) {
 *     res.status(500).json({ error: error.message });
 *   }
 * });
 */
